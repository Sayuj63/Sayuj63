import crypto from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import type { DrizzleDb } from "./create-db";
import { customers } from "./schema/customers";
import { orders } from "./schema/orders";
import { shops } from "./schema/shops";
import { enqueueJob } from "./job-queue";

const LineItemSchema = z.object({
  sku: z.string().nullable().optional(),
  title: z.string(),
  quantity: z.number(),
  price: z.string().optional(),
});

export const OrderWebhookSchema = z.object({
  id: z.number(),
  currency: z.string(),
  total_price: z.string(),
  discount_codes: z.array(z.object({ code: z.string() })).optional(),
  customer: z
    .object({
      id: z.number(),
      email: z.string().optional(),
    })
    .nullable()
    .optional(),
  line_items: z.array(LineItemSchema),
});

export type OrderWebhookPayload = z.infer<typeof OrderWebhookSchema>;

function postPurchaseDelayMs(): number {
  const v = process.env.RETAINIQ_POST_PURCHASE_DELAY_MS;
  if (v) return Number.parseInt(v, 10);
  return 2 * 60 * 60 * 1000;
}

function hashEmail(email: string): string {
  return crypto.createHash("sha256").update(email).digest("hex");
}

export async function ingestOrderPaidEvent(
  db: DrizzleDb,
  shopDomain: string,
  rawPayload: unknown,
): Promise<{ orderRowId: string; customerRowId: string }> {
  const payload = OrderWebhookSchema.parse(rawPayload);

  const [shop] = await db
    .select()
    .from(shops)
    .where(eq(shops.shopifyDomain, shopDomain))
    .limit(1);

  if (!shop) {
    throw new Error(
      `Unknown shop ${shopDomain}. Complete OAuth install first (/api/auth).`,
    );
  }

  const shopifyCustomerId = payload.customer?.id
    ? String(payload.customer.id)
    : "guest";

  const emailHash =
    payload.customer?.email != null
      ? hashEmail(payload.customer.email)
      : null;

  const [customerRow] = await db
    .insert(customers)
    .values({
      shopId: shop.id,
      shopifyCustomerId,
      emailHash,
      orderCount: 1,
      lastOrderAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [customers.shopId, customers.shopifyCustomerId],
      set: {
        orderCount: sql`${customers.orderCount} + 1`,
        lastOrderAt: new Date(),
        updatedAt: new Date(),
        ...(emailHash ? { emailHash } : {}),
      },
    })
    .returning();

  if (!customerRow) {
    throw new Error("Customer upsert failed");
  }

  const lineItems = payload.line_items.map((li) => ({
    skuId: li.sku ?? undefined,
    title: li.title,
    qty: li.quantity,
    price: li.price ?? "0",
  }));

  const [orderRow] = await db
    .insert(orders)
    .values({
      shopId: shop.id,
      shopifyOrderId: String(payload.id),
      customerId: customerRow.id,
      aov: payload.total_price,
      currency: payload.currency,
      discountApplied: Boolean(payload.discount_codes?.length),
      discountCode: payload.discount_codes?.[0]?.code,
      lineItems,
    })
    .onConflictDoUpdate({
      target: [orders.shopId, orders.shopifyOrderId],
      set: {
        aov: payload.total_price,
        lineItems,
        currency: payload.currency,
      },
    })
    .returning();

  if (!orderRow) {
    throw new Error("Order upsert failed");
  }

  await enqueueJob(
    db,
    "post-purchase",
    {
      shopId: shop.id,
      orderId: orderRow.id,
      shopifyOrderId: String(payload.id),
    },
    new Date(Date.now() + postPurchaseDelayMs()),
  );

  return {
    orderRowId: orderRow.id,
    customerRowId: customerRow.id,
  };
}
