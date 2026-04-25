"""
Tests for AntimEnv reward computation functions.
"""

import pytest
from antim_env.cases import load_random_case
from antim_env.models import CaseState
from antim_env.rewards import (
    compute_final_reward,
    compute_phase_reward,
    compute_step_reward,
    get_reward_explanation,
    compute_episode_return,
)


class TestFinalReward:
    """Test compute_final_reward function."""

    def test_full_completion_reward(self):
        """Test reward for completing all tasks within deadline."""
        case = load_random_case("CASE_001")
        state = CaseState(case=case)

        # Complete all tasks
        state.funeral_completed = True
        state.death_certificate_obtained = True
        state.death_certificate_day = 10
        state.banks_notified = ["SBI", "HDFC"]
        state.insurance_claims_filed = ["LIC-001"]
        state.schemes_applied = ["widow_pension"]
        state.days_elapsed = 15

        reward = compute_final_reward(state)

        # Check that reward is high
        assert reward > 0.8

    def test_deadline_miss_penalty(self):
        """Test penalty for missing 21-day death certificate deadline."""
        case = load_random_case("CASE_001")
        state = CaseState(case=case)

        # Miss deadline
        state.days_elapsed = 25
        state.death_certificate_obtained = False

        reward = compute_final_reward(state)

        # Check that reward is low due to penalty
        assert reward < 0.3

    def test_funeral_delay_penalty(self):
        """Test penalty for delayed funeral."""
        case = load_random_case("CASE_001")
        state = CaseState(case=case)

        state.days_elapsed = 5
        state.funeral_completed = False

        reward = compute_final_reward(state)

        assert reward < 0.2

    def test_early_certificate_bonus(self):
        """Test bonus for getting certificate before deadline."""
        case = load_random_case("CASE_001")
        state = CaseState(case=case)

        state.funeral_completed = True
        state.death_certificate_obtained = True
        state.death_certificate_day = 10
        state.banks_notified = ["SBI"]
        state.days_elapsed = 10

        reward = compute_final_reward(state)

        assert reward > 0.5

    def test_nri_bonus(self):
        """Test bonus for NRI case with funeral."""
        case = load_random_case("CASE_007")  # NRI case
        state = CaseState(case=case)

        state.funeral_completed = True

        reward = compute_final_reward(state)

        # Should include NRI bonus
        assert reward > 0.05

    def test_reward_clamped_to_range(self):
        """Test that reward is clamped to [0.0, 1.0]."""
        case = load_random_case("CASE_001")
        state = CaseState(case=case)

        # Complete all tasks
        state.funeral_completed = True
        state.death_certificate_obtained = True
        state.banks_notified = ["SBI", "HDFC", "ICICI"]
        state.insurance_claims_filed = ["LIC-001", "MAX-001"]
        state.schemes_applied = ["widow_pension", "PMJDY"]
        state.days_elapsed = 10

        reward = compute_final_reward(state)

        assert 0.0 <= reward <= 1.0

    def test_zero_completion_reward(self):
        """Test reward with no tasks completed."""
        case = load_random_case("CASE_001")
        state = CaseState(case=case)

        reward = compute_final_reward(state)

        assert 0.0 <= reward <= 1.0


