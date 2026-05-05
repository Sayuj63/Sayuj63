import { type NextRequest, NextResponse } from "next/server";
import { getShopify } from "@/lib/shopify-server";

export async function GET(request: NextRequest) {
  const shop = request.nextUrl.searchParams.get("shop");
  if (!shop) {
    return NextResponse.json(
      { error: "Missing ?shop=your-store.myshopify.com" },
      { status: 400 },
    );
  }

  const shopify = getShopify();
  return shopify.auth.begin({
    shop,
    callbackPath: "/api/auth/callback",
    isOnline: false,
    rawRequest: request,
  });
}
