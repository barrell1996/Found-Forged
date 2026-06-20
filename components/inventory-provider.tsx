"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { calcProfit, emptyItemInput } from "@/lib/calculations";
import { seedItems } from "@/lib/seed";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";
import type { Item, ItemInput } from "@/lib/types";

type InventoryContextValue = {
  items: Item[];
  loading: boolean;
  error: string;
  dataSource: "supabase" | "browser";
  addItem: (input: Partial<ItemInput>) => Promise<Item>;
  updateItem: (id: string, patch: Partial<ItemInput>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
};

const InventoryContext = createContext<InventoryContextValue | null>(null);
const storageKey = "found-forged-items";

function normalize(input: Partial<ItemInput>) {
  return {
    ...emptyItemInput,
    ...input,
    purchase_price: Number(input.purchase_price || 0),
    target_sale_price: Number(input.target_sale_price || 0),
    estimated_resale_low: input.estimated_resale_low == null ? null : Number(input.estimated_resale_low),
    estimated_resale_high: input.estimated_resale_high == null ? null : Number(input.estimated_resale_high),
    max_buy_price: input.max_buy_price == null ? null : Number(input.max_buy_price),
    deal_score: input.deal_score == null ? null : Number(input.deal_score),
    sold_price: input.sold_price == null ? null : Number(input.sold_price),
    shipping_cost: input.shipping_cost == null ? null : Number(input.shipping_cost),
    fees: input.fees == null ? null : Number(input.fees),
    net_profit: input.net_profit == null ? null : Number(input.net_profit),
  };
}

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const dataSource = hasSupabaseConfig ? "supabase" : "browser";

  useEffect(() => {
    async function load() {
      if (supabase) {
        const { data, error } = await supabase.from("items").select("*").order("created_at", { ascending: false });
        if (!error && data) {
          setItems(data as Item[]);
          setLoading(false);
          return;
        }
        setError(error.message);
      }

      const cached = window.localStorage.getItem(storageKey);
      setItems(cached ? (JSON.parse(cached) as Item[]) : seedItems);
      setLoading(false);
    }

    load();
  }, []);

  useEffect(() => {
    if (!loading && !supabase) {
      window.localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [items, loading]);

  const value = useMemo<InventoryContextValue>(
    () => ({
      items,
      loading,
      error,
      dataSource,
      addItem: async (input) => {
        const payload = normalize(input);
        const item: Item = {
          ...payload,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          net_profit: calcProfit(payload),
        };

        if (supabase) {
          const { data, error } = await supabase.from("items").insert(payload).select("*").single();
          if (error) {
            setError(error.message);
            throw error;
          }
          setItems((current) => [data as Item, ...current]);
          return data as Item;
        }

        setItems((current) => [item, ...current]);
        return item;
      },
      updateItem: async (id, patch) => {
        const current = items.find((item) => item.id === id);
        const payload = normalize({ ...(current || emptyItemInput), ...patch });
        payload.net_profit = calcProfit(payload);

        if (supabase) {
          const { error } = await supabase.from("items").update(payload).eq("id", id);
          if (error) {
            setError(error.message);
            throw error;
          }
        }

        setItems((list) => list.map((item) => (item.id === id ? { ...item, ...payload } : item)));
      },
      deleteItem: async (id) => {
        if (supabase) {
          const { error } = await supabase.from("items").delete().eq("id", id);
          if (error) {
            setError(error.message);
            throw error;
          }
        }
        setItems((list) => list.filter((item) => item.id !== id));
      },
    }),
    [dataSource, error, items, loading],
  );

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) throw new Error("useInventory must be used inside InventoryProvider");
  return context;
}
