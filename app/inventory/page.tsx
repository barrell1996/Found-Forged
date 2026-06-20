"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { money } from "@/lib/calculations";
import { useInventory } from "@/components/inventory-provider";
import { PageHeading } from "@/components/page-heading";

export default function InventoryPage() {
  const { items, updateItem, deleteItem } = useInventory();
  const [query, setQuery] = useState("");
  const active = items
    .filter((item) => item.status !== "sold")
    .filter((item) => `${item.item_name} ${item.brand} ${item.sku} ${item.storage_location}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <PageHeading title="Inventory" eyebrow="Active stock">
        Review what is waiting to list, ship, photograph, or store.
      </PageHeading>
      <label className="mb-4 flex items-center gap-2 rounded-md border border-ink/15 bg-white px-3 py-2">
        <Search size={17} className="text-ink/40" />
        <input className="min-w-0 flex-1 bg-transparent text-[16px] outline-none" placeholder="Search item, SKU, location" value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <div className="overflow-x-auto rounded-lg border border-ink/10 bg-white shadow-soft">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-ink text-xs uppercase tracking-wide text-white">
            <tr>
              <th className="px-3 py-3">Item</th>
              <th className="px-3 py-3">SKU</th>
              <th className="px-3 py-3">Cost</th>
              <th className="px-3 py-3">Target</th>
              <th className="px-3 py-3">Platform</th>
              <th className="px-3 py-3">Storage</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {active.map((item) => (
              <tr key={item.id} className="border-t border-ink/10">
                <td className="px-3 py-3">
                  <p className="font-bold">{item.item_name}</p>
                  <p className="text-xs text-ink/60">{item.brand || "Unbranded"} · {item.condition}</p>
                </td>
                <td className="px-3 py-3">{item.sku || "—"}</td>
                <td className="px-3 py-3 font-semibold">{money(item.purchase_price)}</td>
                <td className="px-3 py-3 font-semibold">{money(item.target_sale_price)}</td>
                <td className="px-3 py-3">{item.platform}</td>
                <td className="px-3 py-3">{item.storage_location || "—"}</td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <button className="btn-secondary h-9 px-3" onClick={() => updateItem(item.id, { status: "sold", sold_price: item.target_sale_price })}>Sold</button>
                    <button className="btn-secondary h-9 px-3 text-clay" onClick={() => deleteItem(item.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {active.length === 0 && <Empty text="No active inventory matches this search." />}
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="panel text-center text-sm text-ink/60">{text}</div>;
}
