"""
Tests for AntimEnvironment complete implementation.
"""

import pytest
from antim_env.environment import AntimEnvironment
from antim_env.models import AntimAction, CaseState
from antim_env.cases import load_random_case


@pytest.fixture
def env():
    """Fixture providing an AntimEnvironment instance."""
    return AntimEnvironment()


def test_environment_initialization(env):
    """Test environment initializes correctly."""
    assert env.case is None
    assert env.state is None
    assert env.delay_sim is not None
    assert env.prev_state is None


def test_reset_creates_case(env):
    """Test reset creates a new case."""
    obs = env.reset()
    assert env.case is not None
    assert env.state is not None
    assert obs.phase == "farewell"
    assert obs.days_elapsed == 0


def test_reset_with_specific_case(env):
    """Test reset with specific case ID."""
    obs = env.reset(case_id="CASE_001")
    assert env.case.case_id == "CASE_001"
    assert "Ramesh Kumar" in obs.message


def test_step_requires_reset(env):
    """Test that step raises error before reset."""
    action = AntimAction(tool_name="get_case_context", parameters={})
    with pytest.raises(RuntimeError):
        env.step(action)


def test_get_case_context(env):
    """Test get_case_context tool."""
    env.reset(case_id="CASE_001")
    action = AntimAction(tool_name="get_case_context", parameters={})
    result = env.step(action)
    assert "CASE CONTEXT" in result.message
    assert "Ramesh Kumar" in result.message


def test_check_document_status_death_slip(env):
    """Test checking death slip status."""
    env.reset()
    action = AntimAction(tool_name="check_document_status", parameters={"document_type": "death_slip"})
    result = env.step(action)
    assert "Death Slip" in result.message
    assert "Not yet obtained" in result.message


def test_book_funeral_service(env):
    """Test booking funeral service."""
    env.reset()
    action = AntimAction(
        tool_name="book_funeral_service",
        parameters={"vendor_id": "Vendor_001", "slot_time": "10:00 AM"}
    )
    result = env.step(action)
    assert "Funeral service booked" in result.message
    assert env.state.funeral_completed
    assert env.state.death_slip_obtained


def test_submit_death_certificate_application(env):
    """Test submitting death certificate application."""
    env.reset()
    # First book funeral
    env.step(AntimAction(tool_name="book_funeral_service", parameters={"vendor_id": "V1", "slot_time": "10:00"}))
    # Then apply for death certificate
    action = AntimAction(
        tool_name="submit_death_certificate_application",
        parameters={"municipality_id": "MUN_001"}
    )
    result = env.step(action)
    assert "Application" in result.message or "accepted" in result.message.lower()
    assert env.state.death_certificate_applied


def test_notify_bank(env):
    """Test notifying a bank."""
    env.reset(case_id="CASE_001")
    # First get death certificate
    env.step(AntimAction(tool_name="book_funeral_service", parameters={"vendor_id": "V1", "slot_time": "10:00"}))
    env.step(AntimAction(tool_name="submit_death_certificate_application", parameters={"municipality_id": "M1"}))
    env.state.death_certificate_obtained = True  # Simulate immediate issuance
    
    # Now notify bank
    action = AntimAction(
        tool_name="notify_bank",
        parameters={"bank_id": "SBI", "account_type": "savings"}
    )
    result = env.step(action)
    assert "SBI" in result.message
    assert "SBI" in env.state.banks_notified


def test_file_insurance_claim(env):
    """Test filing insurance claim."""
    env.reset(case_id="CASE_001")
    # Get death certificate first
    env.state.death_certificate_obtained = True
    
    action = AntimAction(
        tool_name="file_insurance_claim",
        parameters={"policy_id": "LIC-001", "claim_type": "death"}
    )
    result = env.step(action)
    assert "LIC-001" in env.state.insurance_claims_filed


def test_check_government_scheme_eligibility(env):
    """Test checking government scheme eligibility."""
    env.reset(case_id="CASE_001")
    action = AntimAction(
        tool_name="check_government_scheme_eligibility",
        parameters={"scheme_name": "widow_pension"}
    )
    result = env.step(action)
    assert "widow_pension" in result.message.lower() or "widow" in result.message.lower()
    assert "widow_pension" in env.state.schemes_applied


