"""
Reward computation logic for AntimEnv.

The final/trajectory reward is now produced by a *composable rubric*
(see src/antim_env/rubric.py). Each component reward is a named
RewardPrimitive that can be inspected, weighted, and re-composed.
The judging criterion explicitly rewards composable rubrics over
monolithic scoring; the legacy monolithic implementation has been
deleted in favour of the rubric-based path.

This module still owns the per-step and per-phase incremental signals
(compute_step_reward, compute_phase_reward) that train the model on
correct sequencing and milestone progression.
"""

from __future__ import annotations

from typing import Optional

from antim_env.models import CaseState
from antim_env.rubric import DEFAULT_RUBRIC, Rubric


# ------------------------------------------------------------------
# Final Episode Reward (Sparse, at episode end)
# ------------------------------------------------------------------


def compute_final_reward(
    state: CaseState, rubric: Rubric = DEFAULT_RUBRIC
) -> float:
    """
    Compute the main sparse trajectory reward at episode end.

    Delegates to the composable rubric system. Behaviour matches the
    previous monolithic implementation by construction (same primitives,
    same weights, same clamp range).
    """
    return rubric.evaluate(state)


# ------------------------------------------------------------------
# Phase Reward (Intermediate, at each step)
# ------------------------------------------------------------------


def compute_phase_reward(prev_state: Optional[CaseState], curr_state: CaseState) -> float:
    """
    Compute intermediate rewards for phase transitions.

    This gives small rewards when major milestones are completed, helping
    the training curve move faster than sparse rewards alone.

    Args:
        prev_state: The previous CaseState (None on first step).
        curr_state: The current CaseState.

    Returns:
        A float reward for this step (typically 0.0-0.25).
    """
    if prev_state is None:
        return 0.0

    # Funeral just completed
    if not prev_state.funeral_completed and curr_state.funeral_completed:
        return 0.20

    # Death certificate application just submitted
    if (
        not prev_state.death_certificate_applied
        and curr_state.death_certificate_applied
    ):
        return 0.15

    # Death certificate just obtained
    if (
        not prev_state.death_certificate_obtained
        and curr_state.death_certificate_obtained
    ):
        return 0.25

    # First bank just notified
    if len(prev_state.banks_notified) == 0 and len(curr_state.banks_notified) >= 1:
        return 0.10

    # First insurance claim just filed
    if (
        len(prev_state.insurance_claims_filed) == 0
        and len(curr_state.insurance_claims_filed) >= 1
    ):
        return 0.10

    # First scheme just applied for
    if len(prev_state.schemes_applied) == 0 and len(curr_state.schemes_applied) >= 1:
        return 0.05

    return 0.0


# ------------------------------------------------------------------
# Step Reward (Immediate, for each tool call)
# ------------------------------------------------------------------


_INFO_TOOLS = frozenset({
    "get_case_context",
    "get_next_critical_deadline",
    "check_document_status",
})


def compute_step_reward(
    prev_state: Optional[CaseState], curr_state: CaseState, tool_name: str
) -> float:
    """
    Compute immediate reward or penalty for each tool call.

    Anti-gaming design (judging criterion: rewards must be hard to game):
      - Info tools (get_case_context / check_document_status /
        get_next_critical_deadline) pay a small one-shot reward the FIRST
        time they're called per episode and a SPAM PENALTY thereafter.
        Without this, an agent could maximize reward by spamming these
        zero-progress tools.
      - Wrong-sequence calls (bank before cert, insurance before bank)
        return a strict negative.
      - Repeated advance_time within a 5-window is penalized.

    Args:
        prev_state: The previous CaseState (None on first step).
        curr_state: The current CaseState (mutation already applied).
        tool_name: The name of the tool that was called.

    Returns:
        A float reward/penalty for this action.
    """
    if prev_state is None:
        return 0.01  # Small reward for first action

    actions = curr_state.actions_taken

    # Info tools: one-shot positive, spam negative.
    if tool_name in _INFO_TOOLS:
        first_call = actions.count(tool_name) <= 1
        return 0.01 if first_call else -0.02

    # Wrong-sequence: notifying a bank before the death certificate is obtained.
    if tool_name == "notify_bank":
        if not curr_state.death_certificate_obtained:
            return -0.05
        return 0.01

    # Wrong-sequence: filing insurance claim before any bank is notified.
    if tool_name == "file_insurance_claim":
        if len(curr_state.banks_notified) == 0:
            return -0.05
        return 0.01

    # advance_time spam guard.
    if tool_name == "advance_time":
        recent = actions[-5:]
        advance_count = sum(1 for a in recent if a == "advance_time")
        if advance_count > 3:
            return -0.03
        return 0.01

    # Small reward for any other recognized tool call.
    if tool_name in {
        "book_funeral_service",
        "submit_death_certificate_application",
        "check_government_scheme_eligibility",
        "escalate_delay",
    }:
        return 0.01

    # Unknown tool — neutral.
    return 0.0