class TestPhaseReward:
    """Test compute_phase_reward function."""

    def test_funeral_completion_reward(self):
        """Test reward when funeral just completed."""
        case = load_random_case("CASE_001")
        prev_state = CaseState(case=case)
        prev_state.funeral_completed = False

        curr_state = CaseState(case=case)
        curr_state.funeral_completed = True

        reward = compute_phase_reward(prev_state, curr_state)

        assert reward == 0.20

    def test_death_cert_application_reward(self):
        """Test reward when death certificate application submitted."""
        case = load_random_case("CASE_001")
        prev_state = CaseState(case=case)
        prev_state.death_certificate_applied = False

        curr_state = CaseState(case=case)
        curr_state.death_certificate_applied = True

        reward = compute_phase_reward(prev_state, curr_state)

        assert reward == 0.15

    def test_death_cert_obtained_reward(self):
        """Test reward when death certificate obtained."""
        case = load_random_case("CASE_001")
        prev_state = CaseState(case=case)
        prev_state.death_certificate_obtained = False

        curr_state = CaseState(case=case)
        curr_state.death_certificate_obtained = True

        reward = compute_phase_reward(prev_state, curr_state)

        assert reward == 0.25

    def test_first_bank_notified_reward(self):
        """Test reward when first bank notified."""
        case = load_random_case("CASE_001")
        prev_state = CaseState(case=case)
        prev_state.banks_notified = []

        curr_state = CaseState(case=case)
        curr_state.banks_notified = ["SBI"]

        reward = compute_phase_reward(prev_state, curr_state)

        assert reward == 0.10

    def test_first_insurance_claim_reward(self):
        """Test reward when first insurance claim filed."""
        case = load_random_case("CASE_001")
        prev_state = CaseState(case=case)
        prev_state.insurance_claims_filed = []

        curr_state = CaseState(case=case)
        curr_state.insurance_claims_filed = ["LIC-001"]

        reward = compute_phase_reward(prev_state, curr_state)

        assert reward == 0.10

    def test_first_scheme_applied_reward(self):
        """Test reward when first scheme applied."""
        case = load_random_case("CASE_001")
        prev_state = CaseState(case=case)
        prev_state.schemes_applied = []

        curr_state = CaseState(case=case)
        curr_state.schemes_applied = ["widow_pension"]

        reward = compute_phase_reward(prev_state, curr_state)

        assert reward == 0.05

    def test_no_change_no_reward(self):
        """Test no reward when state doesn't change."""
        case = load_random_case("CASE_001")
        prev_state = CaseState(case=case)
        curr_state = CaseState(case=case)

        reward = compute_phase_reward(prev_state, curr_state)

        assert reward == 0.0

    def test_none_prev_state(self):
        """Test phase reward with None previous state."""
        case = load_random_case("CASE_001")
        curr_state = CaseState(case=case)

        reward = compute_phase_reward(None, curr_state)

        assert reward == 0.0


