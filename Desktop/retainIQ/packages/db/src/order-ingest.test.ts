import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  __resetDbSingletonForTests,
  countPending,
  getBootstrappedDb,
  ingestOrderPaidEvent,
  processDueJobs,
  shops,
} from "./index";

describe("order ingest + queue", () => {
  beforeEach(async () => {
    process.env.PGLITE_MEMORY = "1";
    delete process.env.DATABASE_URL;
    process.env.RETAINIQ_POST_PURCHASE_DELAY_MS = "10";
    __resetDbSingletonForTests();
    const db = await getBootstrappedDb();
    await db.insert(shops).values({
      shopifyDomain: "demo.myshopify.com",
      accessToken: "offline-token",
    });
  });

  afterEach(() => {
    __resetDbSingletonForTests();
  });

  it("persists order and enqueues post-purchase job", async () => {
    const db = await getBootstrappedDb();
    await ingestOrderPaidEvent(db, "demo.myshopify.com", {
      id: 9001,
      currency: "USD",
      total_price: "42.00",
      line_items: [
        { title: "Collagen", quantity: 1, price: "42.00", sku: "COL-1" },
      ],
    });

    expect(await countPending(db)).toBe(1);
  });

  it("runs post-purchase handler", async () => {
    const db = await getBootstrappedDb();
    await ingestOrderPaidEvent(db, "demo.myshopify.com", {
      id: 9002,
      currency: "USD",
      total_price: "10.00",
      line_items: [{ title: "Tea", quantity: 2, price: "5.00" }],
    });

    await new Promise((r) => setTimeout(r, 40));

    const processed = await processDueJobs(db, {
      "post-purchase": async () => {
        /* stub */
      },
    });
    expect(processed).toBe(1);
    expect(await countPending(db)).toBe(0);
  });

  it("rejects unknown shop", async () => {
    const db = await getBootstrappedDb();
    await expect(
      ingestOrderPaidEvent(db, "other.myshopify.com", {
        id: 1,
        currency: "USD",
        total_price: "1",
        line_items: [{ title: "x", quantity: 1 }],
      }),
    ).rejects.toThrow(/Unknown shop/);
  });
});
