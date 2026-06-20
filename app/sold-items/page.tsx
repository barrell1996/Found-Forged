"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { money } from "@/lib/calculations";
import { useInventory } from "@/components/inventory-provider";
import { PageHeading } from "@/components/page-heading";
import type { Item } from "@/lib/types";

export default function SoldItemsPage() {
  const { items, updateItem } = useInventory();
  const sold = items.filter((item) => item.status === "sold");

  return (
    <div>
      <PageHeading title="Sold Items" eyebrow="Close the loop">
        Enter final sale numbers to keep profit honest.
      </PageHeading>
      <div className="space-y-3">
        {sold.map((item) => <SoldCard key={item.id} item={item} onSave={(patch) => updateItem(item.id, patch)} />)}
        {sold.length === 0 && <div className="panel text-center text-sm text-ink/60">No sold items yet.</div>}
      </div>
    </div>
  );
}

function SoldCard({ item, onSave }: { item: Item; onSave: (patch: Partial<Item>) => Promise<void> }) {
  const [soldPrice, setSoldPrice] = useState(item.sold_price || item.target_sale_price);
  const [shipping, setShipping] = useState(item.shipping_cost || 0);
  const [fees, setFees] = useState(item.fees || 0);
  const profit = soldPrice - item.purchase_price - shipping - fees;

  return (
    <article className="panel space-y-3">
      <div className="flex justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-bold">{item.item_name}</h3>
          <p className="text-sm text-ink/60">{item.sku || item.platform}</p>
        </div>
        <p className={`font-black ${profit >= 0 ? "text-moss" : "text-clay"}`}>{money(profit)}</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <NumberField label="Sold" value={soldPrice} onChange={setSoldPrice} />
        <NumberField label="Ship" value={shipping} onChange={setShipping} />
        <NumberField label="Fees" value={fees} onChange={setFees} />
      </div>
      <button className="btn-secondary w-full" onClick={() => onSave({ sold_price: soldPrice, shipping_cost: shipping, fees, net_profit: profit })}>
        <Save size={16} />
        Save sale
      </button>
    </article>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label>
      <span className="label">{label}</span>
      <input type="number" min="0" step="0.01" className="field mt-1 px-2" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}
