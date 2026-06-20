"use client";

import { useState } from "react";
import { ExternalLink, Plus, Sparkles, Wand2 } from "lucide-react";
import { compRange, money, scoreSmartDeal } from "@/lib/calculations";
import { useInventory } from "@/components/inventory-provider";
import { PageHeading } from "@/components/page-heading";

const conditions = ["New", "Like New", "Good", "Fair", "Poor"];
const platforms = [
  { name: "Facebook Marketplace", feeRate: 0 },
  { name: "eBay", feeRate: 0.14 },
  { name: "Poshmark", feeRate: 0.2 },
  { name: "Mercari", feeRate: 0.1 },
];
const signals = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
] as const;

export default function DealFinderPage() {
  const { addItem } = useInventory();
  const [itemName, setItemName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("Apparel");
  const [condition, setCondition] = useState("Good");
  const [platform, setPlatform] = useState(platforms[0].name);
  const [demand, setDemand] = useState<"low" | "medium" | "high">("medium");
  const [sellThrough, setSellThrough] = useState<"low" | "medium" | "high">("medium");
  const [competition, setCompetition] = useState<"low" | "medium" | "high">("medium");
  const [purchase, setPurchase] = useState(25);
  const [low, setLow] = useState(70);
  const [high, setHigh] = useState(110);
  const [prepCost, setPrepCost] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [comps, setComps] = useState([0, 0, 0, 0, 0]);
  const query = [brand, itemName].filter(Boolean).join(" ").trim() || "resale item";
  const range = compRange(comps);
  const selectedPlatform = platforms.find((option) => option.name === platform) || platforms[0];
  const result = scoreSmartDeal({
    purchasePrice: purchase,
    low,
    high,
    condition,
    platform,
    demand,
    sellThrough,
    competition,
    prepCost,
    shippingCost,
    feeRate: selectedPlatform.feeRate,
    compCount: range?.count || 0,
  });

  async function addDraft() {
    await addItem({
      item_name: itemName || "Untitled deal",
      brand,
      category,
      condition,
      purchase_price: purchase,
      target_sale_price: high,
      platform,
      estimated_resale_low: low,
      estimated_resale_high: high,
      max_buy_price: result.maxBuy,
      deal_score: result.score,
      deal_recommendation: result.recommendation,
      shipping_cost: shippingCost,
      fees: result.fees,
      notes: [
        `Deal Finder result: ${result.recommendation}`,
        `Confidence: ${result.confidence}`,
        `Demand: ${demand}, sell-through: ${sellThrough}, competition: ${competition}`,
        ...result.reasons,
      ].join("\n"),
    });
    setItemName("");
    setBrand("");
    setComps([0, 0, 0, 0, 0]);
  }

  function applyComps() {
    if (!range) return;
    setLow(range.low);
    setHigh(range.high);
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
        <div className="grid grid-cols-2 gap-3">
          <label>
            <span className="label">Condition</span>
            <select className="field mt-1" value={condition} onChange={(e) => setCondition(e.target.value)}>
              {conditions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label>
            <span className="label">Platform</span>
            <select className="field mt-1" value={platform} onChange={(e) => setPlatform(e.target.value)}>
              {platforms.map((option) => <option key={option.name}>{option.name}</option>)}
            </select>
          </label>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <NumberField label="Ask" value={purchase} onChange={setPurchase} />
          <NumberField label="Low" value={low} onChange={setLow} />
          <NumberField label="High" value={high} onChange={setHigh} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Prep cost" value={prepCost} onChange={setPrepCost} />
          <NumberField label="Ship cost" value={shippingCost} onChange={setShippingCost} />
        </div>
      </section>

      <section className="panel mt-4 space-y-4">
        <SignalPicker label="Demand" value={demand} onChange={setDemand} />
        <SignalPicker label="Sell-through" value={sellThrough} onChange={setSellThrough} />
        <SignalPicker label="Competition" value={competition} onChange={setCompetition} />
      </section>

      <section className="panel mt-4 space-y-3">
        <div>
          <p className="label">Comp research</p>
          <p className="mt-1 text-sm leading-5 text-ink/60">Open sold/listed searches, then enter real sold prices below.</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <ResearchLink label="eBay solds" href={`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}&LH_Sold=1&LH_Complete=1`} />
          <ResearchLink label="Google comps" href={`https://www.google.com/search?q=${encodeURIComponent(`${query} resale sold price`)}`} />
          <ResearchLink label="Facebook" href={`https://www.facebook.com/marketplace/search/?query=${encodeURIComponent(query)}`} />
          <ResearchLink label="Poshmark" href={`https://poshmark.com/search?query=${encodeURIComponent(query)}`} />
        </div>
        <div className="grid grid-cols-5 gap-2">
          {comps.map((value, index) => (
            <label key={index}>
              <span className="label">C{index + 1}</span>
              <input
                type="number"
                min="0"
                step="0.01"
                className="field mt-1 px-2"
                value={value || ""}
                onChange={(event) => setComps((current) => current.map((comp, compIndex) => (compIndex === index ? Number(event.target.value) : comp)))}
                placeholder="$"
              />
            </label>
          ))}
        </div>
        <div className="rounded-md bg-paper p-3 text-sm">
          {range ? (
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-bold">{range.count} comp{range.count === 1 ? "" : "s"} · Avg {money(range.average)}</p>
                <p className="text-ink/60">Suggested range: {money(range.low)} to {money(range.high)}</p>
              </div>
              <button className="btn-secondary h-10 shrink-0 px-3" onClick={applyComps}>
                <Wand2 size={15} />
                Use
              </button>
            </div>
          ) : (
            <p className="text-ink/60">Enter at least one observed sold price to calculate a resale range.</p>
          )}
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
        <div className="grid grid-cols-3 gap-2 text-center">
          <Metric label="Profit" value={money(result.expectedProfit)} />
          <Metric label="ROI" value={`${result.roi}%`} />
          <Metric label="Confidence" value={result.confidence} />
        </div>
        <div className="rounded-md bg-brass/20 p-3">
          <p className="flex items-center gap-2 text-sm font-black"><Sparkles size={16} /> {result.recommendation}</p>
          <p className="mt-1 text-sm text-ink/70">Expected resale range: {money(low)} to {money(high)}. Net after estimated fees/shipping: {money(result.netResale)}.</p>
        </div>
        <div className="space-y-2">
          {result.reasons.map((reason) => (
            <p key={reason} className="rounded-md bg-paper px-3 py-2 text-sm text-ink/70">{reason}</p>
          ))}
        </div>
        <button className="btn-primary w-full" onClick={addDraft}>
          <Plus size={17} />
          Add as draft item
        </button>
      </section>
    </div>
  );
}

function SignalPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: "low" | "medium" | "high";
  onChange: (value: "low" | "medium" | "high") => void;
}) {
  return (
    <div>
      <p className="label">{label}</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {signals.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`h-10 rounded-md border text-sm font-semibold transition ${
              value === option.value ? "border-moss bg-moss text-white" : "border-ink/15 bg-white text-ink"
            }`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-paper px-2 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-ink/50">{label}</p>
      <p className="mt-1 text-sm font-black text-ink">{value}</p>
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

function ResearchLink({ label, href }: { label: string; href: string }) {
  return (
    <a className="btn-secondary h-10 px-3" href={href} target="_blank" rel="noreferrer">
      <ExternalLink size={15} />
      {label}
    </a>
  );
}
