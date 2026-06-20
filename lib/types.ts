export type ItemStatus = "draft" | "listed" | "sold";

export type Item = {
  id: string;
  created_at: string;
  item_name: string;
  brand: string;
  category: string;
  condition: string;
  purchase_price: number;
  target_sale_price: number;
  platform: string;
  status: ItemStatus;
  sku: string;
  storage_location: string;
  notes: string;
  estimated_resale_low: number | null;
  estimated_resale_high: number | null;
  max_buy_price: number | null;
  deal_score: number | null;
  deal_recommendation: string;
  facebook_listing: string;
  ebay_listing: string;
  poshmark_listing: string;
  sold_price: number | null;
  shipping_cost: number | null;
  fees: number | null;
  net_profit: number | null;
};

export type ItemInput = Omit<Item, "id" | "created_at">;
