import type { Item, ItemInput } from "@/lib/types";

export const emptyItemInput: ItemInput = {
  item_name: "",
  brand: "",
  category: "Apparel",
  condition: "Good",
  purchase_price: 0,
  target_sale_price: 0,
  platform: "Facebook Marketplace",
  status: "draft",
  sku: "",
  storage_location: "",
  notes: "",
  estimated_resale_low: null,
  estimated_resale_high: null,
  max_buy_price: null,
  deal_score: null,
  deal_recommendation: "",
  facebook_listing: "",
  ebay_listing: "",
  poshmark_listing: "",
  sold_price: null,
  shipping_cost: null,
  fees: null,
  net_profit: null,
};

export function money(value: number | null | undefined) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function calcProfit(item: Pick<Item, "sold_price" | "purchase_price" | "shipping_cost" | "fees">) {
  if (!item.sold_price) return null;
  return Number((item.sold_price - item.purchase_price - (item.shipping_cost || 0) - (item.fees || 0)).toFixed(2));
}

export function scoreDeal(purchasePrice: number, low: number, high: number) {
  const average = (low + high) / 2;
  const maxBuy = Number((average * 0.48).toFixed(2));
  const margin = average ? (average - purchasePrice) / average : 0;
  const score = Math.max(0, Math.min(100, Math.round(margin * 115)));
  const recommendation =
    purchasePrice <= maxBuy * 0.85
      ? "Strong buy"
      : purchasePrice <= maxBuy
        ? "Buy if condition checks out"
        : purchasePrice <= maxBuy * 1.15
          ? "Negotiate lower"
          : "Pass";

  return { maxBuy, score, recommendation };
}

export function compRange(comps: number[]) {
  const valid = comps.filter((value) => Number.isFinite(value) && value > 0).sort((a, b) => a - b);
  if (!valid.length) return null;

  const average = valid.reduce((sum, value) => sum + value, 0) / valid.length;
  const low = valid.length >= 3 ? valid[1] : valid[0];
  const high = valid.length >= 3 ? valid[valid.length - 2] : valid[valid.length - 1];

  return {
    count: valid.length,
    average: Number(average.toFixed(2)),
    low: Number(low.toFixed(2)),
    high: Number(high.toFixed(2)),
  };
}

export function generateSku(itemName: string, brand: string) {
  const base = `${brand || "FF"} ${itemName || "ITEM"}`
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "")
    .slice(0, 6);
  return `${base || "FFITEM"}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function listingCopy(item: Item) {
  const title = [item.brand, item.item_name].filter(Boolean).join(" ");
  const base = `${title}\n\nCondition: ${item.condition || "See photos"}\nCategory: ${item.category || "Resale find"}\n\n${item.notes || "Clean, ready to use, and priced for a quick sale."}`;
  return {
    facebook_listing: `${title} - ${money(item.target_sale_price)}\n\n${base}\n\nLocal pickup or buyer-paid shipping. Message with questions.`,
    ebay_listing: `${title}\n\n${base}\n\nShips carefully packed. Please review photos for exact condition.`,
    poshmark_listing: `${title}\n\n${base}\n\nOpen to reasonable offers. Bundle-friendly closet find.`,
  };
}
