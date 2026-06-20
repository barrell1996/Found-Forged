"use client";

import { CheckCircle2, Trash2 } from "lucide-react";
import { money } from "@/lib/calculations";
import type { Item } from "@/lib/types";

export function ItemCard({
  item,
  onSold,
  onDelete,
}: {
  item: Item;
  onSold?: (item: Item) => void;
  onDelete?: (id: string) => void;
}) {
  const profitPreview = item.target_sale_price - item.purchase_price;

  return (
    <article className="panel space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold">{item.item_name}</h3>
          <p className="text-sm text-ink/60">{item.brand || "Unbranded"} · {item.condition}</p>
        </div>
        <span className="rounded-md bg-brass/20 px-2 py-1 text-xs font-bold uppercase text-ink">{item.status}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <p className="label">Cost</p>
          <p className="font-bold">{money(item.purchase_price)}</p>
        </div>
        <div>
          <p className="label">Target</p>
          <p className="font-bold">{money(item.target_sale_price)}</p>
        </div>
        <div>
          <p className="label">Spread</p>
          <p className="font-bold">{money(profitPreview)}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 text-xs text-ink/60">
        <span>{item.platform}</span>
        <span>{item.sku || "No SKU"} · {item.storage_location || "No location"}</span>
      </div>
      {(onSold || onDelete) && (
        <div className="flex gap-2">
          {onSold && item.status !== "sold" && (
            <button className="btn-secondary flex-1" onClick={() => onSold(item)}>
              <CheckCircle2 size={16} />
              Sold
            </button>
          )}
          {onDelete && (
            <button className="btn-secondary w-12 px-0 text-clay" onClick={() => onDelete(item.id)} aria-label={`Delete ${item.item_name}`}>
              <Trash2 size={16} />
            </button>
          )}
        </div>
      )}
    </article>
  );
}
