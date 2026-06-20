create extension if not exists "pgcrypto";

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  item_name text not null,
  brand text,
  category text,
  condition text,
  purchase_price numeric(10, 2) not null default 0,
  target_sale_price numeric(10, 2) not null default 0,
  platform text,
  status text not null default 'draft' check (status in ('draft', 'listed', 'sold')),
  sku text,
  storage_location text,
  notes text,
  estimated_resale_low numeric(10, 2),
  estimated_resale_high numeric(10, 2),
  max_buy_price numeric(10, 2),
  deal_score integer,
  deal_recommendation text,
  facebook_listing text,
  ebay_listing text,
  poshmark_listing text,
  sold_price numeric(10, 2),
  shipping_cost numeric(10, 2),
  fees numeric(10, 2),
  net_profit numeric(10, 2)
);

create index if not exists items_status_idx on public.items(status);
create index if not exists items_created_at_idx on public.items(created_at desc);
create index if not exists items_sku_idx on public.items(sku);

alter table public.items disable row level security;

comment on table public.items is 'Shared-account inventory for Found & Forged Resale Console.';
