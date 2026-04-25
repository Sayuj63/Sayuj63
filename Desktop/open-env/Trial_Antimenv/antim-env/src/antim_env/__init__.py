"""
antim_env — OpenEnv-compatible RL environment for post-death coordination
workflows in India.

Public API:
  Environment + types:    AntimEnvironment, AntimAction, AntimObservation,
                          FamilyCase, CaseState
  Tool registry:          TOOL_REGISTRY, list_tool_schemas, validate_tool_params
  Reward primitives:      DEFAULT_RUBRIC, RewardPrimitive, Rubric
  Curriculum:             generate_case, select_tier, capability_from_reward_mean
  Reward helpers:         compute_final_reward, compute_phase_reward,
                          compute_step_reward
"""

from antim_env.environment import AntimEnvironment
from antim_env.models import AntimAction, AntimObservation, FamilyCase, CaseState
from antim_env.delays import DelaySimulator
from antim_env.rewards import (
    compute_final_reward,
    compute_phase_reward,
    compute_step_reward,
    get_reward_explanation,
)
from antim_env.rubric import (
    DEFAULT_PRIMITIVES,
    DEFAULT_RUBRIC,
    RewardPrimitive,
    Rubric,
)
from antim_env.scenario_generator import (
    capability_from_reward_mean,
    generate_case,
    select_tier,
)
from antim_env.tools import (
    TOOL_REGISTRY,
    ToolValidationError,
    get_tool_schema,
    list_tool_names,
    list_tool_schemas,
    validate_tool_params,
)

__all__ = [
    "AntimEnvironment",
    "AntimAction",
    "AntimObservation",
    "FamilyCase",
    "CaseState",
    "DelaySimulator",
    "compute_final_reward",
    "compute_phase_reward",
    "compute_step_reward",
    "get_reward_explanation",
    "DEFAULT_PRIMITIVES",
    "DEFAULT_RUBRIC",
    "RewardPrimitive",
    "Rubric",
    "capability_from_reward_mean",
    "generate_case",
    "select_tier",
    "TOOL_REGISTRY",
    "ToolValidationError",
    "get_tool_schema",
    "list_tool_names",
    "list_tool_schemas",
    "validate_tool_params",
]
__version__ = "0.1.0"