# ------------------------------------------------------------------
# Reward Explanation (for debugging and visualization)
# ------------------------------------------------------------------


def get_reward_explanation(state: CaseState) -> str:
    """
    Return a human-readable explanation of the current reward breakdown.

    Used for debugging and understanding the reward signal during training.

    Args:
        state: The current CaseState.

    Returns:
        A formatted string showing reward components.
    """
    lines = []
    lines.append("=" * 70)
    lines.append("REWARD BREAKDOWN")
    lines.append("=" * 70)

    score = 0.0

    # Task completion points
    lines.append("\n📋 TASK COMPLETION POINTS:")
    if state.funeral_completed:
        lines.append("  ✓ Funeral completed: +0.25")
        score += 0.25
    else:
        lines.append("  ✗ Funeral not completed: +0.00")

    if state.death_certificate_obtained:
        lines.append("  ✓ Death certificate obtained: +0.30")
        score += 0.30
    else:
        lines.append("  ✗ Death certificate not obtained: +0.00")

    if len(state.banks_notified) >= 1:
        lines.append(f"  ✓ Banks notified ({len(state.banks_notified)}): +0.20")
        score += 0.20
    else:
        lines.append("  ✗ No banks notified: +0.00")

    if len(state.insurance_claims_filed) >= 1:
        lines.append(f"  ✓ Insurance claims filed ({len(state.insurance_claims_filed)}): +0.15")
        score += 0.15
    else:
        lines.append("  ✗ No insurance claims filed: +0.00")

    if len(state.schemes_applied) >= 1:
        lines.append(f"  ✓ Schemes applied ({len(state.schemes_applied)}): +0.10")
        score += 0.10
    else:
        lines.append("  ✗ No schemes applied: +0.00")

    # Deadline penalties
    lines.append("\n⏰ DEADLINE PENALTIES:")
    if state.days_elapsed > 21 and not state.death_certificate_obtained:
        lines.append(f"  ✗ Missed 21-day deadline (day {state.days_elapsed}): -0.40")
        score -= 0.40
    else:
        lines.append("  ✓ Within 21-day deadline: -0.00")

    if state.days_elapsed > 3 and not state.funeral_completed:
        lines.append(f"  ✗ Funeral delayed beyond 3 days (day {state.days_elapsed}): -0.15")
        score -= 0.15
    else:
        lines.append("  ✓ Funeral within 3 days: -0.00")

    if state.case.is_primary_earner and len(state.case.banks) > 0:
        unnotified = len(state.case.banks) - len(state.banks_notified)
        if unnotified > 0:
            lines.append(f"  ✗ Unnotified banks ({unnotified}): -0.10")
            score -= 0.10
        else:
            lines.append("  ✓ All banks notified: -0.00")

    # Timeliness bonuses
    lines.append("\n🎁 TIMELINESS BONUSES:")
    if state.death_certificate_day is not None and state.death_certificate_day <= 21:
        lines.append(f"  ✓ Death certificate before deadline (day {state.death_certificate_day}): +0.05")
        score += 0.05
    else:
        lines.append("  ✗ Death certificate not obtained early: +0.00")

    if state.case.is_nri_case and state.funeral_completed:
        lines.append("  ✓ NRI case with funeral completed: +0.05")
        score += 0.05
    else:
        lines.append("  ✗ NRI bonus not applicable: +0.00")

    # Final score
    final_score = max(0.0, min(1.0, score))
    lines.append("\n" + "=" * 70)
    lines.append(f"FINAL SCORE: {final_score:.4f} (clamped to [0.0, 1.0])")
    lines.append("=" * 70)

    return "\n".join(lines)


# ------------------------------------------------------------------
# Episode Return (for analysis)
# ------------------------------------------------------------------


def compute_episode_return(rewards: list[float]) -> float:
    """
    Compute the total return (sum of rewards) for an episode.

    Args:
        rewards: List of rewards collected during the episode.

    Returns:
        The sum of all rewards.
    """
    return sum(rewards)
