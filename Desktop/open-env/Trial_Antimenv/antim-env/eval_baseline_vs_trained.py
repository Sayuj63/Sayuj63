"""
Baseline vs trained-model evaluation harness.

The judging criterion explicitly requires comparing a trained agent against
a random/untrained baseline; this script provides four programmatic baselines
plus a hook for evaluating a trained checkpoint:

  1. Random            — picks tool + arbitrary params uniformly
  2. Greedy-by-deadline — always calls get_next_critical_deadline first,
                          then takes the action it implies
  3. Optimal-static    — hand-coded near-optimal trajectory (upper bound)
  4. Trained model     — loads a HuggingFace checkpoint and rolls it out
                          (only if --trained-model-path is supplied)

Usage:
    PYTHONPATH=src python3 eval_baseline_vs_trained.py
    PYTHONPATH=src python3 eval_baseline_vs_trained.py --eval-cases CASE_009 CASE_010
    PYTHONPATH=src python3 eval_baseline_vs_trained.py --trained-model-path ./antim-llama32-1b-lora

Output: a Markdown comparison table that you can paste straight into the
README so judges can read it as quantitative evidence of training progress.
"""
from __future__ import annotations

import argparse
import json
import random
import sys
from dataclasses import dataclass
from typing import Callable, Optional

from antim_env import (
    AntimAction,
    AntimEnvironment,
    DEFAULT_RUBRIC,
    list_tool_names,
)
from antim_env.tools import TOOL_REGISTRY


# ---------------------------------------------------------------------------
# Action samplers — each returns a stream of AntimAction for an episode
# ---------------------------------------------------------------------------


def _sample_random_params(tool_name: str, rng: random.Random) -> dict:
    """Generate roughly-valid params for a tool. Bad params trigger the
    schema-violation path, which is part of what we're measuring."""
    if tool_name == "advance_time":
        return {"days": rng.randint(1, 7)}
    if tool_name == "book_funeral_service":
        return {"vendor_id": "v1", "slot_time": "10:00 AM"}
    if tool_name == "submit_death_certificate_application":
        return {"municipality_id": "M1"}
    if tool_name == "notify_bank":
        return {"bank_id": "SBI", "account_type": "savings"}
    if tool_name == "file_insurance_claim":
        return {"policy_id": "LIC-001", "claim_type": "death"}
    if tool_name == "check_government_scheme_eligibility":
        return {"scheme_name": "widow_pension"}
    if tool_name == "escalate_delay":
        return {"office_id": "PMC", "reason": "delayed"}
    if tool_name == "check_document_status":
        return {"document_type": "death_certificate"}
    return {}


def random_policy(env: AntimEnvironment, rng: random.Random, max_steps: int = 25):
    tool_names = list_tool_names()
    for _ in range(max_steps):
        tn = rng.choice(tool_names)
        yield AntimAction(tool_name=tn, parameters=_sample_random_params(tn, rng))


def greedy_by_deadline_policy(env: AntimEnvironment, rng: random.Random, max_steps: int = 25):
    """Inspects state and picks the next-deadline-implied tool. Ignores model."""
    seen_deadline = False
    for _ in range(max_steps):
        if not seen_deadline:
            yield AntimAction(tool_name="get_next_critical_deadline", parameters={})
            seen_deadline = True
            continue

        s = env.state
        if s is None:
            yield AntimAction(tool_name="get_case_context", parameters={})
            continue

        # Decide the next action based on current state.
        if not s.funeral_completed:
            yield AntimAction(
                tool_name="book_funeral_service",
                parameters={"vendor_id": "v1", "slot_time": "10am"},
            )
        elif not s.death_certificate_applied:
            yield AntimAction(
                tool_name="submit_death_certificate_application",
                parameters={"municipality_id": "M1"},
            )
        elif not s.death_certificate_obtained:
            yield AntimAction(tool_name="advance_time", parameters={"days": 4})
        else:
            unnotified = [b for b in s.case.banks if b not in s.banks_notified]
            if unnotified:
                yield AntimAction(
                    tool_name="notify_bank",
                    parameters={"bank_id": unnotified[0], "account_type": "savings"},
                )
                continue
            unfiled = [
                p for p in s.case.insurance_policies if p not in s.insurance_claims_filed
            ]
            if unfiled:
                yield AntimAction(
                    tool_name="file_insurance_claim",
                    parameters={"policy_id": unfiled[0], "claim_type": "death"},
                )
                continue
            unapplied = [
                sc for sc in s.case.government_schemes_eligible
                if sc not in s.schemes_applied
            ]
            if unapplied:
                yield AntimAction(
                    tool_name="check_government_scheme_eligibility",
                    parameters={"scheme_name": unapplied[0]},
                )
                continue
            return  # nothing left to do


def optimal_static_policy(env: AntimEnvironment, rng: random.Random, max_steps: int = 25):
    """Hand-coded near-optimal plan; serves as an upper-bound reference."""
    s = env.state
    case = s.case if s else env.case
    plan = [
        AntimAction(tool_name="book_funeral_service",
                    parameters={"vendor_id": "v1", "slot_time": "10am"}),
        AntimAction(tool_name="submit_death_certificate_application",
                    parameters={"municipality_id": "M1"}),
        AntimAction(tool_name="advance_time",
                    parameters={"days": min(7, max(1, case.municipality_delay_days + 1))}),
    ]
    for bank in case.banks:
        plan.append(AntimAction(tool_name="notify_bank",
                                parameters={"bank_id": bank, "account_type": "savings"}))
    for pol in case.insurance_policies:
        plan.append(AntimAction(tool_name="file_insurance_claim",
                                parameters={"policy_id": pol, "claim_type": "death"}))
    for scheme in case.government_schemes_eligible:
        plan.append(AntimAction(tool_name="check_government_scheme_eligibility",
                                parameters={"scheme_name": scheme}))
    for action in plan[:max_steps]:
        yield action


