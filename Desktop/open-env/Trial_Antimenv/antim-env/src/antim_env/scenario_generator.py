"""
Procedural case generator with difficulty curriculum.

The 10 hardcoded SEED_CASES are great for reproducibility but limit training
diversity. This module generates synthetic FamilyCase instances scaled to a
caller-supplied capability score in [0.0, 1.0]:

    capability < 0.30 → "easy"      (1 bank,  0 policies, 0 schemes, low delay)
    capability < 0.55 → "moderate"  (2 banks, 1 policy,   1 scheme,  med delay)
    capability < 0.80 → "hard"      (3 banks, 2 policies, 2 schemes, no will, high delay)
    capability ≥ 0.80 → "extreme"   (4 banks, 3 policies, 2 schemes, NRI, max delay)

Designed for evaluator-as-agent / curriculum learning loops:

    state = env.reset(capability=running_avg_reward, seed=step_idx)

The generator is deterministic given (capability, seed) so eval splits are
reproducible across runs. This unlocks Theme #4 (Self-Improvement) on top of
the existing Theme #2 (Long-Horizon) and Theme #3.1 (World Modeling)
qualifiers.
"""
from __future__ import annotations

import random
from dataclasses import dataclass
from typing import Optional

from antim_env.models import FamilyCase


# ---------------------------------------------------------------------------
# Difficulty tiers
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class DifficultyTier:
    """Bounds defining a difficulty bucket."""

    name: str
    capability_max: float           # capability < this falls in this tier
    n_banks: int
    n_policies: int
    n_schemes: int
    municipality_delay_days: int
    no_will: bool
    nri: bool
    has_loan_prob: float


_TIERS: tuple[DifficultyTier, ...] = (
    DifficultyTier("easy",     0.30, 1, 0, 0, 2,  False, False, 0.0),
    DifficultyTier("moderate", 0.55, 2, 1, 1, 5,  False, False, 0.2),
    DifficultyTier("hard",     0.80, 3, 2, 2, 10, True,  False, 0.5),
    DifficultyTier("extreme",  1.01, 4, 3, 2, 15, True,  True,  0.7),
)

_BANK_NAMES = ("SBI", "HDFC", "ICICI", "Axis", "Kotak", "PNB", "BOB")
_POLICY_PREFIXES = ("LIC", "MAX", "HDFC_Life", "SBI_Life", "ICICI_Pru")
_SCHEMES_BY_KIND: dict[str, tuple[str, ...]] = {
    "private":    ("widow_pension", "PMJDY", "EDLI"),
    "government": ("CGEGIS", "GPF", "gratuity", "widow_pension"),
}
_CITIES = ("Pune", "Chennai", "Delhi", "Patna", "Mumbai", "Coimbatore",
           "Hyderabad", "Bangalore", "Ahmedabad", "Lucknow", "Kochi")
_FIRST_NAMES = ("Sushma", "Ramesh", "Priya", "Mohan", "Anita", "Suresh",
                "Lakshmi", "Vikram", "Kavya", "Arjun", "Meera", "Rajesh")
_LAST_NAMES = ("Patil", "Kumar", "Sharma", "Iyer", "Reddy", "Singh",
               "Mehta", "Desai", "Nair", "Jain")
_CAUSES: tuple[str, ...] = ("natural", "accident", "sudden_illness")


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def select_tier(capability: float) -> DifficultyTier:
    """Choose the tier whose capability_max bound exceeds the given score."""
    if not 0.0 <= capability <= 1.0:
        raise ValueError(f"capability must be in [0.0, 1.0], got {capability}")
    for tier in _TIERS:
        if capability < tier.capability_max:
            return tier
    return _TIERS[-1]


def generate_case(
    capability: float,
    seed: Optional[int] = None,
    *,
    case_id: Optional[str] = None,
) -> FamilyCase:
    """
    Generate a FamilyCase scaled to the given capability score.

    Deterministic in (capability, seed): same inputs produce the same case.

    Args:
        capability: Score in [0.0, 1.0] from the training loop's running
                    reward mean. Higher capability → harder generated cases.
        seed:       Random seed (None → time-based). For reproducible eval.
        case_id:    Optional override for the generated case_id. Defaults to
                    a stable hash-like "GEN_{seed}" string.

    Returns:
        A fresh FamilyCase appropriate for the curriculum tier.
    """
    tier = select_tier(capability)
    rng = random.Random(seed)

    name = f"{rng.choice(_FIRST_NAMES)} {rng.choice(_LAST_NAMES)}"
    city = rng.choice(_CITIES)
    cause = rng.choice(_CAUSES)
    age = rng.randint(35, 85)
    dependents = rng.randint(0, 4)

    banks = rng.sample(_BANK_NAMES, tier.n_banks)
    policies = [
        f"{rng.choice(_POLICY_PREFIXES)}-{rng.randint(100, 999)}"
        for _ in range(tier.n_policies)
    ]

    is_government = rng.random() < 0.25
    pool = _SCHEMES_BY_KIND["government" if is_government else "private"]
    n_avail = min(tier.n_schemes, len(pool))
    schemes = rng.sample(pool, n_avail)

    has_loan = rng.random() < tier.has_loan_prob
    is_primary = rng.random() < 0.7  # bias toward primary earner for impact

    return FamilyCase(
        case_id=case_id or f"GEN_{seed if seed is not None else rng.randint(0, 1<<31)}",
        deceased_name=name,
        deceased_age=age,
        city=city,
        cause_of_death=cause,
        has_will=not tier.no_will,
        banks=banks,
        insurance_policies=policies,
        is_primary_earner=is_primary,
        dependents=dependents,
        government_schemes_eligible=schemes,
        complexity=tier.name if tier.name != "easy" else "simple",
        municipality_delay_days=tier.municipality_delay_days,
        has_outstanding_loan=has_loan,
        is_nri_case=tier.nri,
    )


# ---------------------------------------------------------------------------
# Curriculum stepper — call from training loop
# ---------------------------------------------------------------------------


def capability_from_reward_mean(
    reward_mean: float, *, lo: float = 0.0, hi: float = 1.0
) -> float:
    """
    Map a recent-reward-mean signal onto the curriculum's [0.0, 1.0]
    capability axis. Linear scaling, clamped at the endpoints. lo/hi are
    the empirical reward bounds you expect during training.
    """
    if hi <= lo:
        return 0.5
    raw = (reward_mean - lo) / (hi - lo)
    return max(0.0, min(1.0, raw))