def test_escalate_delay(env):
    """Test escalating a delay."""
    env.reset()
    action = AntimAction(
        tool_name="escalate_delay",
        parameters={"office_id": "MUN_001", "reason": "Missing documents"}
    )
    result = env.step(action)
    assert "Grievance" in result.message
    assert "GRV-" in result.message


def test_get_next_critical_deadline(env):
    """Test getting next critical deadline."""
    env.reset()
    action = AntimAction(tool_name="get_next_critical_deadline", parameters={})
    result = env.step(action)
    assert "LEGAL CONSEQUENCES" in result.message


def test_advance_time(env):
    """Test advancing time."""
    env.reset()
    action = AntimAction(tool_name="advance_time", parameters={"days": 3})
    result = env.step(action)
    assert "Time advanced" in result.message
    assert env.state.days_elapsed == 3


def test_advance_time_invalid_days(env):
    """Out-of-range days are rejected by Pydantic schema validation
    BEFORE the tool runs — the observation surfaces the schema error."""
    env.reset()
    action = AntimAction(tool_name="advance_time", parameters={"days": 10})
    result = env.step(action)
    assert "Schema validation failed" in result.message
    assert result.error is not None
    assert env.state.days_elapsed == 0  # tool was not executed


def test_complete_workflow(env):
    """Test a complete workflow."""
    env.reset(case_id="CASE_001")
    
    # Step 1: Book funeral
    result = env.step(AntimAction(tool_name="book_funeral_service", parameters={"vendor_id": "V1", "slot_time": "10:00"}))
    assert env.state.funeral_completed
    
    # Step 2: Apply for death certificate
    result = env.step(AntimAction(tool_name="submit_death_certificate_application", parameters={"municipality_id": "M1"}))
    assert env.state.death_certificate_applied
    
    # Step 3: Simulate certificate obtained
    env.state.death_certificate_obtained = True
    env.state.death_certificate_day = 5
    
    # Step 4: Notify bank
    result = env.step(AntimAction(tool_name="notify_bank", parameters={"bank_id": "SBI", "account_type": "savings"}))
    assert "SBI" in env.state.banks_notified
    
    # Step 5: File insurance claim
    result = env.step(AntimAction(tool_name="file_insurance_claim", parameters={"policy_id": "LIC-001", "claim_type": "death"}))
    assert "LIC-001" in env.state.insurance_claims_filed
    
    # Step 6: Apply for scheme
    result = env.step(AntimAction(tool_name="check_government_scheme_eligibility", parameters={"scheme_name": "widow_pension"}))
    assert "widow_pension" in env.state.schemes_applied


def test_unknown_tool(env):
    """Test calling unknown tool."""
    env.reset()
    action = AntimAction(tool_name="unknown_tool", parameters={})
    result = env.step(action)
    assert "Unknown tool" in result.message


def test_episode_termination(env):
    """Test episode termination conditions."""
    env.reset(case_id="CASE_001")
    
    # Complete critical tasks
    env.state.funeral_completed = True
    env.state.death_certificate_obtained = True
    env.state.banks_notified = ["SBI"]
    
    # Should be terminal
    assert env.state.is_terminal()
    
    # Step should return done=True
    action = AntimAction(tool_name="get_case_context", parameters={})
    result = env.step(action)
    assert result.done


def test_reward_computation(env):
    """Test that rewards are computed."""
    env.reset()
    action = AntimAction(tool_name="get_case_context", parameters={})
    result = env.step(action)
    assert isinstance(result.reward, float)
    assert result.reward >= -1.0


def test_phase_transitions(env):
    """Test phase transitions."""
    env.reset()
    assert env.state.current_phase == "farewell"
    
    # Book funeral
    env.step(AntimAction(tool_name="book_funeral_service", parameters={"vendor_id": "V1", "slot_time": "10:00"}))
    
    # Advance time to closure phase
    env.step(AntimAction(tool_name="advance_time", parameters={"days": 3}))
    assert env.state.current_phase == "closure"
    
    # Advance time to continuity phase (need to do it in steps of 1-7 days)
    env.step(AntimAction(tool_name="advance_time", parameters={"days": 7}))
    env.step(AntimAction(tool_name="advance_time", parameters={"days": 7}))
    env.step(AntimAction(tool_name="advance_time", parameters={"days": 7}))
    assert env.state.current_phase == "continuity"
