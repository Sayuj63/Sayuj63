"""
Tests for AntimEnvironment core functionality.
"""

import pytest
from antim_env.environment import AntimEnvironment
from antim_env.models import AntimAction, AntimObservation
from antim_env.rewards import compute_final_reward


class TestEnvironmentBasics:
    """Test basic environment functionality."""

    def test_reset_returns_observation(self):
        """Test that reset returns a valid AntimObservation."""
        env = AntimEnvironment()
        obs = env.reset()

        # Check type
        assert isinstance(obs, AntimObservation)

        # Check message is not empty
        assert obs.message is not None
        assert len(obs.message) > 0

        # Check days_elapsed is 0
        assert obs.days_elapsed == 0

        # Check phase is "farewell"
        assert obs.phase == "farewell"

    def test_reset_with_specific_case(self):
        """Test reset with specific case ID."""
        env = AntimEnvironment()
        obs = env.reset(case_id="CASE_001")

        assert env.case.case_id == "CASE_001"
        assert "Ramesh Kumar" in obs.message

    def test_reset_with_random_case(self):
        """Test reset with random case."""
        env = AntimEnvironment()
        obs = env.reset()

        assert env.case is not None
        assert env.state is not None
        assert obs.phase == "farewell"


class TestFuneralService:
    """Test funeral service booking."""

    def test_book_funeral_service(self):
        """Test booking funeral service."""
        env = AntimEnvironment()
        env.reset()

        action = AntimAction(
            tool_name="book_funeral_service",
            parameters={"vendor_id": "pune_cremation_001", "slot_time": "2024-01-01T10:00:00"},
        )
        result = env.step(action)

        # Check that funeral_completed becomes True
        assert env.state.funeral_completed is True

        # Check observation
        assert isinstance(result, AntimObservation)
        assert "Funeral service booked" in result.message

        # Check death slip is obtained
        assert env.state.death_slip_obtained is True

    def test_book_funeral_twice_fails(self):
        """Test that booking funeral twice fails."""
        env = AntimEnvironment()
        env.reset()

        # First booking
        action1 = AntimAction(
            tool_name="book_funeral_service",
            parameters={"vendor_id": "v1", "slot_time": "10:00"},
        )
        env.step(action1)

        # Second booking should fail
        action2 = AntimAction(
            tool_name="book_funeral_service",
            parameters={"vendor_id": "v2", "slot_time": "11:00"},
        )
        result = env.step(action2)

        assert "already completed" in result.message.lower()


class TestWrongSequence:
    """Test penalties for wrong action sequences."""

    def test_wrong_sequence_penalty(self):
        """Test that notifying bank without death certificate gives penalty."""
        env = AntimEnvironment()
        env.reset(case_id="CASE_001")

        # Try to notify bank without death certificate
        action = AntimAction(
            tool_name="notify_bank",
            parameters={"bank_id": "SBI", "account_type": "savings"},
        )
        result = env.step(action)

        # Check that message warns about needing death certificate
        assert "death certificate" in result.message.lower()

        # Check that reward is negative or zero
        assert result.reward <= 0.0

    def test_file_claim_without_bank_notification(self):
        """Test that filing claim without bank notification fails."""
        env = AntimEnvironment()
        env.reset(case_id="CASE_001")

        # Simulate having death certificate
        env.state.death_certificate_obtained = True

        # Try to file claim without bank notification
        action = AntimAction(
            tool_name="file_insurance_claim",
            parameters={"policy_id": "LIC-001", "claim_type": "death"},
        )
        result = env.step(action)

        # Should fail or give warning
        assert "bank" in result.message.lower() or result.reward < 0.0


