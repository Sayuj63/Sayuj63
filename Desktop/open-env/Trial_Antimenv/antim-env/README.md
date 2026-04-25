# AntimEnv

**AntimEnv** — An OpenEnv-compatible RL training environment for post-death coordination workflows in India. Trains AI agents to navigate funeral arrangements, death certificates, bank notifications, insurance claims, and government scheme applications across a long-horizon multi-step workflow.

## Overview

AntimEnv simulates the complex bureaucratic coordination tasks that Indian families face after a death in the family. The environment models realistic delays, city-specific bureaucratic friction, and multi-step dependencies across three workflow phases:

1. **Farewell** — Funeral arrangements, death slip collection
2. **Closure** — Death certificate application/collection, bank/loan notifications
3. **Continuity** — Insurance claims, government scheme applications

## Installation

```bash
cd antim-env
pip install -e .
```

## Quick Start

```python
from antim_env import AntimEnv, AntimAction
from antim_env.cases import load_random_case

# Load a specific case or random case
case = load_random_case("CASE_001")  # Ramesh Kumar, Pune
# OR: case = load_random_case()  # Random case

# Initialize environment with the case
env = AntimEnv(case_profile=case, seed=42)
obs = env.reset()

# Take actions
action = AntimAction(tool_name="complete_funeral", parameters={})
obs, reward, done, truncated, info = env.step(action)

print(f"Message: {obs.message}")
print(f"Days elapsed: {obs.days_elapsed}")
print(f"Phase: {obs.phase}")
print(f"Reward: {reward}")
```

## Available Tools (10)

The agent's action space is a typed tool call. The same 10 tools appear in
`environment.py`, `openenv.yaml`, and the system prompt — single source of truth.

### Information tools (one-shot positive reward, spam is penalized)
- `get_case_context()` — full case briefing (deceased, family, banks, policies, schemes)
- `check_document_status(document_type)` — `death_slip` | `death_certificate` | `aadhaar` | `pan` | `will` | `insurance_policy`
- `get_next_critical_deadline()` — most urgent task with legal consequences

### Action tools (Farewell phase)
- `book_funeral_service(vendor_id, slot_time)` — books funeral, advances 1 day, obtains death slip

### Action tools (Closure phase)
- `submit_death_certificate_application(municipality_id)` — files application; municipality returns city-specific delay
- `notify_bank(bank_id, account_type)` — `account_type ∈ savings | fd | locker | loan`. Requires death certificate first; otherwise penalized.

### Action tools (Continuity phase)
- `file_insurance_claim(policy_id, claim_type)` — `claim_type ∈ death | accident`. Requires bank notification first.
- `check_government_scheme_eligibility(scheme_name)` — applies for `widow_pension | PMJDY | EDLI | CGEGIS | GPF | gratuity`

### Time / control tools
- `advance_time(days)` — `1..7`; consecutive spam (>3 in a window of 5) is penalized
- `escalate_delay(office_id, reason)` — files a grievance; reduces municipality delay by 2 days

## Data Models

### AntimAction
```python
AntimAction(
    tool_name: str,           # Name of tool to call
    parameters: dict = {}     # Tool parameters
)
```

### AntimObservation
```python
AntimObservation(
    message: str,             # Result of last action
    case_summary: str,        # Full status of all tasks
    days_elapsed: int,        # Simulated days since death
    urgent_deadline: str,     # Most pressing deadline
    reward: float,            # Reward for last step
    done: bool,               # Episode complete
    phase: str,               # Current phase
    error: str | None         # Error message if tool failed
)
```

### FamilyCase
Immutable descriptor for an episode:
- `case_id`, `deceased_name`, `deceased_age`, `city`
- `cause_of_death`: "natural" | "accident" | "sudden_illness"
- `has_will`: bool
- `banks`: list of bank names (e.g., ["SBI", "HDFC"])
- `insurance_policies`: list of policy IDs
- `is_primary_earner`: bool
- `dependents`: int
- `government_schemes_eligible`: list of scheme names
- `complexity`: "simple" | "moderate" | "complex"
- `municipality_delay_days`: 0-15 (bureaucratic delay)
- `has_outstanding_loan`: bool
- `is_nri_case`: bool (body repatriation needed)

### CaseState
Mutable runtime state tracking episode progress:
- `days_elapsed`, `current_phase`
- `funeral_completed`, `death_slip_obtained`
- `death_certificate_applied`, `death_certificate_obtained`
- `banks_notified`, `insurance_claims_filed`, `schemes_applied`
- `loan_notified`, `actions_taken`, `last_reward`

Methods:
- `to_summary()` — Formatted status string
- `get_next_deadline()` — Most urgent upcoming task
- `is_terminal()` — True when episode should end

## Episode Termination

An episode ends when:
- **Time limit**: More than 30 simulated days have elapsed, OR
- **Success**: All critical tasks completed (funeral done, death certificate obtained, at least one bank notified)

## Reward Structure

