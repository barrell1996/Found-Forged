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

type DealSignal = "low" | "medium" | "high";

export type DealScoreInput = {
  purchasePrice: number;
  low: number;
  high: number;
  condition?: string;
  platform?: string;
  demand?: DealSignal;
  sellThrough?: DealSignal;
  competition?: DealSignal;
  prepCost?: number;
  shippingCost?: number;
  feeRate?: number;
  compCount?: number;
};

const conditionMultipliers: Record<string, number> = {
  New: 1.08,
  "Like New": 1,
  Good: 0.92,
  Fair: 0.78,
  Poor: 0.58,
};

const signalValues: Record<DealSignal, number> = {
  low: -1,
  medium: 0,
  high: 1,
};

export function scoreDeal(purchasePrice: number, low: number, high: number) {
  return scoreSmartDeal({ purchasePrice, low, high });
}

export function scoreSmartDeal(input: DealScoreInput) {
  const conditionMultiplier = conditionMultipliers[input.condition || "Good"] || conditionMultipliers.Good;
  const average = ((input.low + input.high) / 2) * conditionMultiplier;
  const resaleSpread = average ? (input.high - input.low) / average : 1;
  const prepCost = input.prepCost || 0;
  const shippingCost = input.shippingCost || 0;
  const feeRate = input.feeRate ?? 0.12;
  const fees = average * feeRate;
  const netResale = Math.max(0, average - fees - shippingCost);

  const demand = signalValues[input.demand || "medium"];
  const sellThrough = signalValues[input.sellThrough || "medium"];
  const competition = signalValues[input.competition || "medium"];
  const marketBoost = demand * 0.04 + sellThrough * 0.04 - competition * 0.03;
  const confidencePenalty = Math.min(0.12, resaleSpread * 0.08) + (input.compCount && input.compCount >= 3 ? 0 : 0.06);

  const buyRate = Math.max(0.34, Math.min(0.56, 0.46 + marketBoost - confidencePenalty));
  const maxBuy = Number(Math.max(0, netResale * buyRate - prepCost).toFixed(2));
  const allInCost = input.purchasePrice + prepCost;
  const expectedProfit = Number((netResale - allInCost).toFixed(2));
  const roi = allInCost > 0 ? expectedProfit / allInCost : 0;

  const score = Math.max(
    0,
    Math.min(100, Math.round(48 + roi * 18 + demand * 7 + sellThrough * 7 - competition * 5 - confidencePenalty * 55)),
  );

  const recommendation =
    input.purchasePrice <= maxBuy * 0.85 && score >= 75
      ? "Strong buy"
      : input.purchasePrice <= maxBuy && score >= 62
        ? "Buy if condition checks out"
        : input.purchasePrice <= maxBuy * 1.15 || score >= 48
          ? "Negotiate lower"
          : "Pass";

  const confidence =
    (input.compCount || 0) >= 4 && resaleSpread < 0.35
      ? "High"
      : (input.compCount || 0) >= 2 && resaleSpread < 0.55
        ? "Medium"
        : "Low";

  const reasons = [
    `Estimated net resale after fees/shipping: ${money(netResale)}`,
    `Expected profit at asking price: ${money(expectedProfit)}`,
    `Target max buy: ${money(maxBuy)}`,
  ];

  if ((input.compCount || 0) < 3) reasons.push("Add more comps to raise confidence");
  if (input.demand === "high") reasons.push("High demand supports a stronger buy");
  if (input.sellThrough === "low") reasons.push("Slow sell-through means cash may sit longer");
  if (input.competition === "high") reasons.push("High competition may force a lower price");
  if (conditionMultiplier < 0.9) reasons.push("Condition is pulling down the resale estimate");

  return {
    average: Number(average.toFixed(2)),
    confidence,
    expectedProfit,
    fees: Number(fees.toFixed(2)),
    maxBuy,
    netResale: Number(netResale.toFixed(2)),
    recommendation,
    reasons,
    roi: Number((roi * 100).toFixed(0)),
    score,
  };
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
