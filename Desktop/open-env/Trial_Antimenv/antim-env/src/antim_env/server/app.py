"""
FastAPI server for AntimEnv.

Exposes the AntimEnvironment over HTTP using the OpenEnv protocol.
"""

from __future__ import annotations

from fastapi import FastAPI
from openenv.core import create_app

from antim_env.environment import AntimEnvironment
from antim_env.models import AntimAction, AntimObservation

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
    Get information about available tools.

    Returns:
        Dictionary with list of tools and their descriptions.
    """
    tools = {
        "get_case_context": "Get detailed case information including deceased details, family situation, and all institutions to contact",
        "check_document_status": "Check if a document is available (death_slip, death_certificate, aadhaar, pan, will, insurance_policy)",
        "book_funeral_service": "Book funeral service with a vendor at a specific time slot",
        "submit_death_certificate_application": "Submit death certificate application to the municipality",
        "notify_bank": "Notify a bank of the death and begin account closure process",
        "file_insurance_claim": "File an insurance claim for a specific policy",
        "check_government_scheme_eligibility": "Check eligibility and apply for a government scheme",
        "escalate_delay": "Escalate a delay through the grievance mechanism",
        "get_next_critical_deadline": "Get the next critical deadline with legal consequences",
        "advance_time": "Advance simulated time by 1-7 days",
    }

    return {
        "environment": "antim-env",
        "version": "0.1.0",
        "total_tools": len(tools),
        "tools": tools,
    }
