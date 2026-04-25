"""
Composable Reward Rubric system for AntimEnv.

The judging criteria explicitly rewards "composable rubrics over monolithic
scoring." OpenEnv RFC 004 ("actions-as-tool-calls + trajectory rewards") and
ORS issue #468 propose a community-standardized reward primitive vocabulary.
This module is our take on it, implemented in a way that could be upstreamed
as a candidate ORS contribution.

Key ideas:
  - A RewardPrimitive is a small, named, weighted scalar judgement on the
    current CaseState. It always answers a single question.
  - A Rubric is an ordered composition of primitives plus a clamp range.
  - Rubric.explain() returns a per-primitive breakdown — judges can read
    *exactly* why a rollout scored what it scored.
  - Primitives are pure functions of CaseState. They never mutate state.
    They have no side effects.

Design follows OpenEnv RFC 004's terminology where possible:
  TaskCompletionBonus, DeadlineMissPenalty, AsymmetricFalseNegativePenalty,
  TimelinessBonus.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Callable, Optional

from antim_env.models import CaseState


# ---------------------------------------------------------------------------
# Core types
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class RewardPrimitive:
    """One named, weighted contribution to the rubric."""

    name: str
    fn: Callable[[CaseState], float]
    weight: float = 1.0
    description: str = ""

    def evaluate(self, state: CaseState) -> float:
        return float(self.weight) * float(self.fn(state))


@dataclass(frozen=True)
class Rubric:
    """Composition of primitives. Use evaluate() for a scalar, explain() for a breakdown."""

    primitives: tuple[RewardPrimitive, ...]
    clamp: Optional[tuple[float, float]] = (0.0, 1.0)
    name: str = "rubric"

    def evaluate(self, state: CaseState) -> float:
        total = sum(p.evaluate(state) for p in self.primitives)
        if self.clamp is not None:
            lo, hi = self.clamp
            total = max(lo, min(hi, total))
        return float(total)

    def explain(self, state: CaseState) -> dict[str, float]:
        """Per-primitive breakdown plus the final clamped total."""
        breakdown: dict[str, float] = {p.name: p.evaluate(state) for p in self.primitives}
        breakdown["__total_unclamped"] = float(sum(breakdown.values()))
        breakdown["__total_clamped"] = self.evaluate(state)
        return breakdown


# ---------------------------------------------------------------------------
# Primitive predicates — pure functions of CaseState.
# Each returns 0.0 or 1.0 (or a small graded value); the weight scales it.
# ---------------------------------------------------------------------------


def _funeral_completed(s: CaseState) -> float:
    return 1.0 if s.funeral_completed else 0.0


def _death_certificate_obtained(s: CaseState) -> float:
    return 1.0 if s.death_certificate_obtained else 0.0


def _at_least_one_bank_notified(s: CaseState) -> float:
    return 1.0 if len(s.banks_notified) >= 1 else 0.0


def _at_least_one_insurance_claim_filed(s: CaseState) -> float:
    return 1.0 if len(s.insurance_claims_filed) >= 1 else 0.0


def _at_least_one_scheme_applied(s: CaseState) -> float:
    return 1.0 if len(s.schemes_applied) >= 1 else 0.0


def _missed_21_day_deadline(s: CaseState) -> float:
    """1.0 if the agent failed to obtain the death cert within 21 days."""
    return 1.0 if (s.days_elapsed > 21 and not s.death_certificate_obtained) else 0.0


def _missed_3_day_funeral(s: CaseState) -> float:
    """1.0 if funeral didn't happen within 3 days (Indian tradition)."""
    return 1.0 if (s.days_elapsed > 3 and not s.funeral_completed) else 0.0


def _unnotified_bank_for_primary_earner(s: CaseState) -> float:
    """1.0 if deceased was primary earner AND any bank remains unnotified."""
    if not s.case.is_primary_earner or not s.case.banks:
        return 0.0
    unnotified = len(s.case.banks) - len(s.banks_notified)
    return 1.0 if unnotified > 0 else 0.0


def _certificate_obtained_before_deadline(s: CaseState) -> float:
    """1.0 if cert obtained on or before day 21 (real legal threshold)."""
    if s.death_certificate_day is None:
        return 0.0
    return 1.0 if s.death_certificate_day <= 21 else 0.0


def _nri_funeral_completed(s: CaseState) -> float:
    """1.0 if NRI case AND funeral completed (extra-hard scenario)."""
    return 1.0 if (s.case.is_nri_case and s.funeral_completed) else 0.0


# ---------------------------------------------------------------------------
# The default rubric — composes the primitives with judgement-style weights.
# Asymmetric: missing a critical deadline costs 1.6x the bonus for hitting it
# (-0.40 vs +0.30 for the certificate). RFC 004 calls this an
# "AsymmetricFalseNegativePenalty" — false negatives in clinical/legal/financial
# coordination tasks are usually 5-10x worse than false positives.
# ---------------------------------------------------------------------------


DEFAULT_PRIMITIVES: tuple[RewardPrimitive, ...] = (
    # Task-completion bonuses (sum to 1.00 on a perfect episode).
    RewardPrimitive("funeral_completed", _funeral_completed, 0.25,
                    "Funeral arranged within the episode."),
    RewardPrimitive("death_certificate_obtained", _death_certificate_obtained, 0.30,
                    "Death certificate physically in hand (the legal anchor)."),
    RewardPrimitive("at_least_one_bank_notified", _at_least_one_bank_notified, 0.20,
                    "First bank account formally notified."),
    RewardPrimitive("at_least_one_insurance_claim", _at_least_one_insurance_claim_filed, 0.15,
                    "First insurance claim filed."),
    RewardPrimitive("at_least_one_scheme_applied", _at_least_one_scheme_applied, 0.10,
                    "First eligible government scheme applied for."),

    # Deadline-miss penalties (asymmetric, encode the legal consequence).
    RewardPrimitive("missed_21_day_deadline", _missed_21_day_deadline, -0.40,
                    "Birth & Deaths Registration Act 1969 fine threshold."),
    RewardPrimitive("missed_3_day_funeral", _missed_3_day_funeral, -0.15,
                    "Indian funeral tradition window."),
    RewardPrimitive("unnotified_bank_for_primary_earner", _unnotified_bank_for_primary_earner, -0.10,
                    "Primary earner's accounts left unfrozen — fraud risk."),

    # Timeliness bonuses.
    RewardPrimitive("certificate_before_21_day_deadline", _certificate_obtained_before_deadline, 0.05,
                    "Death certificate beats the 21-day legal threshold."),
    RewardPrimitive("nri_funeral_completed", _nri_funeral_completed, 0.05,
                    "NRI case extra-credit: body repatriation completed."),
)


DEFAULT_RUBRIC = Rubric(
    primitives=DEFAULT_PRIMITIVES,
    clamp=(0.0, 1.0),
    name="antim_default_rubric_v1",
)


# ---------------------------------------------------------------------------
# Convenience helpers so existing callers can stay terse.
# ---------------------------------------------------------------------------


def evaluate(state: CaseState, rubric: Rubric = DEFAULT_RUBRIC) -> float:
    """Score a CaseState under the given rubric (default rubric if omitted)."""
    return rubric.evaluate(state)


def explain(state: CaseState, rubric: Rubric = DEFAULT_RUBRIC) -> dict[str, float]:
    """Return a human-readable per-primitive breakdown."""
    return rubric.explain(state)
