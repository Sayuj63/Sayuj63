#!/usr/bin/env python3
"""
End-to-end example: run an optimal-ish trajectory on CASE_001 and print the
per-step reward, accumulated reward, and final episode return.

Usage:
    PYTHONPATH=src python3 example_usage.py
"""
from __future__ import annotations

from antim_env import AntimEnvironment, AntimAction


def main() -> None:
    env = AntimEnvironment()
    obs = env.reset(case_id="CASE_001")  # Ramesh Kumar, Pune

    case = env.case
    print("=" * 70)
    print(f"CASE: {case.deceased_name}, age {case.deceased_age}, {case.city}")
    print(f"  Cause: {case.cause_of_death}  |  Will: {case.has_will}  |  "
          f"Primary earner: {case.is_primary_earner}")
    print(f"  Banks: {', '.join(case.banks)}")
    print(f"  Policies: {', '.join(case.insurance_policies) or 'none'}")
    print(f"  Schemes eligible: {', '.join(case.government_schemes_eligible) or 'none'}")
    print(f"  Municipality delay (days): {case.municipality_delay_days}")
    print("=" * 70)
    print(f"\n[reset] {obs.message}")
    print(f"        phase={obs.phase}  next_deadline={obs.urgent_deadline}")

    # An optimal-ish plan for CASE_001 (3-day muni delay, 2 banks, 1 policy,
    # widow pension + PMJDY eligible).
    plan: list[AntimAction] = [
        AntimAction(tool_name="book_funeral_service",
                    parameters={"vendor_id": "vendor_001", "slot_time": "10:00 AM"}),
        AntimAction(tool_name="submit_death_certificate_application",
                    parameters={"municipality_id": "PMC"}),
        AntimAction(tool_name="advance_time", parameters={"days": 4}),
        AntimAction(tool_name="notify_bank",
                    parameters={"bank_id": "SBI", "account_type": "savings"}),
        AntimAction(tool_name="notify_bank",
                    parameters={"bank_id": "HDFC", "account_type": "savings"}),
        AntimAction(tool_name="file_insurance_claim",
                    parameters={"policy_id": "LIC-001", "claim_type": "death"}),
        AntimAction(tool_name="check_government_scheme_eligibility",
                    parameters={"scheme_name": "widow_pension"}),
        AntimAction(tool_name="check_government_scheme_eligibility",
                    parameters={"scheme_name": "PMJDY"}),
    ]

    cumulative = 0.0
    for i, action in enumerate(plan, start=1):
        obs = env.step(action)
        cumulative += obs.reward
        params = ", ".join(f"{k}={v!r}" for k, v in action.parameters.items())
        print(f"\n[step {i:>2}] {action.tool_name}({params})")
        print(f"           reward={obs.reward:+.3f}  cumulative={cumulative:+.3f}  "
              f"day={obs.days_elapsed}  phase={obs.phase}  done={obs.done}")
        if obs.done:
            print("\n[EPISODE COMPLETE]")
            break

    print("\n" + "=" * 70)
    print(f"FINAL: cumulative reward = {cumulative:+.3f} over {i} steps "
          f"(day {obs.days_elapsed})")
    print("=" * 70)


if __name__ == "__main__":
    main()
