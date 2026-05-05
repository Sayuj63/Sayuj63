import Fastify from "fastify";
import type { FastifyRequest } from "fastify";
import { config } from "./config.js";
import { verifyShopifyWebhook } from "./shopify-hmac.js";
import { publishOrderPaid } from "./event-bus.js";

type RequestWithRaw = FastifyRequest & { rawBody?: string };

const fastify = Fastify({ logger: true });

fastify.addContentTypeParser(
  "application/json",
  { parseAs: "string" },
  function (request, body, done) {
    const raw = typeof body === "string" ? body : String(body);
    (request as RequestWithRaw).rawBody = raw;
    try {
      const json: unknown = JSON.parse(raw);
      done(null, json);
    } catch (err) {
      done(err as Error, undefined);
    }
  },
);

fastify.get("/health", async () => ({
  ok: true,
  service: "ingestion-svc",
  ts: new Date().toISOString(),
}));

fastify.post("/webhooks/shopify", async (request, reply) => {
  const rawBody = (request as RequestWithRaw).rawBody;
  if (!rawBody) {
    return reply.code(400).send({ error: "Expected raw body" });
  }

  const secret = config.SHOPIFY_WEBHOOK_SECRET;
  if (secret) {
    const hmac = request.headers["x-shopify-hmac-sha256"];
    const hmacStr = Array.isArray(hmac) ? hmac[0] : hmac;
    if (!verifyShopifyWebhook(rawBody, hmacStr, secret)) {
      fastify.log.warn("Invalid Shopify HMAC");
      return reply.code(401).send({ error: "Unauthorized" });
    }
  } else {
    fastify.log.warn("SHOPIFY_WEBHOOK_SECRET unset — skipping HMAC verification");
  }

  const topic = request.headers["x-shopify-topic"];
  const shopDomain = request.headers["x-shopify-shop-domain"];
  const topicStr = Array.isArray(topic) ? topic[0] : topic;
  const shopStr = Array.isArray(shopDomain) ? shopDomain[0] : shopDomain;

  const parsed = request.body;

  if (topicStr === "orders/paid" || topicStr === "orders/create") {
    const order = parsed as { id?: number };
    publishOrderPaid({
      topic: "orders.paid",
      shopDomain: shopStr ?? "unknown",
      shopifyOrderId: order.id != null ? String(order.id) : "unknown",
      payload: parsed,
      receivedAt: new Date().toISOString(),
    });
  }

  return reply.code(200).send({ received: true });
});

async function main() {
  await fastify.listen({ port: config.PORT, host: "0.0.0.0" });
  fastify.log.info(`ingestion-svc listening on :${config.PORT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
