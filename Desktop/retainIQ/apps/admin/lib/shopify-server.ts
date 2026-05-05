import "@shopify/shopify-api/adapters/web-api";
import { ApiVersion, shopifyApi, type Shopify } from "@shopify/shopify-api";

function parseAppUrl() {
  const raw = process.env.SHOPIFY_APP_URL ?? "http://localhost:3000";
  return new URL(raw);
}

let instance: Shopify | undefined;

export function getShopify(): Shopify {
  if (!instance) {
    const u = parseAppUrl();
    instance = shopifyApi({
      apiKey: process.env.SHOPIFY_API_KEY ?? "dev-missing-key",
      apiSecretKey: process.env.SHOPIFY_API_SECRET ?? "dev-missing-secret",
      scopes: (process.env.SCOPES ?? "read_orders,write_orders")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      hostName: u.host,
      hostScheme: u.protocol === "https:" ? "https" : "http",
      apiVersion: ApiVersion.October24,
      isEmbeddedApp: true,
    });
  }
  return instance;
}
