import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { PGlite } from "@electric-sql/pglite";
import type postgres from "postgres";

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Split drizzle-kit migration files on statement breakpoints */
export function splitSqlStatements(sql: string): string[] {
  return sql
    .split(/--\> statement-breakpoint/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

async function readMigrationFiles(): Promise<string[]> {
  const drizzleDir = join(pkgRoot, "drizzle");
  const files = ["0000_init.sql", "0001_queued_jobs.sql"];
  const out: string[] = [];
  for (const f of files) {
    try {
      const content = await readFile(join(drizzleDir, f), "utf8");
      out.push(content);
    } catch {
      /* optional migration */
    }
  }
  return out;
}

export async function runSqlMigrations(
  executor: (sql: string) => Promise<unknown>,
): Promise<void> {
  const files = await readMigrationFiles();
  for (const file of files) {
    for (const stmt of splitSqlStatements(file)) {
      await executor(stmt);
    }
  }
}

/** PGlite embedded driver */
export async function migratePglite(client: PGlite): Promise<void> {
  await runSqlMigrations((sql) => client.exec(sql));
}

/** postgres.js TCP driver */
export async function migratePostgres(sql: postgres.Sql): Promise<void> {
  await runSqlMigrations((statement) => sql.unsafe(statement));
}
