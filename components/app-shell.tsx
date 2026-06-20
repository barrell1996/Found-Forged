"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Boxes, CircleDollarSign, Home, Lightbulb, PackagePlus, ReceiptText } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/add-item", label: "Add", icon: PackagePlus },
  { href: "/deal-finder", label: "Deals", icon: Lightbulb },
  { href: "/listing-generator", label: "Listings", icon: ReceiptText },
  { href: "/inventory", label: "Inventory", icon: Boxes },
  { href: "/sold-items", label: "Sold", icon: CircleDollarSign },
  { href: "/profit-dashboard", label: "Profit", icon: BarChart3 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <header className="sticky top-0 z-20 border-b border-ink/10 bg-paper/90 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+14px)] backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-wide text-clay">Found & Forged</p>
        <h1 className="text-xl font-bold text-ink">Resale Console</h1>
      </header>
      <main className="flex-1 px-4 py-4 pb-28">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-white/95 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 shadow-[0_-10px_30px_rgba(31,37,35,0.08)] backdrop-blur">
        <div className="mx-auto grid max-w-md grid-cols-7 px-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-md text-[10px] font-semibold ${
                  active ? "bg-moss text-white" : "text-ink/60"
                }`}
                aria-label={item.label}
              >
                <Icon size={18} strokeWidth={2.25} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
