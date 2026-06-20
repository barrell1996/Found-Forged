"use client";

import { useMemo, useState } from "react";
import { Copy, Wand2 } from "lucide-react";
import { listingCopy } from "@/lib/calculations";
import { useInventory } from "@/components/inventory-provider";
import { PageHeading } from "@/components/page-heading";

const listingFields = [
  ["facebook_listing", "Facebook"],
  ["ebay_listing", "eBay"],
  ["poshmark_listing", "Poshmark"],
] as const;

export default function ListingGeneratorPage() {
  const { items, updateItem } = useInventory();
  const editable = items.filter((item) => item.status !== "sold");
  const [selectedId, setSelectedId] = useState(editable[0]?.id || "");
  const selected = useMemo(() => editable.find((item) => item.id === selectedId) || editable[0], [editable, selectedId]);

  async function generate() {
    if (!selected) return;
    await updateItem(selected.id, { ...listingCopy(selected), status: "listed" });
  }

  return (
    <div>
      <PageHeading title="Listing Generator" eyebrow="Marketplace copy">
        Turn item details into platform-ready descriptions.
      </PageHeading>

      <section className="panel space-y-3">
        <label>
          <span className="label">Item</span>
          <select className="field mt-1" value={selected?.id || ""} onChange={(e) => setSelectedId(e.target.value)}>
            {editable.map((item) => <option key={item.id} value={item.id}>{item.brand ? `${item.brand} ` : ""}{item.item_name}</option>)}
          </select>
        </label>
        <button className="btn-primary w-full" onClick={generate} disabled={!selected}>
          <Wand2 size={17} />
          Generate and mark listed
        </button>
      </section>

      {selected ? (
        <div className="mt-4 space-y-3">
          {listingFields.map(([key, label]) => (
            <section key={key} className="panel">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-black">{label}</h3>
                <button className="btn-secondary h-9 w-10 px-0" onClick={() => navigator.clipboard.writeText(selected[key] || "")} aria-label={`Copy ${label} listing`}>
                  <Copy size={15} />
                </button>
              </div>
              <textarea
                className="field min-h-44 resize-none text-sm leading-6"
                value={selected[key] || ""}
                onChange={(e) => updateItem(selected.id, { [key]: e.target.value })}
                placeholder={`Generate ${label} copy here.`}
              />
            </section>
          ))}
        </div>
      ) : (
        <div className="panel mt-4 text-center text-sm text-ink/60">Add an item before generating listings.</div>
      )}
    </div>
  );
}
