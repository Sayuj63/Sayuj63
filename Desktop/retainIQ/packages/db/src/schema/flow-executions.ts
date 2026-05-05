import {
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { customers } from "./customers";
import { flows } from "./flows";
import { orders } from "./orders";
import { shops } from "./shops";

export const flowExecutions = pgTable("flow_executions", {
  id: uuid("id").primaryKey().defaultRandom(),
  shopId: uuid("shop_id")
    .notNull()
    .references(() => shops.id),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id),
  orderId: uuid("order_id").references(() => orders.id),
  flowId: uuid("flow_id")
    .notNull()
    .references(() => flows.id),
  stepId: text("step_id").notNull(),
  channel: text("channel").notNull(),
  status: text("status").notNull().default("pending"),
  providerMessageId: text("provider_message_id"),
  templateName: text("template_name"),
  renderedContent: text("rendered_content"),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  openedAt: timestamp("opened_at", { withTimezone: true }),
  clickedAt: timestamp("clicked_at", { withTimezone: true }),
  convertedAt: timestamp("converted_at", { withTimezone: true }),
  revenueAttributed: numeric("revenue_attributed", {
    precision: 12,
    scale: 2,
  }),
  errorCode: text("error_code"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