class TestDeadlinePenalty:
    """Test deadline penalties."""

    def test_deadline_penalty(self):
        """Test penalty for missing 21-day death certificate deadline."""
        env = AntimEnvironment()
        env.reset(case_id="CASE_001")

        # Advance time to day 25 without getting death certificate
        env.state.days_elapsed = 25
        env.state.death_certificate_obtained = False

        # Compute final reward
        reward = compute_final_reward(env.state)

        # Check that reward is low due to penalty
        assert reward < 0.3

    def test_funeral_delay_penalty(self):
        """Test penalty for delayed funeral."""
        env = AntimEnvironment()
        env.reset(case_id="CASE_001")

        # Advance time beyond 3 days without funeral
        env.state.days_elapsed = 5
        env.state.funeral_completed = False

        # Compute final reward
        reward = compute_final_reward(env.state)

        # Check that reward is low
        assert reward < 0.2

    def test_early_certificate_bonus(self):
        """Test bonus for getting certificate before deadline."""
        env = AntimEnvironment()
        env.reset(case_id="CASE_001")

        # Complete tasks early
        env.state.funeral_completed = True
        env.state.death_certificate_obtained = True
        env.state.death_certificate_day = 10
        env.state.banks_notified = ["SBI"]
        env.state.days_elapsed = 10

        # Compute final reward
        reward = compute_final_reward(env.state)

        # Check that reward includes bonus
        assert reward > 0.5


class TestCompleteEpisode:
    """Test complete episode workflows."""

    def test_complete_simple_episode(self):
        """Test a complete valid sequence for a simple case."""
        env = AntimEnvironment()
        env.reset(case_id="CASE_001")

        # Step 1: Book funeral service
        result1 = env.step(
            AntimAction(
                tool_name="book_funeral_service",
                parameters={"vendor_id": "v1", "slot_time": "10:00"},
            )
        )
        assert env.state.funeral_completed

        # Step 2: Submit death certificate application
        result2 = env.step(
            AntimAction(
                tool_name="submit_death_certificate_application",
                parameters={"municipality_id": "m1"},
            )
        )
        assert env.state.death_certificate_applied

        # Simulate certificate obtained
        env.state.death_certificate_obtained = True
        env.state.death_certificate_day = 5

        # Step 3: Advance time
        result3 = env.step(AntimAction(tool_name="advance_time", parameters={"days": 3}))
        assert env.state.days_elapsed == 4  # 1 from funeral + 3 from advance_time

        # Step 4: Notify bank
        result4 = env.step(
            AntimAction(
                tool_name="notify_bank",
                parameters={"bank_id": "SBI", "account_type": "savings"},
            )
        )
        assert "SBI" in env.state.banks_notified

        # Step 5: File insurance claim
        result5 = env.step(
            AntimAction(
                tool_name="file_insurance_claim",
                parameters={"policy_id": "LIC-001", "claim_type": "death"},
            )
        )
        assert "LIC-001" in env.state.insurance_claims_filed

        # Compute final reward
        final_reward = compute_final_reward(env.state)

        # Check that final reward is above 0.5
        assert final_reward > 0.5

    def test_episode_termination(self):
        """Test that episode terminates when critical tasks are done."""
        env = AntimEnvironment()
        env.reset(case_id="CASE_001")

        # Complete critical tasks
        env.state.funeral_completed = True
        env.state.death_certificate_obtained = True
        env.state.banks_notified = ["SBI"]

        # Check that is_terminal returns True
        assert env.state.is_terminal()

    def test_episode_termination_by_time(self):
        """Test that episode terminates after 30 days."""
        env = AntimEnvironment()
        env.reset(case_id="CASE_001")

        # Advance time beyond 30 days
        env.state.days_elapsed = 31

        # Check that is_terminal returns True
        assert env.state.is_terminal()


class TestConcurrentSessions:
    """Test concurrent environment sessions."""

    def test_concurrent_sessions(self):
        """Test that two environments have independent state."""
        # Create first environment
        env1 = AntimEnvironment()
        obs1 = env1.reset(case_id="CASE_001")

        # Create second environment
        env2 = AntimEnvironment()
        obs2 = env2.reset(case_id="CASE_002")

        # Verify they have different cases
        assert env1.case.case_id == "CASE_001"
        assert env2.case.case_id == "CASE_002"

        # Verify they have independent state
        assert env1.state is not env2.state
        assert env1.case is not env2.case

        # Modify env1 state
        env1.state.funeral_completed = True

        # Verify env2 state is unchanged
        assert env2.state.funeral_completed is False

    def test_multiple_resets(self):
        """Test that resetting environment creates new state."""
        env = AntimEnvironment()

        # First reset
        obs1 = env.reset(case_id="CASE_001")
        case1_id = env.case.case_id
        state1 = env.state

        # Second reset
        obs2 = env.reset(case_id="CASE_002")
        case2_id = env.case.case_id
        state2 = env.state

        # Verify different cases
        assert case1_id == "CASE_001"
        assert case2_id == "CASE_002"

        # Verify different states
        assert state1 is not state2


