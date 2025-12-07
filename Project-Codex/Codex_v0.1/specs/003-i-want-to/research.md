# Research — 003-i-want-to

## Decisions

1) Next.js Router & Rendering
- Decision: Use App Router with a mix of Static Generation (landing, ideals) and SSR for projects when tags/sorts apply.
- Rationale: App Router provides flexible data fetching and layouts; SSG optimizes performance for mostly static content.
- Alternatives: Pages Router (legacy) — rejected due to deprecation trajectory.

2) Styling System
- Decision: Tailwind CSS with CSS variables for theme tokens; fallback to CSS Modules if Tailwind is not desired.
- Rationale: Fast iteration for minimal UI; easy dark mode and reduced-motion utilities.
- Alternatives: Styled-components/Emotion — adds runtime; CSS Modules only — slower for design tokens.

3) Theme & Motion
- Decision: Dark mode default with next-themes for toggle and persistence; respect prefers-reduced-motion via CSS utilities.
- Rationale: Meets FR-001/FR-011/FR-013; persists preference across sessions.
- Alternatives: Manual localStorage + CSS classes — workable but more boilerplate.

4) Gradient Implementation
- Decision: Radial gradient (top center) with subtle noise overlay via CSS/PNG/SVG mask.
- Rationale: Matches design ideology; noise for texture without heavy assets.
- Alternatives: Canvas/WebGL shader — overkill for scope.

5) Supabase Integration
- Decision: Public read-only content with anon key for client-side reads; optional SSR reads via server components with anon key from env.
- Rationale: Simplicity; content is public; avoids server auth complexity initially.
- Alternatives: Service role on server for admin — defer to future admin panel feature.

6) Data Ownership
- Decision: Store content in Supabase tables (person, principle, project, tag, project_tag) with simple RLS allowing read to anon.
- Rationale: Centralized source; easy querying/filtering; future admin-write.
- Alternatives: Markdown/MDX in repo — good for SSG only; less flexible for filtering/sorting.

7) Dynamic Site Configuration
- Decision: Site settings fetched at build/edge from `site_settings` (title, theme defaults, nav order).
- Rationale: Allows tweaks without redeploys.
- Alternatives: Hardcoded config — faster locally but not dynamic as requested.

8) Navigation (Mobile)
- Decision: Bottom tab bar component with 3–4 items; overflow in a More tab.
- Rationale: Matches clarification; consistent across pages.

## Risks
- SEO vs. client-side data: Ensure SSR/SSG for content pages to avoid empty HTML for crawlers.
- Environment configuration: Correctly scope anon key to public; never expose service role on client.
- Performance: Large media on project details — mitigate with Next/Image and lazy loading.
- Accessibility: Gradient and overlays must preserve contrast; add backdrops when needed.

## Follow-ups
- Define RLS policies to allow read for anon and prepare future write for admin.
- Decide on Tailwind vs. CSS Modules definitively during scaffold.
- Prepare print styles alongside dark/light themes.
