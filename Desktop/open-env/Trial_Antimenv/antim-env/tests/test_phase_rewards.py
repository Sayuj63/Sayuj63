"""
Regression tests for the phase-reward signal.

This file pins the behaviour of compute_phase_reward against the actual env
step pipeline. The bug we hunt for is a reference-aliasing bug where
`prev_state` and `curr_state` end up pointing at the same object, which
silently zeros every phase-reward comparison (because every comparison sees
prev == curr).

The original AntimEnvironment had this bug — every "did funeral just complete?"
question returned False because both states had been mutated together. The fix
was a copy.deepcopy in step(); these tests fail loudly if anyone undoes that.
"""
from __future__ import annotations

from antim_env import AntimAction, AntimEnvironment


def _fresh_env(case_id: str = "CASE_001") -> AntimEnvironment:
    env = AntimEnvironment()
    env.reset(case_id=case_id)
    return env


def test_book_funeral_returns_phase_reward_at_least_020():
    """Funeral transition False -> True must surface a phase reward >= 0.20."""
    env = _fresh_env()
    obs = env.step(
        AntimAction(
            tool_name="book_funeral_service",
            parameters={"vendor_id": "v1", "slot_time": "10am"},
        )
    )
    # Step reward is 0.01 (first action), phase reward is 0.20 — total >= 0.21.
    assert obs.reward >= 0.20, f"phase reward not firing; got {obs.reward}"


def test_cert_application_returns_phase_reward_at_least_015():
    """Death-cert application False -> True must surface a phase reward >= 0.15."""
    env = _fresh_env()
    env.step(AntimAction(tool_name="book_funeral_service",
                         parameters={"vendor_id": "v1", "slot_time": "10am"}))
    obs = env.step(
        AntimAction(
            tool_name="submit_death_certificate_application",
            parameters={"municipality_id": "PMC"},
        )
    )
    assert obs.reward >= 0.15


def test_cert_obtained_returns_phase_reward_at_least_025():
    """Death-cert obtained transition must surface a phase reward >= 0.25."""
    env = _fresh_env()
    env.step(AntimAction(tool_name="book_funeral_service",
                         parameters={"vendor_id": "v1", "slot_time": "10am"}))
    env.step(AntimAction(tool_name="submit_death_certificate_application",
                         parameters={"municipality_id": "PMC"}))
    obs = env.step(AntimAction(tool_name="advance_time", parameters={"days": 4}))
    # advance_time triggers cert_obtained transition (delay was 3 days).
    assert obs.reward >= 0.25


def test_prev_state_is_a_distinct_object_from_state():
    """Pin the deepcopy invariant directly — prev_state must not alias state."""
    env = _fresh_env()
    env.step(
        AntimAction(
            tool_name="book_funeral_service",
            parameters={"vendor_id": "v1", "slot_time": "10am"},
        )
    )
    assert env.prev_state is not None
    assert env.prev_state is not env.state, (
        "prev_state was aliased to state — phase rewards will silently zero."
    )
    # And the snapshot reflects the BEFORE-action world: funeral was pending.
    assert env.prev_state.funeral_completed is False
    assert env.state.funeral_completed is True
