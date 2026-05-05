import { type NextRequest, NextResponse } from "next/server";
import { getShopify } from "@/lib/shopify-server";
import { getBootstrappedDb } from "@retainiq/db";
import { upsertShopFromSession } from "@/lib/upsert-shop-from-session";

function mergeAdapterHeaders(
  response: NextResponse,
  raw: unknown,
): NextResponse {
  if (!raw || typeof raw !== "object") return response;
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof value === "string") {
      response.headers.set(key, value);
    } else if (Array.isArray(value)) {
      response.headers.set(key, value.join(", "));
    }
  }
  return response;
}

export async function GET(request: NextRequest) {
  const shopify = getShopify();

  const { session, headers } = await shopify.auth.callback({
    rawRequest: request,
  });

  const db = await getBootstrappedDb();
  await upsertShopFromSession(db, session);

  const url = new URL(request.url);
  const host = url.searchParams.get("host");
  const target = host
    ? shopify.auth.buildEmbeddedAppUrl(host)
    : new URL("/", url.origin).toString();

  const res = NextResponse.redirect(target);
  return mergeAdapterHeaders(res, headers);
}
