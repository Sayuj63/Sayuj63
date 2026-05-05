import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import postgres from "postgres";
import * as schema from "./schema/index";
import { migratePglite, migratePostgres } from "./migrate";

/** PGlite calls mkdir non-recursively; ensure `.data` (etc.) exists first. */
function ensurePgliteParentDir(dataPath: string) {
  const abs = resolve(dataPath);
  mkdirSync(dirname(abs), { recursive: true });
}

export type DrizzleDb =
  | ReturnType<typeof drizzlePg<typeof schema>>
  | ReturnType<typeof drizzlePglite<typeof schema>>;

let cached: {
  db: DrizzleDb;
  sql?: postgres.Sql;
  pglite?: PGlite;
} | null = null;

export function createDb(connectionString: string) {
  const client = postgres(connectionString, { max: 10 });
  return drizzlePg(client, { schema });
}

/**
 * Embedded PGlite (no Docker). Persists under `.data/` by default.
 */
export function createPgliteDb(dataDir?: string) {
  const dir = dataDir ?? ".data/retainiq.pglite";
  ensurePgliteParentDir(dir);
  const client = new PGlite(dir);
  return drizzlePglite(client, { schema });
}

/**
 * Run migrations then return a singleton Drizzle instance.
 * – No `DATABASE_URL` → PGlite on disk.
 * – `DATABASE_URL=postgresql://...` → TCP Postgres.
 */
export async function getBootstrappedDb(): Promise<DrizzleDb> {
  if (cached) return cached.db;

  const url = process.env.DATABASE_URL;
  if (url?.startsWith("postgresql")) {
    const sql = postgres(url, { max: 10 });
    await migratePostgres(sql);
    const db = drizzlePg(sql, { schema });
    cached = { db, sql };
    return db;
  }

  const diskPath = process.env.PGLITE_DATA_DIR ?? ".data/retainiq.pglite";
  let pglite: PGlite;
  if (process.env.PGLITE_MEMORY === "1") {
    pglite = new PGlite();
  } else {
    ensurePgliteParentDir(diskPath);
    pglite = new PGlite(diskPath);
  }
  await migratePglite(pglite);
  const db = drizzlePglite(pglite, { schema });
  cached = { db, pglite };
  return db;
}

export function getDbIfReady(): DrizzleDb | null {
  return cached?.db ?? null;
}

/** Vitest only — clears singleton between tests */
export function __resetDbSingletonForTests(): void {
  void cached?.sql?.end({ timeout: 5 });
  cached = null;
}
