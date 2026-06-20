# Found & Forged Resale Console

Mobile-first resale inventory console built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Local Commands

```bash
pnpm install
pnpm run build
pnpm dev
```

## Supabase Setup

1. Create a Supabase project.
2. Open the SQL editor.
3. Run `supabase/schema.sql`.
4. Add these environment variables locally and in Vercel:

```text
NEXT_PUBLIC_SUPABASE_URL=your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=your Supabase anon public key
```

The Supabase client reads those values in `lib/supabase.ts`.

## Vercel

The deployed production app is:

https://build-a-mobile-first-resale-invento.vercel.app

Vercel settings are defined in `vercel.json`:

```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm run build",
  "installCommand": "pnpm install",
  "devCommand": "pnpm dev"
}
```

After adding or changing Vercel environment variables, redeploy production.

## iPhone Smoke Test

- Open the production URL in Safari.
- Add an item.
- Confirm it appears in Inventory.
- Refresh and confirm the item persists.
- Score a deal and add it as a draft.
- Generate listings and confirm status changes to listed.
- Mark an item sold.
- Enter sold price, shipping, and fees.
- Confirm Profit Dashboard updates.
