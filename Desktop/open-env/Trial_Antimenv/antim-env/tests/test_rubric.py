"""
Tests for the composable Reward Rubric system (src/antim_env/rubric.py).

The rubric is the canonical scoring path — compute_final_reward delegates to
it. Behaviour must match what was previously the monolithic implementation,
so any drift is a regression.
"""
from __future__ import annotations

import pytest

from antim_env import AntimAction, AntimEnvironment
from antim_env.cases import load_random_case
from antim_env.models import CaseState
from antim_env.rewards import compute_final_reward
from antim_env.rubric import (
    DEFAULT_PRIMITIVES,
    DEFAULT_RUBRIC,
    RewardPrimitive,
    Rubric,
    evaluate,
    explain,
)


# ---------------------------------------------------------------------------
# Default rubric structural tests
# ---------------------------------------------------------------------------


def test_default_rubric_is_composed_of_primitives():
    assert isinstance(DEFAULT_RUBRIC, Rubric)
    assert len(DEFAULT_RUBRIC.primitives) == len(DEFAULT_PRIMITIVES)


def test_default_rubric_clamp_is_zero_one():
    assert DEFAULT_RUBRIC.clamp == (0.0, 1.0)


def test_every_primitive_has_a_description():
    for p in DEFAULT_PRIMITIVES:
        assert p.description, f"{p.name} missing description"


def test_primitive_weights_have_expected_signs():
    expected_signs = {
        "funeral_completed": 1,
        "death_certificate_obtained": 1,
        "at_least_one_bank_notified": 1,
        "at_least_one_insurance_claim": 1,
        "at_least_one_scheme_applied": 1,
        "missed_21_day_deadline": -1,
        "missed_3_day_funeral": -1,
        "unnotified_bank_for_primary_earner": -1,
        "certificate_before_21_day_deadline": 1,
        "nri_funeral_completed": 1,
    }
    by_name = {p.name: p for p in DEFAULT_PRIMITIVES}
    for name, sign in expected_signs.items():
        assert name in by_name, f"missing primitive {name}"
        prim = by_name[name]
        if sign > 0:
            assert prim.weight > 0
        else:
            assert prim.weight < 0


# ---------------------------------------------------------------------------
# Numerical equivalence with old monolithic compute_final_reward
# ---------------------------------------------------------------------------


def _state_after_optimal_4_steps(case_id: str = "CASE_001") -> CaseState:
    env = AntimEnvironment()
    env.reset(case_id=case_id)
    for tn, p in [
        ("book_funeral_service", {"vendor_id": "v1", "slot_time": "10am"}),
        ("submit_death_certificate_application", {"municipality_id": "PMC"}),
        ("advance_time", {"days": 4}),
        ("notify_bank", {"bank_id": "SBI", "account_type": "savings"}),
    ]:
        env.step(AntimAction(tool_name=tn, parameters=p))
    return env.state


def test_optimal_trajectory_scores_above_half():
    state = _state_after_optimal_4_steps("CASE_001")
    score = DEFAULT_RUBRIC.evaluate(state)
    assert 0.5 < score <= 1.0
    # Should match the legacy compute_final_reward exactly.
    assert score == compute_final_reward(state)


def test_explain_returns_per_primitive_breakdown():
    state = _state_after_optimal_4_steps("CASE_001")
    breakdown = explain(state)
    assert "__total_clamped" in breakdown
    assert "__total_unclamped" in breakdown
    assert "funeral_completed" in breakdown
    assert breakdown["funeral_completed"] == 0.25
    assert breakdown["death_certificate_obtained"] == 0.30


def test_empty_state_scores_zero():
    case = load_random_case("CASE_001")
    state = CaseState(case=case)
    assert DEFAULT_RUBRIC.evaluate(state) == 0.0


def test_missed_21_day_deadline_penalty_applies():
    case = load_random_case("CASE_001")
    state = CaseState(case=case)
    state.funeral_completed = True
    state.days_elapsed = 22
    score = DEFAULT_RUBRIC.evaluate(state)
    # 0.25 (funeral) - 0.40 (deadline) clamped to 0
    assert score == 0.0


def test_clamp_upper_bound_holds():
    # Construct a state that would naively score > 1.0
    case = load_random_case("CASE_007")  # NRI case
    state = CaseState(case=case)
    state.funeral_completed = True
    state.death_certificate_obtained = True
    state.death_certificate_day = 5
    state.banks_notified = list(case.banks)
    state.insurance_claims_filed = list(case.insurance_policies)
    state.schemes_applied = list(case.government_schemes_eligible)
    state.days_elapsed = 6
    score = DEFAULT_RUBRIC.evaluate(state)
    assert 0.0 <= score <= 1.0


# ---------------------------------------------------------------------------
# Custom rubric — composability test
# ---------------------------------------------------------------------------


def test_can_build_a_custom_rubric_from_subset_of_primitives():
    just_completion = Rubric(
        primitives=tuple(p for p in DEFAULT_PRIMITIVES if p.weight > 0),
        clamp=None,
    )
    state = _state_after_optimal_4_steps("CASE_001")
    s = just_completion.evaluate(state)
    assert s > 0


def test_primitive_evaluate_is_pure():
    """Calling .evaluate() must not mutate the state."""
    state = _state_after_optimal_4_steps("CASE_001")
    snap = (state.funeral_completed, state.days_elapsed,
            tuple(state.banks_notified))
    DEFAULT_RUBRIC.evaluate(state)
    DEFAULT_RUBRIC.explain(state)
    after = (state.funeral_completed, state.days_elapsed,
             tuple(state.banks_notified))
    assert snap == after
