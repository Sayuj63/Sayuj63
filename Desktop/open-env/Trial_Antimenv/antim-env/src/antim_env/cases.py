"""
Case definitions and workflow scenario generators for AntimEnv.

Contains 10 hardcoded seed cases representing realistic Indian post-death
coordination scenarios, plus utilities for loading and generating training
prompts.
"""

from __future__ import annotations

import copy
import random
from typing import List, Optional

from antim_env.models import FamilyCase


# ---------------------------------------------------------------------------
# 10 Seed Cases — Realistic Indian Scenarios
# ---------------------------------------------------------------------------

SEED_CASES: List[FamilyCase] = [
    # Case 1 — Simple case, no will, widow pension eligible
    FamilyCase(
        case_id="CASE_001",
        deceased_name="Ramesh Kumar",
        deceased_age=58,
        city="Pune",
        cause_of_death="natural",
        has_will=False,
        banks=["SBI", "HDFC"],
        insurance_policies=["LIC-001"],
        is_primary_earner=True,
        dependents=2,
        government_schemes_eligible=["widow_pension", "PMJDY"],
        complexity="simple",
        municipality_delay_days=3,
        has_outstanding_loan=False,
        is_nri_case=False,
    ),
    # Case 2 — Complex case, accident, multiple banks, has loan
    FamilyCase(
        case_id="CASE_002",
        deceased_name="Priya Sharma",
        deceased_age=42,
        city="Chennai",
        cause_of_death="accident",
        has_will=True,
        banks=["ICICI", "SBI", "PNB"],
        insurance_policies=["LIC-002", "MAX-001"],
        is_primary_earner=True,
        dependents=3,
        government_schemes_eligible=["EDLI", "widow_pension"],
        complexity="complex",
        municipality_delay_days=7,
        has_outstanding_loan=True,
        is_nri_case=False,
    ),
    # Case 3 — Elderly, simple, no dependents, no insurance
    FamilyCase(
        case_id="CASE_003",
        deceased_name="Mohammad Iqbal",
        deceased_age=71,
        city="Lucknow",
        cause_of_death="natural",
        has_will=False,
        banks=["PNB"],
        insurance_policies=[],
        is_primary_earner=False,
        dependents=0,
        government_schemes_eligible=[],
        complexity="simple",
        municipality_delay_days=0,
        has_outstanding_loan=False,
        is_nri_case=False,
    ),
    # Case 4 — Moderate complexity, sudden illness, has will, 4 dependents
    FamilyCase(
        case_id="CASE_004",
        deceased_name="Suresh Patel",
        deceased_age=45,
        city="Ahmedabad",
        cause_of_death="sudden_illness",
        has_will=True,
        banks=["SBI", "BOB"],
        insurance_policies=["LIC-003"],
        is_primary_earner=True,
        dependents=4,
        government_schemes_eligible=["widow_pension", "PMJDY", "EDLI"],
        complexity="moderate",
        municipality_delay_days=5,
        has_outstanding_loan=False,
        is_nri_case=False,
    ),
    # Case 5 — Accident, no will, has loan, moderate complexity
    FamilyCase(
        case_id="CASE_005",
        deceased_name="Anita Reddy",
        deceased_age=39,
        city="Hyderabad",
        cause_of_death="accident",
        has_will=False,
        banks=["HDFC", "Axis"],
        insurance_policies=["HDFC_Life_001"],
        is_primary_earner=True,
        dependents=2,
        government_schemes_eligible=["widow_pension"],
        complexity="moderate",
        municipality_delay_days=2,
        has_outstanding_loan=True,
        is_nri_case=False,
    ),
    # Case 6 — Simple, has will, not primary earner, multiple insurance
    FamilyCase(
        case_id="CASE_006",
        deceased_name="Vijay Nair",
        deceased_age=52,
        city="Kochi",
        cause_of_death="natural",
        has_will=True,
        banks=["SBI", "Federal"],
        insurance_policies=["LIC-004", "SBI_Life_001"],
        is_primary_earner=False,
        dependents=1,
        government_schemes_eligible=[],
        complexity="simple",
        municipality_delay_days=1,
        has_outstanding_loan=False,
        is_nri_case=False,
    ),
    # Case 7 — NRI case, complex, died abroad (Dubai), body repatriation
    FamilyCase(
        case_id="CASE_007",
        deceased_name="Rajesh Mehta",
        deceased_age=48,
        city="Mumbai",
        cause_of_death="sudden_illness",
        has_will=False,
        banks=["HDFC", "SBI", "NRI_Account_001"],
        insurance_policies=["LIC-005"],
        is_primary_earner=True,
        dependents=2,
        government_schemes_eligible=["widow_pension"],
        complexity="complex",
        municipality_delay_days=10,
        has_outstanding_loan=False,
        is_nri_case=True,
    ),
    # Case 8 — Government employee, CGEGIS, GPF, gratuity schemes
    FamilyCase(
        case_id="CASE_008",
        deceased_name="Kavitha Subramanian",
        deceased_age=55,
        city="Bangalore",
        cause_of_death="natural",
        has_will=True,
        banks=["SBI"],
        insurance_policies=["LIC_CGEGIS_001"],
        is_primary_earner=False,
        dependents=1,
        government_schemes_eligible=["CGEGIS", "GPF", "gratuity"],
        complexity="moderate",
        municipality_delay_days=0,
        has_outstanding_loan=False,
        is_nri_case=False,
    ),
    # Case 9 — Complex, multiple banks, multiple loans, accident
    FamilyCase(
        case_id="CASE_009",
        deceased_name="Deepak Singh",
        deceased_age=43,
        city="Delhi",
        cause_of_death="accident",
        has_will=False,
        banks=["SBI", "HDFC", "PNB", "Axis"],
        insurance_policies=["LIC-006"],
        is_primary_earner=True,
        dependents=3,
        government_schemes_eligible=["widow_pension", "EDLI"],
        complexity="complex",
        municipality_delay_days=8,
        has_outstanding_loan=True,
        is_nri_case=False,
    ),
    # Case 10 — Elderly, simple, has will, no dependents, no insurance
    FamilyCase(
        case_id="CASE_010",
        deceased_name="Meenakshi Iyer",
        deceased_age=78,
        city="Coimbatore",
        cause_of_death="natural",
        has_will=True,
        banks=["Indian_Bank"],
        insurance_policies=[],
        is_primary_earner=False,
        dependents=0,
        government_schemes_eligible=[],
        complexity="simple",
        municipality_delay_days=0,
        has_outstanding_loan=False,
        is_nri_case=False,
    ),
]


