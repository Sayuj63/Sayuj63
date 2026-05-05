/**
 * Placeholder for Kafka / MSK — logs structured events in development.
 */
export type OrderPaidEvent = {
  topic: "orders.paid";
  shopDomain: string;
  shopifyOrderId: string;
  payload: unknown;
  receivedAt: string;
};

export function publishOrderPaid(event: OrderPaidEvent): void {
  process.stdout.write(`${JSON.stringify({ bus: "stub", ...event })}\n`);
}
