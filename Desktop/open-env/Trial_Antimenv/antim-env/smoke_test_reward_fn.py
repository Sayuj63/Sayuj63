"""
Smoke test for the patched reward function.

Mirrors the logic in notebook cells 8 (wrapper), 12 (reward), and 10 (system
prompt format). Runs WITHOUT TRL / Unsloth / vLLM so we can verify the reward
loop produces a real signal before burning Colab compute.

Pass criteria:
  - valid funeral-only completion         -> reward > 0
  - valid near-optimal trajectory          -> reward > funeral-only reward
  - malformed JSON                         -> reward == -0.5
  - empty array                            -> reward == 0.0
  - wrong-sequence (bank before cert)      -> reward < funeral-only reward
"""
from __future__ import annotations

import json
import re
import sys

# Make src importable when run from antim-env/
sys.path.insert(0, "src")

from antim_env import AntimEnvironment, AntimAction


# ---------------------------------------------------------------------------
# Mirror of notebook cell-8: in-process wrapper
# ---------------------------------------------------------------------------
class AntimEnvWrapper:
    def __init__(self, case_id: str | None = None):
        self.env = AntimEnvironment()
        self.case_id = case_id
        self.last_reward = 0.0
        self.done = False
        self.reset()

    def reset(self) -> str:
        obs = self.env.reset(case_id=self.case_id)
        self.last_reward = 0.0
        self.done = False
        return obs.message

    def call_tool(self, tool_name: str, **params) -> tuple[str, float, bool]:
        action = AntimAction(tool_name=tool_name, parameters=params or {})
        obs = self.env.step(action)
        self.last_reward = float(obs.reward)
        self.done = bool(obs.done)
        return obs.message, self.last_reward, self.done


# ---------------------------------------------------------------------------
# Mirror of notebook cell-12: reward function
# ---------------------------------------------------------------------------
_JSON_ARRAY_RE = re.compile(r"\[\s*(?:\{.*?\}\s*,?\s*)*\]", re.DOTALL)
INVALID_FORMAT_PENALTY = -0.5
INVALID_CALL_PENALTY = -0.05
MAX_TRAJECTORY_LEN = 20


def parse_actions(completion: str):
    if not isinstance(completion, str):
        return None
    stripped = completion.strip()
    if stripped.startswith("[") and stripped.endswith("]"):
        try:
            parsed = json.loads(stripped)
            if isinstance(parsed, list):
                return parsed
        except Exception:
            pass
    m = _JSON_ARRAY_RE.search(completion)
    if not m:
        return None
    try:
        parsed = json.loads(m.group(0))
    except Exception:
        return None
    return parsed if isinstance(parsed, list) else None


def antim_reward_func(prompts, completions, **kwargs):
    case_ids = kwargs.get("case_id") or [None] * len(completions)
    rewards = []
    for completion, case_id in zip(completions, case_ids):
        actions = parse_actions(completion)
        if actions is None:
            rewards.append(INVALID_FORMAT_PENALTY)
            continue
        env = AntimEnvWrapper(case_id=case_id)
        env.reset()
        cumulative = 0.0
        for act in actions[:MAX_TRAJECTORY_LEN]:
            if not isinstance(act, dict):
                cumulative += INVALID_CALL_PENALTY
                continue
            tool = act.get("tool")
            params = act.get("parameters", {}) or {}
            if not isinstance(tool, str) or not isinstance(params, dict):
                cumulative += INVALID_CALL_PENALTY
                continue
            try:
                _msg, step_reward, done = env.call_tool(tool, **params)
            except Exception:
                cumulative += INVALID_CALL_PENALTY
                continue
            cumulative += step_reward
            if done:
                break
        rewards.append(float(cumulative))
    return rewards


# ---------------------------------------------------------------------------
# Test cases
# ---------------------------------------------------------------------------
FUNERAL_ONLY = json.dumps([
    {"tool": "book_funeral_service",
     "parameters": {"vendor_id": "v1", "slot_time": "10:00 AM"}},
])

NEAR_OPTIMAL = json.dumps([
    {"tool": "book_funeral_service",
     "parameters": {"vendor_id": "v1", "slot_time": "10:00 AM"}},
    {"tool": "submit_death_certificate_application",
     "parameters": {"municipality_id": "M1"}},
    {"tool": "advance_time", "parameters": {"days": 4}},
    {"tool": "notify_bank",
     "parameters": {"bank_id": "SBI", "account_type": "savings"}},
    {"tool": "notify_bank",
     "parameters": {"bank_id": "HDFC", "account_type": "savings"}},
    {"tool": "file_insurance_claim",
     "parameters": {"policy_id": "LIC-001", "claim_type": "death"}},
    {"tool": "check_government_scheme_eligibility",
     "parameters": {"scheme_name": "widow_pension"}},
])

WRONG_SEQUENCE = json.dumps([
    {"tool": "notify_bank",
     "parameters": {"bank_id": "SBI", "account_type": "savings"}},
    {"tool": "file_insurance_claim",
     "parameters": {"policy_id": "LIC-001", "claim_type": "death"}},
])

MALFORMED = "Sure! Here's my plan: book the funeral, then notify banks."
EMPTY_ARRAY = "[]"


def main() -> int:
    cases = ["CASE_001"] * 5
    completions = [FUNERAL_ONLY, NEAR_OPTIMAL, WRONG_SEQUENCE, MALFORMED, EMPTY_ARRAY]
    labels = ["funeral_only", "near_optimal", "wrong_sequence", "malformed", "empty_array"]
    rewards = antim_reward_func([""] * 5, completions, case_id=cases)

    print("=" * 70)
    print("Smoke test results — antim_reward_func on CASE_001")
    print("=" * 70)
    for label, reward in zip(labels, rewards):
        print(f"  {label:<18} reward = {reward:+.4f}")
    print("=" * 70)

    funeral_only_r, near_optimal_r, wrong_seq_r, malformed_r, empty_r = rewards

    failed = []
    if not (funeral_only_r > 0):
        failed.append(f"funeral_only should be > 0, got {funeral_only_r}")
    if not (near_optimal_r > funeral_only_r):
        failed.append(f"near_optimal ({near_optimal_r}) should beat funeral_only ({funeral_only_r})")
    if abs(malformed_r - INVALID_FORMAT_PENALTY) > 1e-9:
        failed.append(f"malformed should be {INVALID_FORMAT_PENALTY}, got {malformed_r}")
    if abs(empty_r) > 1e-9:
        failed.append(f"empty_array should be 0.0, got {empty_r}")
    if not (wrong_seq_r < funeral_only_r):
        failed.append(f"wrong_sequence ({wrong_seq_r}) should be < funeral_only ({funeral_only_r})")

    if failed:
        print("\nFAIL:")
        for f in failed:
            print(f"  - {f}")
        return 1
    print("\nPASS: all 5 invariants satisfied. Reward function produces a real signal.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
