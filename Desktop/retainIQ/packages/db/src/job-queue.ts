import { and, count, eq, isNull, lte } from "drizzle-orm";
import type { DrizzleDb } from "./create-db";
import { queuedJobs } from "./schema/queued-jobs";

export type JobHandler = (
  payload: Record<string, unknown>,
) => Promise<void>;

export async function enqueueJob(
  db: DrizzleDb,
  name: string,
  payload: Record<string, unknown>,
  runAt: Date,
) {
  await db.insert(queuedJobs).values({
    name,
    payload,
    runAt,
  });
}

export async function processDueJobs(
  db: DrizzleDb,
  handlers: Record<string, JobHandler>,
  options?: { limit?: number },
): Promise<number> {
  const limit = options?.limit ?? 10;
  const now = new Date();

  const due = await db
    .select()
    .from(queuedJobs)
    .where(
      and(lte(queuedJobs.runAt, now), isNull(queuedJobs.completedAt)),
    )
    .limit(limit);

  let done = 0;
  for (const job of due) {
    await db
      .update(queuedJobs)
      .set({ startedAt: now })
      .where(eq(queuedJobs.id, job.id));

    const handler = handlers[job.name];
    if (!handler) {
      await db
        .update(queuedJobs)
        .set({
          completedAt: new Date(),
          error: `No handler for job name: ${job.name}`,
        })
        .where(eq(queuedJobs.id, job.id));
      continue;
    }

    try {
      await handler(job.payload as Record<string, unknown>);
      await db
        .update(queuedJobs)
        .set({ completedAt: new Date(), error: null })
        .where(eq(queuedJobs.id, job.id));
      done++;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await db
        .update(queuedJobs)
        .set({ completedAt: new Date(), error: message })
        .where(eq(queuedJobs.id, job.id));
    }
  }

  return done;
}

export async function countPending(db: DrizzleDb): Promise<number> {
  const [row] = await db
    .select({ c: count() })
    .from(queuedJobs)
    .where(isNull(queuedJobs.completedAt));
  return Number(row?.c ?? 0);
}
