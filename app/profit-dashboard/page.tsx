"use client";

import { money } from "@/lib/calculations";
import { useInventory } from "@/components/inventory-provider";
import { PageHeading } from "@/components/page-heading";

export default function ProfitDashboardPage() {
  const { items } = useInventory();
  const sold = items.filter((item) => item.status === "sold");
  const revenue = sold.reduce((sum, item) => sum + (item.sold_price || 0), 0);
  const costs = sold.reduce((sum, item) => sum + item.purchase_price, 0);
  const shipping = sold.reduce((sum, item) => sum + (item.shipping_cost || 0), 0);
  const fees = sold.reduce((sum, item) => sum + (item.fees || 0), 0);
  const profit = sold.reduce((sum, item) => sum + (item.net_profit || 0), 0);
  const averageProfit = sold.length ? profit / sold.length : 0;
  const activeValue = items.filter((item) => item.status !== "sold").reduce((sum, item) => sum + item.target_sale_price, 0);

  return (
    <div>
      <PageHeading title="Profit Dashboard" eyebrow="Numbers that matter">
        See realized margin and the value still sitting in inventory.
      </PageHeading>

      <section className="panel mb-4">
        <p className="label">Net profit</p>
        <p className={`mt-1 text-5xl font-black ${profit >= 0 ? "text-moss" : "text-clay"}`}>{money(profit)}</p>
        <p className="mt-1 text-sm text-ink/60">Average profit per sold item: {money(averageProfit)}</p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Metric label="Revenue" value={money(revenue)} />
        <Metric label="Item cost" value={money(costs)} />
        <Metric label="Shipping" value={money(shipping)} />
        <Metric label="Fees" value={money(fees)} />
      </section>

      <section className="panel mt-4">
        <p className="label">Active target value</p>
        <p className="mt-1 text-3xl font-black">{money(activeValue)}</p>
      </section>

      <section className="mt-4 space-y-2">
        {sold.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-md border border-ink/10 bg-white px-3 py-3 text-sm">
            <div className="min-w-0">
              <p className="truncate font-bold">{item.item_name}</p>
              <p className="text-xs text-ink/60">Sold {money(item.sold_price)} · Cost {money(item.purchase_price)}</p>
            </div>
            <p className="font-black">{money(item.net_profit)}</p>
          </div>
        ))}
      </section>
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