# ---------------------------------------------------------------------------
# Case Loading Functions
# ---------------------------------------------------------------------------


def load_random_case(case_id: Optional[str] = None) -> FamilyCase:
    """
    Load a FamilyCase from the seed cases.

    Always returns a *deep copy* so per-episode mutation (e.g. escalate_delay
    reducing municipality_delay_days) does not bleed across episodes via the
    shared module-level SEED_CASES list.

    Args:
        case_id: If provided, returns the case with matching case_id.
                 If None, returns a random case from SEED_CASES.

    Returns:
        A fresh FamilyCase instance (deep-copied).

    Raises:
        ValueError: If case_id is provided but not found in SEED_CASES.
    """
    if case_id is None:
        return copy.deepcopy(random.choice(SEED_CASES))

    for case in SEED_CASES:
        if case.case_id == case_id:
            return copy.deepcopy(case)

    raise ValueError(
        f"Case ID '{case_id}' not found in SEED_CASES. "
        f"Available IDs: {[c.case_id for c in SEED_CASES]}"
    )


def load_all_cases() -> List[FamilyCase]:
    """
    Return all seed cases.

    Returns:
        A list containing all 10 FamilyCase instances from SEED_CASES.
    """
    return SEED_CASES.copy()


# ---------------------------------------------------------------------------
# Training Prompt Generation
# ---------------------------------------------------------------------------


def generate_training_prompts() -> List[str]:
    """
    Generate training prompts for all 10 seed cases.

    Each prompt provides context about the deceased, family situation, and
    available resources, formatted for use in RL training or agent evaluation.

    Returns:
        A list of 10 prompt strings, one per seed case.
    """
    prompts = []

    for case in SEED_CASES:
        # Format banks list
        if len(case.banks) == 1:
            banks_str = case.banks[0]
        elif len(case.banks) == 2:
            banks_str = f"{case.banks[0]} and {case.banks[1]}"
        else:
            banks_str = ", ".join(case.banks[:-1]) + f", and {case.banks[-1]}"

        # Format dependents
        if case.dependents == 0:
            dependents_str = "no dependents"
        elif case.dependents == 1:
            dependents_str = "1 dependent"
        else:
            dependents_str = f"{case.dependents} dependents"

        # Build prompt
        prompt = (
            f"You are helping a family after the death of {case.deceased_name}, "
            f"age {case.deceased_age}, in {case.city}. "
            f"Cause of death: {case.cause_of_death}. "
            f"The family has accounts at {banks_str}. "
            f"They have {dependents_str}. "
            f"Current day: 1. "
            f"Navigate the post-death coordination tasks in the correct order."
        )

        prompts.append(prompt)

    return prompts


# ---------------------------------------------------------------------------
# Legacy compatibility (for backward compatibility with old code)
# ---------------------------------------------------------------------------


def sample_case(seed: Optional[int] = None) -> FamilyCase:
    """
    Legacy function for backward compatibility.
    Returns a random case from SEED_CASES.

    Args:
        seed: Optional random seed for reproducibility.

    Returns:
        A FamilyCase instance.
    """
    if seed is not None:
        random.seed(seed)
    return random.choice(SEED_CASES)


def hardcoded_cases() -> List[FamilyCase]:
    """
    Legacy function for backward compatibility.
    Returns all seed cases.

    Returns:
        A list containing all 10 FamilyCase instances.
    """
    return SEED_CASES.copy()
