"use client";

import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { money, scoreDeal } from "@/lib/calculations";
import { useInventory } from "@/components/inventory-provider";
import { PageHeading } from "@/components/page-heading";

export default function DealFinderPage() {
  const { addItem } = useInventory();
  const [itemName, setItemName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("Apparel");
  const [purchase, setPurchase] = useState(25);
  const [low, setLow] = useState(70);
  const [high, setHigh] = useState(110);
  const result = scoreDeal(purchase, low, high);

  async function addDraft() {
    await addItem({
      item_name: itemName || "Untitled deal",
      brand,
      category,
      purchase_price: purchase,
      target_sale_price: high,
      estimated_resale_low: low,
      estimated_resale_high: high,
      max_buy_price: result.maxBuy,
      deal_score: result.score,
      deal_recommendation: result.recommendation,
      notes: `Deal Finder result: ${result.recommendation}`,
    });
    setItemName("");
    setBrand("");
  }

  return (
    <div>
      <PageHeading title="Deal Finder" eyebrow="Source smarter">
        Compare asking price to likely resale value before you buy.
      </PageHeading>

      <section className="panel space-y-3">
        <div>
          <label className="label" htmlFor="deal_item">Item</label>
          <input id="deal_item" className="field mt-1" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Selvedge denim jacket" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label>
            <span className="label">Brand</span>
            <input className="field mt-1" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Brand" />
          </label>
          <label>
            <span className="label">Category</span>
            <select className="field mt-1" value={category} onChange={(e) => setCategory(e.target.value)}>
              {["Apparel", "Shoes", "Home", "Electronics", "Accessories", "Collectibles", "Other"].map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <NumberField label="Ask" value={purchase} onChange={setPurchase} />
          <NumberField label="Low" value={low} onChange={setLow} />
          <NumberField label="High" value={high} onChange={setHigh} />
        </div>
      </section>

      <section className="panel mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="label">Deal score</p>
            <p className="text-5xl font-black">{result.score}</p>
          </div>
          <div className="rounded-lg bg-moss px-3 py-2 text-right text-white">
            <p className="text-xs font-semibold uppercase">Max buy</p>
            <p className="text-xl font-black">{money(result.maxBuy)}</p>
          </div>
        </div>
        <div className="rounded-md bg-brass/20 p-3">
          <p className="flex items-center gap-2 text-sm font-black"><Sparkles size={16} /> {result.recommendation}</p>
          <p className="mt-1 text-sm text-ink/70">Expected resale range: {money(low)} to {money(high)}.</p>
        </div>
        <button className="btn-primary w-full" onClick={addDraft}>
          <Plus size={17} />
          Add as draft item
        </button>
      </section>
    </div>
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
