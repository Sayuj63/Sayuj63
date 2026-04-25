"""
FastAPI server for AntimEnv.

Exposes the AntimEnvironment over HTTP using the OpenEnv protocol.
"""

from __future__ import annotations

from fastapi import FastAPI
from openenv.core import create_app

from antim_env.environment import AntimEnvironment
from antim_env.models import AntimAction, AntimObservation
from antim_env.tools import list_tool_schemas

# Create the main OpenEnv app.
# NOTE: openenv-core 0.2.3 create_app() does not accept title/description kwargs;
# set them on the FastAPI instance after creation.
app = create_app(
    AntimEnvironment,
    AntimAction,
    AntimObservation,
    env_name="antim-env",
    max_concurrent_envs=64,
)
app.title = "AntimEnv"
app.description = "RL environment for post-death coordination workflows in India"


# ------------------------------------------------------------------
# Custom Health Check Endpoint
# ------------------------------------------------------------------


@app.get("/health")
def health_check() -> dict:
    """
    Health check endpoint.

    Returns:
        Dictionary with health status and environment information.
    """
    return {
        "status": "healthy",
        "environment": "antim-env",
        "version": "0.1.0",
        "description": "Post-death coordination RL environment for India",
    }


# ------------------------------------------------------------------
# Custom Info Endpoint
# ------------------------------------------------------------------


@app.get("/info")
def get_info() -> dict:
    """
    Lightweight tool index — returns name+description only.

    For full JSON schemas, see GET /tools.
    """
    schemas = list_tool_schemas()
    return {
        "environment": "antim-env",
        "version": "0.1.0",
        "total_tools": len(schemas),
        "tools": {s["name"]: s["description"] for s in schemas},
    }


# ------------------------------------------------------------------
# /tools — full typed schemas (JSON Schema per tool)
# ------------------------------------------------------------------


@app.get("/tools")
def get_tools() -> list[dict]:
    """
    Return the full typed schema for each tool.

    Each entry has the MCP-style shape {name, description, parameters}.
    The 'parameters' field is a JSON Schema derived from the Pydantic model
    in antim_env.tools — single source of truth.
    """
    return list_tool_schemas()
