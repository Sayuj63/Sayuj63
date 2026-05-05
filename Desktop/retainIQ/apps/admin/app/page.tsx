const tiles = [
  {
    title: "Retention overview",
    detail: "Repeat rate, LTV, cohorts — wiring to ClickHouse next.",
  },
  {
    title: "Flows",
    detail: "Journey builder + WhatsApp / email dispatch via orchestration service.",
  },
  {
    title: "Ingestion",
    detail: "Shopify webhooks → scoring → journeys. Dev bus logs to stdout.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-brand-light/40 bg-white/80 backdrop-blur dark:bg-[#1a1829]/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-sm font-semibold text-white">
              R
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">RetainIQ Pro</p>
              <p className="text-xs text-foreground/60">Merchant console</p>
            </div>
          </div>
          <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand dark:bg-brand/30 dark:text-brand-light">
            Phase 1 scaffold
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <section className="mb-12 max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Turn post-purchase into compounding LTV
          </h1>
          <p className="mt-3 text-base leading-relaxed text-foreground/70">
            This app shell is ready for Shopify OAuth, embedded admin, and tRPC to
            your API gateway.             Run{" "}
            <code className="rounded bg-brand-light/80 px-1.5 py-0.5 text-sm text-brand dark:bg-brand/40">
              pnpm dev
            </code>{" "}
            — webhooks live at{" "}
            <code className="rounded bg-brand-light/80 px-1.5 py-0.5 text-sm text-brand dark:bg-brand/40">
              /api/webhooks
            </code>{" "}
            (PGlite DB, no Docker). OAuth:{" "}
            <code className="rounded bg-brand-light/80 px-1.5 py-0.5 text-sm text-brand dark:bg-brand/40">
              /api/auth?shop=…
            </code>
            .
          </p>
        </section>

        <ul className="grid gap-4 sm:grid-cols-3">
          {tiles.map((tile) => (
            <li
              key={tile.title}
              className="rounded-2xl border border-brand-muted/60 bg-white p-5 shadow-sm dark:border-brand-muted/30 dark:bg-[#1e1c2e]"
            >
              <h2 className="font-semibold text-foreground">{tile.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                {tile.detail}
              </p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