# ---------------------------------------------------------------------------
# Episode runner
# ---------------------------------------------------------------------------


@dataclass
class EpisodeResult:
    case_id: str
    policy: str
    cumulative_reward: float
    steps_taken: int
    days_elapsed: int
    final_phase: str
    final_done: bool
    final_rubric: float


def run_episode(
    case_id: str,
    policy_factory: Callable,
    rng: random.Random,
    policy_name: str,
    max_steps: int = 25,
) -> EpisodeResult:
    env = AntimEnvironment()
    env.reset(case_id=case_id)

    cumulative = 0.0
    n_steps = 0
    last_obs = None

    for action in policy_factory(env, rng, max_steps):
        last_obs = env.step(action)
        cumulative += last_obs.reward
        n_steps += 1
        if last_obs.done:
            break

    final_state = env.state
    return EpisodeResult(
        case_id=case_id,
        policy=policy_name,
        cumulative_reward=cumulative,
        steps_taken=n_steps,
        days_elapsed=last_obs.days_elapsed if last_obs else 0,
        final_phase=last_obs.phase if last_obs else "unknown",
        final_done=last_obs.done if last_obs else False,
        final_rubric=DEFAULT_RUBRIC.evaluate(final_state) if final_state else 0.0,
    )


# ---------------------------------------------------------------------------
# Trained-model rollout (optional)
# ---------------------------------------------------------------------------


def trained_model_policy(model_path: str):
    """
    Roll out a trained Llama checkpoint and yield AntimActions parsed from
    its JSON-array completion. Requires `transformers` to be installed.

    The model is expected to have been fine-tuned on the same SYSTEM_PROMPT
    used in antim_grpo_training.ipynb. We give it the env's reset message,
    sample a single completion, parse the JSON plan, and yield each step.
    """
    try:
        from transformers import AutoModelForCausalLM, AutoTokenizer  # type: ignore
        import torch  # type: ignore
    except ImportError as exc:  # pragma: no cover
        raise ImportError(
            "Trained-model eval needs transformers + torch installed."
        ) from exc

    tok = AutoTokenizer.from_pretrained(model_path)
    model = AutoModelForCausalLM.from_pretrained(model_path)
    model.eval()

    SYS = (
        "Output a JSON array of tool calls in optimal order. "
        "Format: [{\"tool\":\"<name>\",\"parameters\":{...}},...]"
    )

    def _factory(env, rng, max_steps):
        prompt = f"{SYS}\n\nCase briefing:\n{env.state.to_summary()}\n\nYour plan:\n"
        inputs = tok(prompt, return_tensors="pt")
        with torch.no_grad():
            out = model.generate(
                **inputs, max_new_tokens=512, temperature=0.2, top_p=0.95, do_sample=True,
            )
        text = tok.decode(out[0][inputs["input_ids"].shape[1]:], skip_special_tokens=True)
        try:
            actions = json.loads(text[text.index("["): text.rindex("]") + 1])
        except Exception:
            return  # invalid JSON -> empty trajectory
        for act in actions[:max_steps]:
            yield AntimAction(
                tool_name=act.get("tool", "get_case_context"),
                parameters=act.get("parameters", {}) or {},
            )

    return _factory


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main(argv: Optional[list[str]] = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--eval-cases", nargs="+", default=["CASE_009", "CASE_010"],
        help="Held-out case IDs to evaluate (default: held-out CASE_009 CASE_010).",
    )
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument(
        "--trained-model-path", default=None,
        help="If supplied, also evaluates a trained HF checkpoint.",
    )
    args = parser.parse_args(argv)

    policies: list[tuple[str, Callable]] = [
        ("random", random_policy),
        ("greedy_by_deadline", greedy_by_deadline_policy),
        ("optimal_static", optimal_static_policy),
    ]
    if args.trained_model_path:
        policies.append(("trained_grpo", trained_model_policy(args.trained_model_path)))

    results: list[EpisodeResult] = []
    for case_id in args.eval_cases:
        for name, factory in policies:
            rng = random.Random(args.seed)
            results.append(run_episode(case_id, factory, rng, name))

    # Markdown table
    print()
    print("| case_id  | policy              | reward  | steps | days | rubric |")
    print("|----------|---------------------|---------|-------|------|--------|")
    for r in results:
        print(f"| {r.case_id} | {r.policy:<19} | {r.cumulative_reward:+7.3f} | "
              f"{r.steps_taken:5d} | {r.days_elapsed:4d} | {r.final_rubric:6.3f} |")
    print()

    # Aggregate per policy
    by_policy: dict[str, list[float]] = {}
    for r in results:
        by_policy.setdefault(r.policy, []).append(r.cumulative_reward)
    print("Aggregate (mean cumulative reward across eval cases):")
    for name, rewards in by_policy.items():
        mean = sum(rewards) / len(rewards)
        print(f"  {name:<19} = {mean:+.3f}  (n={len(rewards)})")

    return 0


if __name__ == "__main__":
    sys.exit(main())
