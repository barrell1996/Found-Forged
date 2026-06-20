"use client";

import { useState } from "react";
import { Save, Wand2 } from "lucide-react";
import { emptyItemInput, generateSku } from "@/lib/calculations";
import type { ItemInput } from "@/lib/types";

const categories = ["Apparel", "Shoes", "Home", "Electronics", "Accessories", "Collectibles", "Other"];
const conditions = ["New", "Excellent", "Very good", "Good", "Fair", "Needs repair"];
const platforms = ["Facebook Marketplace", "eBay", "Poshmark", "Mercari", "Depop", "Local"];

export function ItemForm({
  initialValue,
  onSubmit,
  submitLabel = "Save item",
}: {
  initialValue?: Partial<ItemInput>;
  onSubmit: (input: ItemInput) => Promise<void>;
  submitLabel?: string;
}) {
  const [form, setForm] = useState<ItemInput>({ ...emptyItemInput, ...initialValue });
  const [saving, setSaving] = useState(false);

  function setField<K extends keyof ItemInput>(key: K, value: ItemInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    await onSubmit({
      ...form,
      purchase_price: Number(form.purchase_price || 0),
      target_sale_price: Number(form.target_sale_price || 0),
    });
    setSaving(false);
    setForm({ ...emptyItemInput, category: form.category, platform: form.platform });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="panel space-y-3">
        <div>
          <label className="label" htmlFor="item_name">Item name</label>
          <input id="item_name" required className="field mt-1" value={form.item_name} onChange={(e) => setField("item_name", e.target.value)} placeholder="Vintage denim jacket" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="brand">Brand</label>
            <input id="brand" className="field mt-1" value={form.brand} onChange={(e) => setField("brand", e.target.value)} placeholder="Levi's" />
          </div>
          <div>
            <label className="label" htmlFor="sku">SKU</label>
            <div className="mt-1 flex gap-2">
              <input id="sku" className="field min-w-0" value={form.sku} onChange={(e) => setField("sku", e.target.value)} placeholder="Auto" />
              <button type="button" className="btn-secondary w-11 px-0" onClick={() => setField("sku", generateSku(form.item_name, form.brand))} aria-label="Generate SKU">
                <Wand2 size={17} />
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="category">Category</label>
            <select id="category" className="field mt-1" value={form.category} onChange={(e) => setField("category", e.target.value)}>
              {categories.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="condition">Condition</label>
            <select id="condition" className="field mt-1" value={form.condition} onChange={(e) => setField("condition", e.target.value)}>
              {conditions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="panel space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="purchase_price">Cost</label>
            <input id="purchase_price" type="number" min="0" step="0.01" className="field mt-1" value={form.purchase_price} onChange={(e) => setField("purchase_price", Number(e.target.value))} />
          </div>
          <div>
            <label className="label" htmlFor="target_sale_price">Target sale</label>
            <input id="target_sale_price" type="number" min="0" step="0.01" className="field mt-1" value={form.target_sale_price} onChange={(e) => setField("target_sale_price", Number(e.target.value))} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="platform">Platform</label>
            <select id="platform" className="field mt-1" value={form.platform} onChange={(e) => setField("platform", e.target.value)}>
              {platforms.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="storage_location">Storage</label>
            <input id="storage_location" className="field mt-1" value={form.storage_location} onChange={(e) => setField("storage_location", e.target.value)} placeholder="Bin 2" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="notes">Notes</label>
          <textarea id="notes" className="field mt-1 min-h-24 resize-none" value={form.notes} onChange={(e) => setField("notes", e.target.value)} placeholder="Flaws, measurements, sourcing notes" />
        </div>
      </div>

      <button className="btn-primary w-full" disabled={saving}>
        <Save size={17} />
        {saving ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
