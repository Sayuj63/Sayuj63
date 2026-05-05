import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { shops } from "./shops";

export const customers = pgTable(
  "customers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    shopId: uuid("shop_id")
      .notNull()
      .references(() => shops.id, { onDelete: "cascade" }),
    shopifyCustomerId: text("shopify_customer_id").notNull(),
    emailEncrypted: text("email_encrypted"),
    emailHash: text("email_hash"),
    phoneE164Encrypted: text("phone_e164_encrypted"),
    churnScore: numeric("churn_score", { precision: 5, scale: 2 }),
    churnScoreUpdatedAt: timestamp("churn_score_updated_at", {
      withTimezone: true,
    }),
    churnScoreFeatures: jsonb("churn_score_features").$type<
      Record<string, unknown>
    >(),
    predictedReorder: jsonb("predicted_reorder").$type<
      Record<string, string>
    >(),
    segment: text("segment"),
    ltv: numeric("ltv", { precision: 12, scale: 2 }).default("0"),
    orderCount: integer("order_count").default(0),
    lastOrderAt: timestamp("last_order_at", { withTimezone: true }),
    optInWhatsapp: boolean("opt_in_whatsapp").default(false),
    optInSms: boolean("opt_in_sms").default(false),
    optInEmail: boolean("opt_in_email").default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    shopShopifyCustomerUnique: uniqueIndex("customers_shop_shopify_customer").on(
      t.shopId,
      t.shopifyCustomerId,
    ),
  }),
);
