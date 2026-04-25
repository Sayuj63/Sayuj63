# Multi-stage build for AntimEnv
# Stage 1: Builder
FROM python:3.11-slim as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Stage 2: Runtime
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install runtime dependencies only
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy Python dependencies from builder
COPY --from=builder /root/.local /root/.local

# Set PATH to use local pip installations
ENV PATH=/root/.local/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Copy project files
COPY . .

# Install the package in editable mode
RUN pip install --no-cache-dir -e .

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -fsS http://localhost:8000/health || exit 1

# Expose port
EXPOSE 8000

# Run the application.
# NOTE: we use a SINGLE uvicorn worker. OpenEnv's session pool keeps per-session
# state in-process; multi-worker deployments would shard sessions across
# processes and silently corrupt MCP sessions for non-sticky load balancers.
# A single worker is safe and sufficient for hackathon / HF Space deployment.
CMD ["uvicorn", "antim_env.server.app:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
