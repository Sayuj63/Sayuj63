"""
Tests for the procedural case generator + curriculum (Self-Improvement theme).
"""
from __future__ import annotations

import pytest

from antim_env import AntimEnvironment
from antim_env.models import FamilyCase
from antim_env.scenario_generator import (
    capability_from_reward_mean,
    generate_case,
    select_tier,
)


# ---------------------------------------------------------------------------
# Tier selection
# ---------------------------------------------------------------------------


@pytest.mark.parametrize("cap,expected", [
    (0.0, "easy"),
    (0.29, "easy"),
    (0.30, "moderate"),
    (0.54, "moderate"),
    (0.55, "hard"),
    (0.79, "hard"),
    (0.80, "extreme"),
    (1.0, "extreme"),
])
def test_select_tier_picks_expected_bucket(cap, expected):
    assert select_tier(cap).name == expected


@pytest.mark.parametrize("cap", [-0.01, 1.01, 2.0, -1.0])
def test_select_tier_rejects_out_of_range(cap):
    with pytest.raises(ValueError):
        select_tier(cap)


# ---------------------------------------------------------------------------
# Determinism + tier-correct generation
# ---------------------------------------------------------------------------


def test_generation_is_deterministic_in_seed():
    a = generate_case(0.5, seed=42)
    b = generate_case(0.5, seed=42)
    assert a == b


def test_easy_tier_has_one_bank_and_no_policies():
    case = generate_case(0.1, seed=1)
    assert len(case.banks) == 1
    assert len(case.insurance_policies) == 0
    assert case.is_nri_case is False
    assert case.has_will is True
    assert case.complexity == "simple"


def test_extreme_tier_has_four_banks_three_policies_nri_no_will():
    case = generate_case(0.95, seed=2)
    assert len(case.banks) == 4
    assert len(case.insurance_policies) == 3
    assert case.is_nri_case is True
    assert case.has_will is False
    assert case.municipality_delay_days == 15


def test_generated_case_has_unique_id_per_seed():
    cases = [generate_case(0.5, seed=s) for s in range(5)]
    ids = {c.case_id for c in cases}
    assert len(ids) == 5  # all distinct


def test_generated_case_returns_familycase_instance():
    case = generate_case(0.4, seed=7)
    assert isinstance(case, FamilyCase)


# ---------------------------------------------------------------------------
# Env wiring: reset(capability=...) path
# ---------------------------------------------------------------------------


def test_env_reset_with_capability_uses_generator():
    env = AntimEnvironment()
    env.reset(capability=0.9, seed=11)
    assert env.case.is_nri_case is True   # extreme tier
    assert len(env.case.banks) == 4


def test_env_reset_capability_and_case_id_are_mutex():
    env = AntimEnvironment()
    with pytest.raises(ValueError):
        env.reset(case_id="CASE_001", capability=0.5)


def test_env_reset_capability_seed_reproducible():
    env1 = AntimEnvironment(); env1.reset(capability=0.4, seed=99)
    env2 = AntimEnvironment(); env2.reset(capability=0.4, seed=99)
    assert env1.case == env2.case


# ---------------------------------------------------------------------------
# capability_from_reward_mean: training-loop helper
# ---------------------------------------------------------------------------


def test_capability_clamps_below_zero():
    assert capability_from_reward_mean(-1.5) == 0.0


def test_capability_clamps_above_one():
    assert capability_from_reward_mean(2.0) == 1.0


def test_capability_linear_in_default_range():
    assert capability_from_reward_mean(0.5) == 0.5


def test_capability_handles_degenerate_bounds():
    # If lo == hi, fall back to mid-tier (avoids divide-by-zero).
    assert capability_from_reward_mean(0.5, lo=0.0, hi=0.0) == 0.5
