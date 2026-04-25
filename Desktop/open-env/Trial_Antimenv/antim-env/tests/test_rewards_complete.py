"""
Tests for complete reward computation logic.
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


@pytest.fixture
def base_state():
    """Fixture providing a base CaseState."""
    case = load_random_case("CASE_001")
    return CaseState(case=case)


def test_compute_final_reward_zero_completion(base_state):
    """Test final reward with no tasks completed."""
    reward = compute_final_reward(base_state)
    assert 0.0 <= reward <= 1.0


def test_compute_final_reward_all_tasks_completed(base_state):
    """Test final reward with all tasks completed."""
    base_state.funeral_completed = True
    base_state.death_certificate_obtained = True
    base_state.death_certificate_day = 10
    base_state.banks_notified = ["SBI", "HDFC"]
    base_state.insurance_claims_filed = ["LIC-001"]
    base_state.schemes_applied = ["widow_pension"]
    base_state.days_elapsed = 15
    
    reward = compute_final_reward(base_state)
    assert reward > 0.5  # Should be high for completing all tasks


def test_compute_final_reward_missed_21_day_deadline(base_state):
    """Test penalty for missing 21-day death certificate deadline."""
    base_state.days_elapsed = 25
    base_state.death_certificate_obtained = False
    
    reward = compute_final_reward(base_state)
    assert reward == 0.0  # Clamped to 0.0 due to penalty


def test_compute_final_reward_funeral_delay_penalty(base_state):
    """Test penalty for delayed funeral."""
    base_state.days_elapsed = 5
    base_state.funeral_completed = False
    
    reward = compute_final_reward(base_state)
    assert reward == 0.0  # Clamped to 0.0 due to penalty


def test_compute_final_reward_early_certificate_bonus(base_state):
    """Test bonus for getting certificate before deadline."""
    base_state.death_certificate_obtained = True
    base_state.death_certificate_day = 10
    base_state.days_elapsed = 10
    
    reward = compute_final_reward(base_state)
    assert reward > 0.05  # Should include bonus


def test_compute_final_reward_nri_bonus(base_state):
    """Test bonus for NRI case with funeral."""
    base_state.case.is_nri_case = True
    base_state.funeral_completed = True
    
    reward = compute_final_reward(base_state)
    assert reward > 0.05  # Should include NRI bonus


def test_compute_final_reward_clamped(base_state):
    """Test that final reward is clamped to [0.0, 1.0]."""
    base_state.funeral_completed = True
    base_state.death_certificate_obtained = True
    base_state.banks_notified = ["SBI", "HDFC", "ICICI"]
    base_state.insurance_claims_filed = ["LIC-001", "MAX-001"]
    base_state.schemes_applied = ["widow_pension", "PMJDY"]
    
    reward = compute_final_reward(base_state)
    assert 0.0 <= reward <= 1.0


def test_compute_phase_reward_none_prev_state(base_state):
    """Test phase reward with None previous state."""
    reward = compute_phase_reward(None, base_state)
    assert reward == 0.0


def test_compute_phase_reward_funeral_completed(base_state):
    """Test phase reward when funeral just completed."""
    prev_state = CaseState(case=base_state.case)
    prev_state.funeral_completed = False
    
    base_state.funeral_completed = True
    
    reward = compute_phase_reward(prev_state, base_state)
    assert reward == 0.20


def test_compute_phase_reward_death_cert_applied(base_state):
    """Test phase reward when death certificate application submitted."""
    prev_state = CaseState(case=base_state.case)
    prev_state.death_certificate_applied = False
    
    base_state.death_certificate_applied = True
    
    reward = compute_phase_reward(prev_state, base_state)
    assert reward == 0.15


def test_compute_phase_reward_death_cert_obtained(base_state):
    """Test phase reward when death certificate obtained."""
    prev_state = CaseState(case=base_state.case)
    prev_state.death_certificate_obtained = False
    
    base_state.death_certificate_obtained = True
    
    reward = compute_phase_reward(prev_state, base_state)
    assert reward == 0.25


def test_compute_phase_reward_first_bank_notified(base_state):
    """Test phase reward when first bank notified."""
    prev_state = CaseState(case=base_state.case)
    prev_state.banks_notified = []
    
    base_state.banks_notified = ["SBI"]
    
    reward = compute_phase_reward(prev_state, base_state)
    assert reward == 0.10


def test_compute_phase_reward_first_insurance_claim(base_state):
    """Test phase reward when first insurance claim filed."""
    prev_state = CaseState(case=base_state.case)
    prev_state.insurance_claims_filed = []
    
    base_state.insurance_claims_filed = ["LIC-001"]
    
    reward = compute_phase_reward(prev_state, base_state)
    assert reward == 0.10


def test_compute_phase_reward_first_scheme_applied(base_state):
    """Test phase reward when first scheme applied."""
    prev_state = CaseState(case=base_state.case)
    prev_state.schemes_applied = []
    
    base_state.schemes_applied = ["widow_pension"]
    
    reward = compute_phase_reward(prev_state, base_state)
    assert reward == 0.05


def test_compute_phase_reward_no_change(base_state):
    """Test phase reward with no state change."""
    prev_state = CaseState(case=base_state.case)
    
    reward = compute_phase_reward(prev_state, base_state)
    assert reward == 0.0


def test_compute_step_reward_none_prev_state(base_state):
    """Test step reward with None previous state."""
    reward = compute_step_reward(None, base_state, "get_case_context")
    assert reward == 0.01


def test_compute_step_reward_get_next_deadline(base_state):
    """First call to info tool pays the unified one-shot reward (anti-gaming)."""
    prev_state = CaseState(case=base_state.case)
    base_state.actions_taken = ["get_next_critical_deadline"]
    reward = compute_step_reward(prev_state, base_state, "get_next_critical_deadline")
    assert reward == 0.01


def test_compute_step_reward_get_case_context(base_state):
    """Test step reward for getting case context."""
    prev_state = CaseState(case=base_state.case)
    reward = compute_step_reward(prev_state, base_state, "get_case_context")
    assert reward == 0.01


def test_compute_step_reward_notify_bank_without_cert(base_state):
    """Test penalty for notifying bank without death certificate."""
    prev_state = CaseState(case=base_state.case)
    base_state.death_certificate_obtained = False
    
    reward = compute_step_reward(prev_state, base_state, "notify_bank")
    assert reward == -0.05


def test_compute_step_reward_notify_bank_with_cert(base_state):
    """Test reward for notifying bank with death certificate."""
    prev_state = CaseState(case=base_state.case)
    base_state.death_certificate_obtained = True
    
    reward = compute_step_reward(prev_state, base_state, "notify_bank")
    assert reward == 0.01


def test_compute_step_reward_file_claim_without_bank(base_state):
    """Test penalty for filing claim without bank notification."""
    prev_state = CaseState(case=base_state.case)
    base_state.banks_notified = []
    
    reward = compute_step_reward(prev_state, base_state, "file_insurance_claim")
    assert reward == -0.05


def test_compute_step_reward_advance_time_excessive(base_state):
    """Test penalty for excessive advance_time calls."""
    prev_state = CaseState(case=base_state.case)
    # Simulate 5 advance_time calls in a row (more than 3)
    base_state.actions_taken = ["advance_time", "advance_time", "advance_time", "advance_time", "advance_time"]
    
    reward = compute_step_reward(prev_state, base_state, "advance_time")
    assert reward == -0.03


def test_compute_step_reward_unknown_tool(base_state):
    """Test step reward for unknown tool."""
    prev_state = CaseState(case=base_state.case)
    reward = compute_step_reward(prev_state, base_state, "unknown_tool")
    assert reward == 0.0


def test_get_reward_explanation_format(base_state):
    """Test that reward explanation is properly formatted."""
    explanation = get_reward_explanation(base_state)
    assert "REWARD BREAKDOWN" in explanation
    assert "TASK COMPLETION" in explanation
    assert "FINAL SCORE" in explanation


def test_get_reward_explanation_with_completed_tasks(base_state):
    """Test reward explanation with completed tasks."""
    base_state.funeral_completed = True
    base_state.death_certificate_obtained = True
    base_state.banks_notified = ["SBI"]
    
    explanation = get_reward_explanation(base_state)
    assert "✓ Funeral completed" in explanation
    assert "✓ Death certificate obtained" in explanation
    assert "✓ Banks notified" in explanation


def test_get_reward_explanation_with_penalties(base_state):
    """Test reward explanation with penalties."""
    base_state.days_elapsed = 25
    base_state.death_certificate_obtained = False
    
    explanation = get_reward_explanation(base_state)
    assert "Missed 21-day deadline" in explanation


def test_compute_episode_return(base_state):
    """Test computing episode return."""
    rewards = [0.1, 0.2, 0.15, -0.05, 0.3]
    total = compute_episode_return(rewards)
    assert total == pytest.approx(0.7)


def test_compute_episode_return_empty(base_state):
    """Test computing episode return with empty list."""
    rewards = []
    total = compute_episode_return(rewards)
    assert total == 0.0


def test_reward_consistency(base_state):
    """Test that rewards are consistent across calls."""
    reward1 = compute_final_reward(base_state)
    reward2 = compute_final_reward(base_state)
    assert reward1 == reward2


def test_reward_range(base_state):
    """Test that all rewards are in valid ranges."""
    # Final reward
    final = compute_final_reward(base_state)
    assert 0.0 <= final <= 1.0
    
    # Phase reward
    phase = compute_phase_reward(None, base_state)
    assert 0.0 <= phase <= 0.25
    
    # Step reward
    step = compute_step_reward(None, base_state, "get_case_context")
    assert -0.05 <= step <= 0.02
