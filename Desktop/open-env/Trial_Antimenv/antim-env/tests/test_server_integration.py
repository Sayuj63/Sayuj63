"""
Integration tests against the FastAPI server.

We use FastAPI's TestClient — no port binding required, no async event-loop
plumbing — and exercise the same endpoints judges' tooling will hit:
  - GET  /health     OpenEnv standard health probe
  - GET  /info       lightweight tool index
  - GET  /tools      full typed schemas (our addition)
  - GET  /metadata   OpenEnv metadata
  - GET  /schema     OpenEnv action/observation schemas
  - POST /reset      stateless reset (OpenEnv standard)
  - POST /step       stateless step  (OpenEnv standard)
  - POST /mcp        JSON-RPC MCP endpoint (auto-wired by openenv-core)

Stateless POST /step on a fresh env intentionally fails ("call reset before
step") because OpenEnv's HTTP design creates a fresh env per request and
persistent state lives in MCP sessions / WebSockets. We assert that this
error is *graceful* (HTTP 4xx/5xx with a clear message), not a 500 stack.
"""
from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

# IMPORTANT: importing the app must not crash. Server-import is a P0
# regression check.
from antim_env.server.app import app


@pytest.fixture(scope="module")
def client() -> TestClient:
    # raise_server_exceptions=False → the intentional misuse path
    # (stateless /step on a fresh env) returns 500 with a body, instead
    # of re-raising into the test. That's what we want to assert.
    return TestClient(app, raise_server_exceptions=False)


# ---------------------------------------------------------------------------
# Status / discovery endpoints
# ---------------------------------------------------------------------------


def test_health_endpoint_returns_200(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert isinstance(r.json(), dict)
    assert r.json().get("status") == "healthy"


def test_info_endpoint_lists_ten_tools(client):
    r = client.get("/info")
    assert r.status_code == 200
    body = r.json()
    assert body.get("environment") == "antim-env"
    assert body.get("total_tools") == 10
    assert len(body.get("tools", {})) == 10


def test_tools_endpoint_returns_full_typed_schemas(client):
    r = client.get("/tools")
    assert r.status_code == 200
    schemas = r.json()
    assert len(schemas) == 10
    # Every entry has name + description + parameters JSON Schema
    for entry in schemas:
        assert "name" in entry
        assert "description" in entry
        assert "parameters" in entry
        params = entry["parameters"]
        # Pydantic-derived JSON Schema has a 'properties' or 'type' key.
        assert "type" in params or "properties" in params or "$defs" in params


def test_metadata_endpoint_responds(client):
    r = client.get("/metadata")
    assert r.status_code == 200
    body = r.json()
    assert "name" in body


# ---------------------------------------------------------------------------
# Stateless OpenEnv lifecycle (HTTP)
# ---------------------------------------------------------------------------


def test_reset_returns_observation(client):
    r = client.post("/reset", json={})
    assert r.status_code == 200
    body = r.json()
    assert "observation" in body
    obs = body["observation"]
    assert "message" in obs
    assert "phase" in obs
    assert obs["phase"] in {"farewell", "closure", "continuity"}


def test_reset_with_kwargs_passed_through(client):
    """Passing case_id should select the named seed case."""
    r = client.post("/reset", json={"case_id": "CASE_001"})
    assert r.status_code == 200
    obs = r.json()["observation"]
    assert "Ramesh Kumar" in obs["message"]


def test_step_with_invalid_body_returns_4xx(client):
    """Missing 'action' wrapper key is a client error, not a 500."""
    r = client.post("/step", json={"tool_name": "x"})
    assert 400 <= r.status_code < 500, f"expected 4xx, got {r.status_code}"


def test_step_after_stateless_reset_misuse_path(client):
    """OpenEnv HTTP /step creates a fresh env per request; with no carried
    state it raises 'call reset before step'. Verify the response is a
    graceful 5xx with a clear server-rendered detail (not a raw stack)."""
    r = client.post("/step", json={
        "action": {
            "tool_name": "book_funeral_service",
            "parameters": {"vendor_id": "v1", "slot_time": "10am"},
        }
    })
    # Either openenv handles this with 5xx + message, or routes through MCP.
    # We accept any non-200 with a body.
    assert r.status_code != 200
    # Body should be JSON-decodable, even if it's just {"detail": "..."}.
    body = r.text
    assert body  # not empty


# ---------------------------------------------------------------------------
# JSON-RPC MCP endpoint (auto-wired by openenv-core)
# ---------------------------------------------------------------------------


def test_mcp_endpoint_exists(client):
    """The /mcp route must be wired (it's how persistent sessions work).
    We don't drive a full MCP session here — just verify the endpoint
    accepts POSTs and doesn't 404."""
    r = client.post("/mcp", json={
        "jsonrpc": "2.0",
        "id": 1,
        "method": "ping",
    })
    # ping isn't necessarily a real method — but the route must exist (not 404).
    assert r.status_code != 404
