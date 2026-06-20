"use client";

import Link from "next/link";
import { ArrowRight, Database } from "lucide-react";
import { money } from "@/lib/calculations";
import { useInventory } from "@/components/inventory-provider";
import { PageHeading } from "@/components/page-heading";

export default function Dashboard() {
  const { items, dataSource, error } = useInventory();
  const active = items.filter((item) => item.status !== "sold");
  const listed = items.filter((item) => item.status === "listed");
  const sold = items.filter((item) => item.status === "sold");
  const inventoryCost = active.reduce((sum, item) => sum + item.purchase_price, 0);
  const targetValue = active.reduce((sum, item) => sum + item.target_sale_price, 0);
  const netProfit = sold.reduce((sum, item) => sum + (item.net_profit || 0), 0);

  return (
    <div>
      <PageHeading title="Today’s resale bench" eyebrow="Dashboard">
        Track sourcing, listing, storage, and profit from one shared console.
      </PageHeading>

      <div className="mb-4 flex items-center gap-2 rounded-md border border-moss/20 bg-moss/10 px-3 py-2 text-xs font-semibold text-moss">
        <Database size={15} />
        Saving to {dataSource === "supabase" ? "Supabase" : "this browser until Supabase keys are added"}.
      </div>
      {error && (
        <div className="mb-4 rounded-md border border-clay/25 bg-clay/10 px-3 py-2 text-xs font-semibold text-clay">
          Supabase is configured, but the app could not reach the items table: {error}
        </div>
      )}

      <section className="grid grid-cols-2 gap-3">
        <Metric label="Active items" value={active.length.toString()} />
        <Metric label="Listed" value={listed.length.toString()} />
        <Metric label="Inventory cost" value={money(inventoryCost)} />
        <Metric label="Target value" value={money(targetValue)} />
      </section>

      <section className="panel mt-4">
        <p className="label">Realized profit</p>
        <p className="mt-1 text-4xl font-black">{money(netProfit)}</p>
        <p className="mt-1 text-sm text-ink/60">{sold.length} sold item{sold.length === 1 ? "" : "s"} recorded.</p>
      </section>

      <div className="mt-4 grid gap-3">
        <QuickLink href="/add-item" label="Add a sourced item" />
        <QuickLink href="/deal-finder" label="Score a possible buy" />
        <QuickLink href="/listing-generator" label="Generate marketplace copy" />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel">
      <p className="label">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="flex items-center justify-between rounded-lg border border-ink/10 bg-white px-4 py-4 text-sm font-bold shadow-soft">
      {label}
      <ArrowRight size={17} />
    </Link>
  );
}