class TestStepReward:
    """Test compute_step_reward function."""

    def test_get_next_deadline_reward(self):
        """First call to info tool pays the unified one-shot reward (anti-gaming)."""
        case = load_random_case("CASE_001")
        prev_state = CaseState(case=case)
        curr_state = CaseState(case=case)
        # Simulate this being the first call to the tool.
        curr_state.actions_taken = ["get_next_critical_deadline"]

        reward = compute_step_reward(prev_state, curr_state, "get_next_critical_deadline")

        assert reward == 0.01

    def test_info_tool_spam_penalized(self):
        """Repeat calls to info tools must be penalized to prevent reward gaming."""
        case = load_random_case("CASE_001")
        prev_state = CaseState(case=case)
        curr_state = CaseState(case=case)
        # Simulate this being the third call to the same info tool.
        curr_state.actions_taken = ["get_case_context", "get_case_context", "get_case_context"]

        reward = compute_step_reward(prev_state, curr_state, "get_case_context")

        assert reward == -0.02

    def test_get_case_context_reward(self):
        """Test reward for getting case context."""
        case = load_random_case("CASE_001")
        prev_state = CaseState(case=case)
        curr_state = CaseState(case=case)

        reward = compute_step_reward(prev_state, curr_state, "get_case_context")

        assert reward == 0.01

    def test_notify_bank_without_cert_penalty(self):
        """Test penalty for notifying bank without death certificate."""
        case = load_random_case("CASE_001")
        prev_state = CaseState(case=case)
        curr_state = CaseState(case=case)
        curr_state.death_certificate_obtained = False

        reward = compute_step_reward(prev_state, curr_state, "notify_bank")

        assert reward == -0.05

    def test_notify_bank_with_cert_reward(self):
        """Test reward for notifying bank with death certificate."""
        case = load_random_case("CASE_001")
        prev_state = CaseState(case=case)
        curr_state = CaseState(case=case)
        curr_state.death_certificate_obtained = True

        reward = compute_step_reward(prev_state, curr_state, "notify_bank")

        assert reward == 0.01

    def test_file_claim_without_bank_penalty(self):
        """Test penalty for filing claim without bank notification."""
        case = load_random_case("CASE_001")
        prev_state = CaseState(case=case)
        curr_state = CaseState(case=case)
        curr_state.banks_notified = []

        reward = compute_step_reward(prev_state, curr_state, "file_insurance_claim")

        assert reward == -0.05

    def test_advance_time_excessive_penalty(self):
        """Test penalty for excessive advance_time calls."""
        case = load_random_case("CASE_001")
        prev_state = CaseState(case=case)
        curr_state = CaseState(case=case)
        curr_state.actions_taken = ["advance_time", "advance_time", "advance_time", "advance_time", "advance_time"]

        reward = compute_step_reward(prev_state, curr_state, "advance_time")

        assert reward == -0.03

    def test_unknown_tool_no_reward(self):
        """Test no reward for unknown tool."""
        case = load_random_case("CASE_001")
        prev_state = CaseState(case=case)
        curr_state = CaseState(case=case)

        reward = compute_step_reward(prev_state, curr_state, "unknown_tool")

        assert reward == 0.0

    def test_none_prev_state_first_action(self):
        """Test step reward with None previous state."""
        case = load_random_case("CASE_001")
        curr_state = CaseState(case=case)

        reward = compute_step_reward(None, curr_state, "get_case_context")

        assert reward == 0.01


class TestRewardExplanation:
    """Test get_reward_explanation function."""

    def test_explanation_format(self):
        """Test that explanation is properly formatted."""
        case = load_random_case("CASE_001")
        state = CaseState(case=case)

        explanation = get_reward_explanation(state)

        assert "REWARD BREAKDOWN" in explanation
        assert "TASK COMPLETION" in explanation
        assert "FINAL SCORE" in explanation

    def test_explanation_with_completed_tasks(self):
        """Test explanation with completed tasks."""
        case = load_random_case("CASE_001")
        state = CaseState(case=case)

        state.funeral_completed = True
        state.death_certificate_obtained = True
        state.banks_notified = ["SBI"]

        explanation = get_reward_explanation(state)

        assert "✓ Funeral completed" in explanation
        assert "✓ Death certificate obtained" in explanation
        assert "✓ Banks notified" in explanation

    def test_explanation_with_penalties(self):
        """Test explanation with penalties."""
        case = load_random_case("CASE_001")
        state = CaseState(case=case)

        state.days_elapsed = 25
        state.death_certificate_obtained = False

        explanation = get_reward_explanation(state)

        assert "Missed 21-day deadline" in explanation


class TestEpisodeReturn:
    """Test compute_episode_return function."""

    def test_episode_return_sum(self):
        """Test that episode return sums rewards."""
        rewards = [0.1, 0.2, 0.15, -0.05, 0.3]
        total = compute_episode_return(rewards)

        assert total == pytest.approx(0.7)

    def test_episode_return_empty(self):
        """Test episode return with empty list."""
        rewards = []
        total = compute_episode_return(rewards)

        assert total == 0.0

    def test_episode_return_single_reward(self):
        """Test episode return with single reward."""
        rewards = [0.5]
        total = compute_episode_return(rewards)

        assert total == pytest.approx(0.5)

    def test_episode_return_negative_rewards(self):
        """Test episode return with negative rewards."""
        rewards = [-0.1, -0.2, -0.05]
        total = compute_episode_return(rewards)

        assert total == pytest.approx(-0.35)
