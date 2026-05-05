import { getBootstrappedDb, processDueJobs } from "@retainiq/db";

let interval: ReturnType<typeof setInterval> | undefined;

export async function startJobWorker(): Promise<void> {
  const db = await getBootstrappedDb();

  const handlers = {
    "post-purchase": async (payload: Record<string, unknown>) => {
      process.stdout.write(
        `${JSON.stringify({
          channel: "stub",
          kind: "post-purchase",
          payload,
          at: new Date().toISOString(),
        })}\n`,
      );
    },
  };

  const tick = async () => {
    try {
      await processDueJobs(db, handlers, { limit: 25 });
    } catch (err) {
      console.error("[job-worker]", err);
    }
  };

  await tick();
  interval = setInterval(tick, 2000);
}

export function stopJobWorkerForTests(): void {
  if (interval) clearInterval(interval);
  interval = undefined;
}