- **Base rewards** per successful tool call (e.g., collect_death_certificate: +10.0)
- **Time penalty**: -0.2 per day elapsed (encourages efficiency)
- **Completion bonus**: +50.0 when all critical tasks done within 30 days
- **Truncation penalty**: -25.0 if time limit exceeded without completion
- **Failure penalty**: -1.0 for failed tool calls

## City-Specific Delays

The environment models realistic bureaucratic friction across Indian cities:

| City       | Multiplier | Notes                    |
|------------|------------|--------------------------|
| Chennai    | 0.9×       | Most efficient           |
| Mumbai     | 1.0×       | Baseline                 |
| Delhi      | 1.1×       | Moderate delays          |
| Jaipur     | 1.2×       | Higher friction          |
| Patna      | 1.5×       | Significant delays       |

Additional factors:
- **No will**: +30% delay for continuity phase
- **NRI case**: +150% delay for farewell phase (repatriation)
- **More dependents**: +2% per dependent (coordination overhead)
- **Municipality delay**: 0-15 days added to death certificate processing

## Example Workflow

See `example_usage.py` for a complete episode walkthrough:

```bash
python example_usage.py
```

See `demo_cases.py` for a demonstration of all 10 seed cases:

```bash
python demo_cases.py
```

## Seed Cases

AntimEnv includes 10 hardcoded seed cases representing realistic Indian scenarios:

| Case ID | Name | Age | City | Complexity | Special Features |
|---------|------|-----|------|------------|------------------|
| CASE_001 | Ramesh Kumar | 58 | Pune | Simple | No will, widow pension |
| CASE_002 | Priya Sharma | 42 | Chennai | Complex | 3 banks, has loan |
| CASE_003 | Mohammad Iqbal | 71 | Lucknow | Simple | Elderly, no dependents |
| CASE_004 | Suresh Patel | 45 | Ahmedabad | Moderate | 4 dependents, has will |
| CASE_005 | Anita Reddy | 39 | Hyderabad | Moderate | Accident, has loan |
| CASE_006 | Vijay Nair | 52 | Kochi | Simple | Multiple insurance |
| CASE_007 | Rajesh Mehta | 48 | Mumbai | Complex | **NRI case** (died in Dubai) |
| CASE_008 | Kavitha Subramanian | 55 | Bangalore | Moderate | Government employee |
| CASE_009 | Deepak Singh | 43 | Delhi | Complex | 4 banks, has loan |
| CASE_010 | Meenakshi Iyer | 78 | Coimbatore | Simple | Elderly, has will |

### Loading Cases

```python
from antim_env.cases import load_random_case, load_all_cases, generate_training_prompts

# Load specific case by ID
case = load_random_case("CASE_007")  # NRI case

# Load random case
case = load_random_case()

# Load all 10 cases
all_cases = load_all_cases()

# Generate training prompts for all cases
prompts = generate_training_prompts()
```

## Running Tests

```bash
pip install pytest
pytest tests/
```

## Delay Simulator

The `DelaySimulator` class generates realistic bureaucratic responses from Indian institutions:

```python
from antim_env.delays import DelaySimulator

simulator = DelaySimulator()

# Municipality response
response = simulator.get_municipality_response("Pune", 5)

# Bank response
response = simulator.get_bank_response("SBI", "savings", has_death_certificate=True)

# Insurance response
response = simulator.get_insurance_response("life", has_death_certificate=True, is_accident=False)

# Government scheme response
response = simulator.get_scheme_response("widow_pension", is_primary_earner_dead=True)

# NRI body repatriation
response = simulator.get_nri_response("Mumbai")
```

See `demo_delays.py` for complete examples:

```bash
python demo_delays.py
```

## HTTP Server

Start the FastAPI server to expose the environment over HTTP:

```bash
uvicorn antim_env.server.app:app --host 0.0.0.0 --port 8000
```

Endpoints:
- `GET /env/health` — Health check
- `POST /env/reset` — Reset environment (body: `{"seed": 42}`)
- `POST /env/step` — Take step (body: `{"tool_name": "...", "parameters": {...}}`)
- `GET /env/render` — Get current state summary

## Docker

Build and run:

```bash
docker build -t antim-env .
docker run -p 8000:8000 antim-env
```

## Project Structure

```
antim-env/
├── src/antim_env/
│   ├── __init__.py          # Package exports
│   ├── models.py            # Data models (Action, Observation, FamilyCase, CaseState)
│   ├── environment.py       # Core OpenEnv environment
│   ├── cases.py             # Case generators
│   ├── delays.py            # Delay simulation
│   ├── rewards.py           # Reward functions
│   └── server/
│       ├── __init__.py
│       └── app.py           # FastAPI server
├── tests/
│   ├── test_models.py       # Model tests
│   ├── test_environment.py  # Environment tests
│   └── test_rewards.py      # Reward tests
├── example_usage.py         # Example workflow
├── Dockerfile
├── openenv.yaml             # OpenEnv metadata
├── requirements.txt
├── setup.py
└── README.md
```

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.
