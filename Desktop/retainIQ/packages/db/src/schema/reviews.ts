import {
  boolean,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { customers } from "./customers";
import { orders } from "./orders";
import { shops } from "./shops";

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  shopId: uuid("shop_id")
    .notNull()
    .references(() => shops.id),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id),
  orderId: uuid("order_id").references(() => orders.id),
  skuId: text("sku_id"),
  rating: smallint("rating").notNull(),
  bodyText: text("body_text"),
  sentiment: text("sentiment"),
  topics: text("topics").array(),
  hasUgc: boolean("has_ugc").default(false),
  ugcUrls: text("ugc_urls").array(),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  publishedTo: text("published_to").array(),
  routedTo: text("routed_to"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
