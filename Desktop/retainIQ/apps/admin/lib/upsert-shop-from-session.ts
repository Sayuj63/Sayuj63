import type { Session } from "@shopify/shopify-api";
import type { DrizzleDb } from "@retainiq/db";
import { shops } from "@retainiq/db/schema";

export async function upsertShopFromSession(
  db: DrizzleDb,
  session: Session,
): Promise<void> {
  if (!session.accessToken) {
    throw new Error("OAuth session missing access token");
  }

  await db
    .insert(shops)
    .values({
      shopifyDomain: session.shop,
      accessToken: session.accessToken,
      planTier: "starter",
      isActive: true,
    })
    .onConflictDoUpdate({
      target: [shops.shopifyDomain],
      set: {
        accessToken: session.accessToken,
        isActive: true,
      },
    });
}
