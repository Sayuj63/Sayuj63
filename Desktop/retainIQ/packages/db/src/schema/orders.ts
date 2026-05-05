import {
  boolean,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { customers } from "./customers";
import { shops } from "./shops";

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    shopId: uuid("shop_id")
      .notNull()
      .references(() => shops.id, { onDelete: "cascade" }),
    shopifyOrderId: text("shopify_order_id").notNull(),
    customerId: uuid("customer_id").references(() => customers.id),
    aov: numeric("aov", { precision: 12, scale: 2 }),
    currency: text("currency"),
    discountApplied: boolean("discount_applied").default(false),
    discountCode: text("discount_code"),
    lineItems: jsonb("line_items")
      .$type<
        Array<{
          skuId?: string;
          title: string;
          qty: number;
          price: string;
        }>
      >()
      .notNull(),
    shippingAddress: jsonb("shipping_address").$type<{
      country?: string;
      city?: string;
    }>(),
    fulfillmentStatus: text("fulfillment_status"),
    trackingNumber: text("tracking_number"),
    carrier: text("carrier"),
    estimatedDelivery: timestamp("estimated_delivery", { withTimezone: true }),
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    shopOrderUnique: uniqueIndex("orders_shop_shopify_order").on(
      t.shopId,
      t.shopifyOrderId,
    ),
  }),
);
