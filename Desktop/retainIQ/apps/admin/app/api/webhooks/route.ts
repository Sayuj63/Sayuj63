import { type NextRequest, NextResponse } from "next/server";
import { getBootstrappedDb, ingestOrderPaidEvent } from "@retainiq/db";
import { verifyShopifyWebhook } from "@/lib/verify-shopify-webhook";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  const secret =
    process.env.SHOPIFY_WEBHOOK_SECRET ?? process.env.SHOPIFY_API_SECRET;
  if (secret) {
    const hmac = request.headers.get("x-shopify-hmac-sha256");
    if (!verifyShopifyWebhook(rawBody, hmac ?? undefined, secret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const topic = request.headers.get("x-shopify-topic");
  const shopDomain = request.headers.get("x-shopify-shop-domain");
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (topic === "orders/paid" || topic === "orders/create") {
    try {
      const db = await getBootstrappedDb();
      if (!shopDomain) {
        return NextResponse.json(
          { error: "Missing shop domain header" },
          { status: 400 },
        );
      }
      await ingestOrderPaidEvent(db, shopDomain, parsed);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  return NextResponse.json({ received: true });
}