class TestToolExecution:
    """Test individual tool execution."""

    def test_get_case_context(self):
        """Test get_case_context tool."""
        env = AntimEnvironment()
        env.reset(case_id="CASE_001")

        action = AntimAction(tool_name="get_case_context", parameters={})
        result = env.step(action)

        assert "CASE CONTEXT" in result.message
        assert "Ramesh Kumar" in result.message

    def test_check_document_status(self):
        """Test check_document_status tool."""
        env = AntimEnvironment()
        env.reset()

        action = AntimAction(
            tool_name="check_document_status",
            parameters={"document_type": "death_slip"},
        )
        result = env.step(action)

        assert "Death Slip" in result.message

    def test_advance_time(self):
        """Test advance_time tool."""
        env = AntimEnvironment()
        env.reset()

        initial_days = env.state.days_elapsed

        action = AntimAction(tool_name="advance_time", parameters={"days": 5})
        result = env.step(action)

        assert env.state.days_elapsed == initial_days + 5

    def test_advance_time_invalid_days(self):
        """Out-of-range days are rejected by Pydantic schema validation
        BEFORE the tool runs — the observation surfaces the schema error."""
        env = AntimEnvironment()
        env.reset()

        action = AntimAction(tool_name="advance_time", parameters={"days": 10})
        result = env.step(action)

        assert "Schema validation failed" in result.message
        assert result.error is not None
        assert "advance_time" in result.error
        assert env.state.days_elapsed == 0  # tool was not executed


class TestPhaseTransitions:
    """Test workflow phase transitions."""

    def test_phase_farewell_to_closure(self):
        """Test transition from farewell to closure phase."""
        env = AntimEnvironment()
        env.reset()

        assert env.state.current_phase == "farewell"

        # Book funeral
        env.step(
            AntimAction(
                tool_name="book_funeral_service",
                parameters={"vendor_id": "v1", "slot_time": "10:00"},
            )
        )

        # Advance time to closure phase
        env.step(AntimAction(tool_name="advance_time", parameters={"days": 3}))

        assert env.state.current_phase == "closure"

    def test_phase_closure_to_continuity(self):
        """Test transition from closure to continuity phase."""
        env = AntimEnvironment()
        env.reset()

        # Complete farewell phase
        env.state.funeral_completed = True
        env.state.death_slip_obtained = True

        # Complete closure phase
        env.state.death_certificate_obtained = True
        env.state.banks_notified = ["SBI"]

        # Advance time to continuity phase (need to do it in steps of 1-7 days)
        env.step(AntimAction(tool_name="advance_time", parameters={"days": 7}))
        env.step(AntimAction(tool_name="advance_time", parameters={"days": 7}))
        env.step(AntimAction(tool_name="advance_time", parameters={"days": 7}))
        env.step(AntimAction(tool_name="advance_time", parameters={"days": 1}))  # Need to go past 21 days

        assert env.state.current_phase == "continuity"


class TestRewardSignal:
    """Test reward signal generation."""

    def test_positive_reward_for_valid_action(self):
        """Test that valid actions generate positive rewards."""
        env = AntimEnvironment()
        env.reset()

        action = AntimAction(tool_name="get_case_context", parameters={})
        result = env.step(action)

        assert result.reward >= 0.0

    def test_negative_reward_for_wrong_sequence(self):
        """Test that wrong sequences generate negative rewards."""
        env = AntimEnvironment()
        env.reset()

        # Try to notify bank without death certificate
        action = AntimAction(
            tool_name="notify_bank",
            parameters={"bank_id": "SBI", "account_type": "savings"},
        )
        result = env.step(action)

        assert result.reward <= 0.0
