import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const shops = pgTable("shops", {
  id: uuid("id").primaryKey().defaultRandom(),
  shopifyDomain: text("shopify_domain").notNull().unique(),
  accessToken: text("access_token").notNull(),
  planTier: text("plan_tier").notNull().default("starter"),
  wabaId: text("waba_id"),
  wabaPhone: text("waba_phone"),
  sendgridKey: text("sendgrid_key"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }),
  isActive: boolean("is_active").notNull().default(true),
  settings: jsonb("settings")
    .$type<Record<string, unknown>>()
    .notNull()
    .default({}),
});
