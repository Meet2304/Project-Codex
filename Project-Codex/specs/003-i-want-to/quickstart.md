# Quickstart — 003-i-want-to

This guide sets up a Next.js app with Supabase integration, dark mode theme, and responsive UI.

## Prerequisites
- Node.js 18+
- Supabase project: "Project-Codex" with anon key available
- Windows PowerShell (this guide uses PowerShell commands)

## 1) Scaffold the app
Create a Next.js app in `frontend/` with TypeScript and Tailwind (recommended):

1. Create app: `npx create-next-app@latest frontend --typescript --eslint --app --tailwind --src-dir --no-import-alias`
2. Install deps: `cd frontend; npm i @supabase/supabase-js next-themes`

## 2) Configure environment
Create `.env.local` in `frontend/`:

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
``` 

Never commit secrets. These are public anon keys safe for client usage.

## 3) Add Supabase client
Create `frontend/src/lib/supabaseClient.ts`:
- Export a browser and a server client using `createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)`.

## 4) Theme & gradient
- Add `next-themes` provider in `app/layout.tsx` wrapping children.
- Implement dark mode default; add a ThemeToggle component.
- Implement top-center radial gradient background with subtle noise overlay via CSS.

## 5) Navigation & pages
- BottomTabBar component for mobile (3–4 items; overflow to More).
- Pages/sections: `/` (Intro → Ideals → Projects), `/projects`, `/projects/[slug]`.

## 6) Data fetching
- Public reads from Supabase: SSR/SSG via server components for SEO.
- Projects list supports `?tag=` and `?sort=recency`.

## 7) Testing
- Unit: Jest + React Testing Library configured under `frontend/tests/unit`.
- e2e: Playwright under `frontend/tests/e2e` with basic smoke (landing gradient, CTA visible, mobile nav tabs clickable).
- Contract: Keep OpenAPI at `specs/003-i-want-to/contracts/openapi.yaml` as source of truth.

## 8) Run locally
- In `frontend/`: `npm run dev`
- Visit http://localhost:3000

## 9) Deploy
- Vercel or similar. Set env vars in hosting provider. Enable image optimization domains as needed.

## Troubleshooting
- Blank content: Ensure SSR/SSG is used for main content pages.
- Missing env: Verify `.env.local` exists and values are correct.
- Styling off: Check Tailwind config and base `<html class="dark">` when dark mode default.
