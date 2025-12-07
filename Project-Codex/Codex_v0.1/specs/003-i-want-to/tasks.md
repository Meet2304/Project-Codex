# Tasks: 003-i-want-to

**Input**: Design documents from `/specs/003-i-want-to/` (plan.md, research.md, data-model.md, contracts/openapi.yaml, quickstart.md)
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory → extract tech stack and structure
2. Load optional docs: data-model.md → entities; contracts/ → endpoints; research.md → decisions; quickstart.md → scenarios
3. Generate tasks by category and apply TDD ordering
4. Number tasks T001…; add dependency notes and parallel [P] markers
5. Validate completeness and parallel independence
```

## Path Conventions (from plan.md)
- App: `frontend/` (Next.js App Router)
- Components: `frontend/src/components/`
- Library: `frontend/src/lib/`
- Styles: `frontend/src/styles/`
- Tests: `frontend/tests/{unit,integration,e2e,contract}/`
- Contracts: `specs/003-i-want-to/contracts/openapi.yaml`

## Phase 3.1: Setup
- [X] T001 Create Next.js app scaffold in `frontend/` per quickstart (App Router, TS, Tailwind)
  - Command context: create-next-app (see quickstart)
  - Output: `frontend/` with app, eslint, tsconfig, tailwind
- [X] T002 Install core dependencies in `frontend/`: `@supabase/supabase-js`, `next-themes`
  - Dependency: T001
- [X] T003 [P] Add base project scripts for test/e2e/format in `frontend/package.json`
  - Scripts: test, test:watch, e2e, format, lint
- [X] T004 Configure Tailwind and global styles in `frontend/tailwind.config.ts` and `frontend/src/styles/globals.css`
  - Dependency: T001
- [X] T005 Setup Jest + RTL in `frontend/` with config under `frontend/tests/unit`
  - Dependency: T001
- [X] T006 Setup Playwright in `frontend/tests/e2e` with base smoke spec
  - Dependency: T001
- [X] T007 [P] Create `.env.local.example` in `frontend/` with SUPABASE URL/ANON placeholders

## Phase 3.2: Tests First (TDD)
- [ ] T008 [P] Contract test: GET /v1/person → `frontend/tests/contract/person.spec.ts`
  - Load `specs/003-i-want-to/contracts/openapi.yaml`; assert schema for 200 response
- [ ] T009 [P] Contract test: GET /v1/principles → `frontend/tests/contract/principles.spec.ts`
- [ ] T010 [P] Contract test: GET /v1/projects?tag=&sort=recency → `frontend/tests/contract/projects-list.spec.ts`
- [ ] T011 [P] Contract test: GET /v1/projects/{slug} → `frontend/tests/contract/project-detail.spec.ts`
- [ ] T012 [P] Contract test: GET /v1/tags → `frontend/tests/contract/tags.spec.ts`
- [ ] T013 [P] Contract test: GET /v1/nav → `frontend/tests/contract/nav.spec.ts`
- [ ] T014 [P] Contract test: GET /v1/settings → `frontend/tests/contract/settings.spec.ts`
- [ ] T015 [P] Integration test: Landing page shows gradient + CTA ("Learn About Me") → `frontend/tests/integration/landing.spec.ts`
- [ ] T016 [P] Integration test: Mobile bottom tab bar (3–4 items) navigates → `frontend/tests/integration/mobile-nav.spec.ts`
- [ ] T017 [P] Integration test: Projects list renders single-column rich cards on mobile → `frontend/tests/integration/projects-list-mobile.spec.ts`
- [ ] T018 [P] Integration test: Project detail is artifact-first (hero media at top) → `frontend/tests/integration/project-detail.spec.ts`
- [ ] T019 [P] Integration test: Reduced-motion respects user preference → `frontend/tests/integration/reduced-motion.spec.ts`
- [ ] T020 [P] Unit test: Theme toggle persists preference → `frontend/tests/unit/theme-toggle.spec.ts`

## Phase 3.3: Core Implementation (ONLY after failing tests)
- [X] T021 Environment: Add `.env.local` from example in `frontend/`
  - Dependency: T007
- [X] T022 Create Supabase client in `frontend/src/lib/supabaseClient.ts` (browser + server helpers)
  - Dependency: T002
- [X] T023 Implement ThemeProvider in `frontend/src/app/layout.tsx` using `next-themes` (default dark)
  - Dependency: T002, T004
- [X] T024 Create ThemeToggle component in `frontend/src/components/ThemeToggle.tsx`
  - Dependency: T023
- [X] T025 Implement global gradient + noise background styles (top-center radial gradient) in `frontend/src/styles/globals.css`
  - Dependency: T004
- [X] T026 Implement BottomTabBar component in `frontend/src/components/BottomTabBar.tsx` with 3–4 items, overflow → More
  - Dependency: T004
- [X] T027 Create Nav model/types and config loader in `frontend/src/lib/siteConfig.ts`
  - Dependency: T022
  - Note: Types created in types.ts; config loader pending real data fetch
- [X] T028 Create pages: `/` landing with Intro → Ideals → Projects sections in `frontend/src/app/page.tsx`
  - Dependency: T023, T025, T027
- [X] T029 Create `/projects/page.tsx` (list with `?tag=&sort=recency`) with rich cards component `ProjectCard.tsx`
  - Dependency: T022, T027
- [X] T030 Create `/projects/[slug]/page.tsx` (artifact-first detail) using hero media at top
  - Dependency: T022
- [X] T031 Accessibility: Ensure focus styles, contrast, and print styles (light) in `globals.css` and components
  - Dependency: T025

## Phase 3.4: Integration
- [ ] T032 Data fetching: SSR/SSG patterns per research
  - Landing, ideals: SSG; projects/projects/[slug]: SSR or SSG with revalidate
- [ ] T033 Fetch Person/Principles/Projects/Tags/Nav/Settings from Supabase (public read)
  - Add types mapped to `data-model.md`; map to UI props
- [ ] T034 Implement query params handling for projects list (tag, sort)
  - Dependency: T029
- [ ] T035 Logging: Basic structured logs in server actions/route handlers (if any)
- [ ] T036 Healthcheck route (optional): `/api/health` returning JSON OK
- [ ] T037 Contract tests adapter: Validate responses against OpenAPI schemas

## Phase 3.5: Polish
- [ ] T038 [P] Unit tests for UI components: ThemeToggle, BottomTabBar, ProjectCard
- [ ] T039 [P] Performance pass: lazy-load images, optimize Next/Image usage; verify CWV
- [ ] T040 [P] Docs: Update `specs/003-i-want-to/quickstart.md` with any deltas and screenshots
- [ ] T041 Cleanup: Remove duplication, tighten types, ensure ESLint passes
- [ ] T042 Security: Review env handling; no secrets committed; verify headers

## Dependencies
- Setup (T001–T007) precedes Tests (T008–T020)
- Tests must fail before Core (T021–T031)
- Core precedes Integration (T032–T037)
- Everything before Polish (T038–T042)
- Specific blockers noted in each item

## Parallel Execution Examples
```
# Example 1: Run all contract tests tasks together (independent files)
Task: "Contract test: GET /v1/person → frontend/tests/contract/person.spec.ts"
Task: "Contract test: GET /v1/principles → frontend/tests/contract/principles.spec.ts"
Task: "Contract test: GET /v1/projects?tag=&sort=recency → frontend/tests/contract/projects-list.spec.ts"
Task: "Contract test: GET /v1/projects/{slug} → frontend/tests/contract/project-detail.spec.ts"
Task: "Contract test: GET /v1/tags → frontend/tests/contract/tags.spec.ts"
Task: "Contract test: GET /v1/nav → frontend/tests/contract/nav.spec.ts"
Task: "Contract test: GET /v1/settings → frontend/tests/contract/settings.spec.ts"

# Example 2: Parallel UI unit/integration tests
Task: "Integration test: mobile bottom tab bar → frontend/tests/integration/mobile-nav.spec.ts"
Task: "Integration test: projects list mobile layout → frontend/tests/integration/projects-list-mobile.spec.ts"
Task: "Unit test: Theme toggle persists → frontend/tests/unit/theme-toggle.spec.ts"
```

## Validation Checklist
- [ ] All contracts have corresponding tests
- [ ] All entities are represented via types and fetching in code
- [ ] All tests come before implementation
- [ ] Parallel tasks touch different files only
- [ ] Each task specifies exact file path
- [ ] No task modifies the same file as another [P] task