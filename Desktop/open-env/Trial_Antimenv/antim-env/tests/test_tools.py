"""
Tests for the typed tool registry (src/antim_env/tools.py).

The registry is the single source of truth for tool signatures. Every tool
implemented in environment.py MUST have a Pydantic schema; every schema MUST
have an implementation. Drift here is a P0 bug.
"""
from __future__ import annotations

import pytest

from antim_env import AntimAction, AntimEnvironment
from antim_env.tools import (
    RESERVED_TOOL_NAMES,
    TOOL_REGISTRY,
    ToolValidationError,
    get_tool_schema,
    list_tool_names,
    list_tool_schemas,
    validate_tool_params,
)


# ---------------------------------------------------------------------------
# Registry shape
# ---------------------------------------------------------------------------


def test_registry_has_ten_tools():
    assert len(TOOL_REGISTRY) == 10


def test_registry_does_not_collide_with_reserved_openenv_names():
    # Environment.reset / step / state / close are reserved by OpenEnv.
    assert RESERVED_TOOL_NAMES.isdisjoint(TOOL_REGISTRY.keys())


def test_registry_matches_environment_dispatch():
    # Every registered name must be a callable on the environment.
    env = AntimEnvironment()
    for name in TOOL_REGISTRY:
        assert hasattr(env, name), f"missing method for {name}"


def test_list_tool_schemas_returns_one_entry_per_tool():
    schemas = list_tool_schemas()
    assert len(schemas) == len(TOOL_REGISTRY)
    names = {s["name"] for s in schemas}
    assert names == set(TOOL_REGISTRY.keys())


def test_each_schema_includes_a_description():
    for s in list_tool_schemas():
        assert s["description"], f"missing description for {s['name']}"


def test_get_tool_schema_unknown_tool_raises():
    with pytest.raises(KeyError):
        get_tool_schema("nope")


# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------


def test_validate_required_field():
    with pytest.raises(ToolValidationError):
        validate_tool_params("book_funeral_service", {"vendor_id": "v1"})


def test_validate_enum_violation():
    with pytest.raises(ToolValidationError):
        validate_tool_params(
            "notify_bank", {"bank_id": "SBI", "account_type": "crypto"}
        )


def test_validate_int_range():
    with pytest.raises(ToolValidationError):
        validate_tool_params("advance_time", {"days": 0})
    with pytest.raises(ToolValidationError):
        validate_tool_params("advance_time", {"days": 99})


def test_validate_extra_forbidden():
    with pytest.raises(ToolValidationError):
        validate_tool_params(
            "book_funeral_service",
            {"vendor_id": "v1", "slot_time": "10am", "foo": "bar"},
        )


def test_validate_unknown_tool_raises():
    with pytest.raises(ToolValidationError):
        validate_tool_params("nope", {})


def test_validate_normalizes_default_values():
    out = validate_tool_params("notify_bank", {"bank_id": "SBI"})
    assert out["account_type"] == "savings"


def test_validate_strict_string_minlength():
    with pytest.raises(ToolValidationError):
        validate_tool_params("book_funeral_service", {"vendor_id": "", "slot_time": "10am"})


# ---------------------------------------------------------------------------
# End-to-end through env.step()
# ---------------------------------------------------------------------------


def test_step_surfaces_schema_violation_in_observation():
    env = AntimEnvironment()
    env.reset(case_id="CASE_001")
    obs = env.step(
        AntimAction(tool_name="advance_time", parameters={"days": 99})
    )
    assert "Schema validation failed" in obs.message
    assert obs.error is not None
    assert env.state.days_elapsed == 0  # tool did NOT run


def test_step_valid_call_runs_tool():
    env = AntimEnvironment()
    env.reset(case_id="CASE_001")
    obs = env.step(
        AntimAction(
            tool_name="book_funeral_service",
            parameters={"vendor_id": "v1", "slot_time": "10am"},
        )
    )
    assert obs.error is None
    assert env.state.funeral_completed is True


def test_step_unknown_tool_returns_friendly_message():
    env = AntimEnvironment()
    env.reset(case_id="CASE_001")
    obs = env.step(AntimAction(tool_name="nope", parameters={}))
    assert "Unknown tool" in obs.message


def test_environment_list_tools_classmethod():
    schemas = AntimEnvironment.list_tools()
    assert len(schemas) == 10
    assert all("parameters" in s for s in schemas)
