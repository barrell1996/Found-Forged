import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { InventoryProvider } from "@/components/inventory-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Found & Forged Resale Console",
  description: "Mobile-first resale inventory console.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <InventoryProvider>
          <AppShell>{children}</AppShell>
        </InventoryProvider>
      </body>
    </html>
  );
}
