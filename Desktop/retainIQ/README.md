# RetainIQ Pro — Monorepo

Shopify-native retention stack: **embedded Postgres (PGlite)** when Docker is unavailable, **Next.js** merchant app with **OAuth**, **`/api/webhooks`** ingestion, and a **queued job worker** (Postgres-backed `queued_jobs` table + poller in `instrumentation.ts`). Optional **Fastify ingestion** service remains for split deployments.

## Prerequisites

- Node.js 20+
- pnpm 9+
- **Docker not required** — local DB uses `@electric-sql/pglite` under `.data/` by default.

## Quick start (no Docker)

```bash
pnpm install
cp .env.example .env   # fill Shopify keys when testing OAuth live
pnpm dev               # Next.js :3000 — migrates PGlite on first DB access
pnpm test              # Vitest (order ingest + queue)
pnpm build
```

- **Dashboard:** [http://localhost:3000](http://localhost:3000)
- **OAuth install:** `GET /api/auth?shop=your-store.myshopify.com`
- **Webhooks:** `POST /api/webhooks` (configure in Shopify Partners; use same secret as `SHOPIFY_API_SECRET` or set `SHOPIFY_WEBHOOK_SECRET`)

Post-purchase jobs default to **T+2h** (`RETAINIQ_POST_PURCHASE_DELAY_MS` overrides; tests use a short delay).

## Environment

See `.env.example`. Important variables:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Optional. If unset, **PGlite** file DB is used. Set to `postgresql://...` for Docker Postgres / RDS. |
| `PGLITE_DATA_DIR` | Override PGlite directory (default `.data/retainiq.pglite`). |
| `SHOPIFY_API_KEY` / `SHOPIFY_API_SECRET` | OAuth + webhook HMAC fallback |
| `SHOPIFY_APP_URL` | Public base URL (e.g. `https://xyz.ngrok.io`) |
| `SCOPES` | Comma-separated Shopify scopes (default includes orders) |

## Packages

| Path | Role |
|------|------|
| `apps/admin` | Next.js 14 — UI, Shopify OAuth, webhooks, instrumentation worker |
| `packages/db` | Drizzle schemas, PGlite/Postgres bootstrap, migrations, job queue helpers |
| `services/ingestion` | Optional standalone webhook receiver (build only in turbo; no `dev` script — use Next.js webhooks locally) |

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Turbo dev — **admin app only** (embedded DB + worker) |
| `pnpm build` | Production build |
| `pnpm test` | Vitest |
| `pnpm db:generate` | New Drizzle migration from schema |
| `pnpm db:migrate` | Drizzle Kit migrate (TCP Postgres; PGlite uses SQL bootstrap inside `getBootstrappedDb`) |

## Docker (optional)

```bash
docker compose up -d postgres redis
export DATABASE_URL=postgresql://retainiq:retainiq@localhost:5432/retainiq
pnpm dev
```

## Architecture notes

- **Single-process dev:** PGlite cannot be shared across multiple Node processes. Webhooks and the job worker run inside **one Next.js server** (`instrumentation.ts`).
- **Production:** Point `DATABASE_URL` at managed Postgres; deploy Next.js and optionally scale standalone `services/ingestion` behind your gateway.

See `RetainIQ-Pro-PRD.md` for the full product specification.
