# Koriq Rebrand & Pivot — Design Spec

**Date:** 2026-07-10
**Status:** Draft (awaiting user review)
**Approach:** Option A — Surgical Branding Sweep + Landing Rebuild

---

## 1. Goal

Pivot the existing prompts-library web app into **Koriq**, a single-page MBA-program marketing site. Preserve the existing animation system, the `TechShell` chassis, the dark/glass visual language, and the React + Vite + Tailwind + Framer Motion tech stack. Replace all brand strings and unused product surface with Koriq identity and MBA-flavored copy.

Out of scope: any marketing automation, CRM integration, real admissions pipeline, payment, or analytics. The site is a static-feeling SPA whose sole backend dependency is a stub `POST /api/apply` endpoint.

---

## 2. Naming & Tagline

| Old | New |
|---|---|
| `PromptLibrary` | `Koriq` |
| `PromptsLoop` | `Koriq` |
| `PROMPTSLOOP` | `KORIQ` |
| Logo wordmark "PromptsLoop" | Logo wordmark "Koriq" |
| Tagline "Every Prompt. Any Model. Free Forever." | "The MBA, redesigned for builders." |
| Meta title `PromptsLoop - The World's Largest AI Prompt Community` | `Koriq - The MBA, Redesigned for Builders` |
| Meta description | `Koriq is a focused, builder-first MBA program. Real cases, small cohorts, measurable outcomes.` |
| Footer copyright `© 2025 PROMPTSLOOP` | `© 2026 Koriq` |
| `package.json` name `rest-express` | `koriq` |

---

## 3. Route Surface

### Kept routes

| Path | Page file | Notes |
|---|---|---|
| `/` | `pages/Landing.tsx` | Full MBA funnel rebuild |
| `/about` | `pages/About.tsx` | Rebrand + MBA mission copy |
| `/terms` | `pages/Terms.tsx` | Rebrand only |
| `/privacy` | `pages/Privacy.tsx` | Rebrand only |
| `/support` | `pages/Support.tsx` | Rebrand + Koriq contact |
| `/auth`, `/login`, `/register` | `pages/Auth.tsx` | Stub; renders "Auth coming soon" |
| `/forgot-password`, `/verify-email`, `/onboarding` | `pages/auth/*.tsx` | Stubs |
| `/settings`, `/notifications`, `/activity`, `/connections` | `pages/user/*.tsx` | Stubs ("Section coming soon") |
| `/cookies`, `/ads-disclosure` | `pages/legal/*.tsx` | Rebrand only |
| `/changelog`, `/api-docs`, `/500`, `/maintenance` | `pages/system/*.tsx` | Rebrand only |
| `/apply` | `pages/Apply.tsx` (new) | Stub form posting to `/api/apply` |

### Removed routes

| Path | Reason |
|---|---|
| `/feed`, `/explore` | No longer a feed product |
| `/search`, `/categories`, `/leaderboard`, `/tags/:tag`, `/hashtags` | Discovery pages for prompts |
| `/community`, `/prompt/:id`, `/prompt/:id/history`, `/prompt/:id/comments` | Community + prompt detail |
| `/remix/:id`, `/create`, `/workflow-builder` | Authoring tools |
| `/profile/:username` | Creator pages |
| `/admin`, `/sponsored`, `/admin-dashboard` | Admin + sponsored |

### Route file changes

- Delete page files, lazy imports, and `<Route ...>` entries for every removed path.
- Add `pages/Apply.tsx` and a `<Route path="/apply" component={Apply} />` entry.
- `App.tsx` lazy imports are pruned to only kept paths.

---

## 4. Frontend File Structure

### New files

- `client/src/pages/Apply.tsx` — single-screen application form (name, email, background, message) that POSTs to `/api/apply` and shows success/error state.
- `client/src/components/landing/sections/Hero.tsx`
- `client/src/components/landing/sections/StatsStrip.tsx`
- `client/src/components/landing/sections/ProgramOverview.tsx`
- `client/src/components/landing/sections/Outcomes.tsx`
- `client/src/components/landing/sections/Curriculum.tsx`
- `client/src/components/landing/sections/Faculty.tsx`
- `client/src/components/landing/sections/Testimonials.tsx`
- `client/src/components/landing/sections/FAQ.tsx`
- `client/src/components/landing/sections/ApplyCTA.tsx`
- `client/src/data/landing.ts` — typed exports of program stats, modules, outcomes, faculty, testimonials, FAQ items.
- `client/src/lib/apply.ts` — typed `submitApplication(payload)` calling `/api/apply`.

### Deleted files

- `client/src/pages/Feed.tsx`
- `client/src/pages/PromptDetail.tsx`
- `client/src/pages/CreatePrompt.tsx`
- `client/src/pages/RemixEditor.tsx`
- `client/src/pages/Profile.tsx`
- `client/src/pages/AdminDashboard.tsx`
- `client/src/pages/community/*` (all)
- `client/src/pages/discovery/*` (all)
- `client/src/pages/content/*` (all)
- `client/src/pages/monetization/Sponsored.tsx`
- `client/src/components/PromptCard.tsx`
- `client/src/components/RemixGraph.tsx`
- `client/src/components/AppSidebar.tsx`
- `client/src/components/landing/PromptOfDay.tsx`
- `client/src/components/landing/CategorySections.tsx`
- `client/src/components/landing/TopCreators.tsx`
- `client/src/components/landing/RecentRemixes.tsx`
- `client/src/components/landing/TrendingStrip.tsx`
- `client/src/components/landing/TagCloud.tsx`
- `client/src/components/landing/SocialProof.tsx`
- `client/src/components/ads/*` (entire dir if empty after)

### Rewritten files

- `client/src/pages/Landing.tsx` — composes the new section components.
- `client/src/pages/About.tsx` — two short MBA-mission sections.
- `client/src/pages/Terms.tsx`, `Privacy.tsx`, `Support.tsx`, `pages/legal/Cookies.tsx`, `pages/legal/AdsDisclosure.tsx`, `pages/system/Changelog.tsx`, `pages/system/ApiDocs.tsx`, `pages/system/ServerError.tsx`, `pages/system/Maintenance.tsx` — rebrand strings only, no product references.
- `client/src/pages/Auth.tsx`, `pages/auth/ForgotPassword.tsx`, `pages/auth/VerifyEmail.tsx`, `pages/auth/Onboarding.tsx` — rebrand; show "this area is staged for future cohorts" placeholder body.
- `client/src/pages/user/Settings.tsx`, `Notifications.tsx`, `ActivityFeed.tsx`, `Connections.tsx` — same stub body.
- `client/src/components/layout/TechShell.tsx` — replace wordmark text only; keep the splash, layoutId animation, scanline background, and pill-frame styling.
- `client/src/components/landing/SearchHero.tsx` — search input now submits to `/apply?interest=...` or just to `/#apply` anchor; copy rewritten to "What kind of builder are you?".
- `client/src/components/landing/UploadCTA.tsx` — copy rewritten to "Apply to the next cohort".
- `client/src/index.css` — no structural changes; verify Koriq palette inherits existing CSS vars. Add `.koriq-wordmark { font-family: var(--font-mono); letter-spacing: -0.05em; font-weight: 800; }` alongside the existing utility classes.
- `client/index.html` — `<title>`, `<meta name="description">`, `<meta property="og:*">`, favicon link if present — all rebranded.

### Branding touch list (grep-replace targets)

Every literal occurrence of `PromptsLoop`, `PromptLibrary`, `PROMPTSLOOP`, `promptsloop`, `promptlibrary`, `promptlib` becomes `Koriq`, `koriq`, `KORIQ`. Files verified by ripgrep after the sweep:

- all `*.tsx`, `*.ts`, `*.html`, `*.md`, `*.json` under `client/`, `server/`, `shared/`, `docs/`, root.
- `package.json`
- `README.md`
- `replit.md`
- `design_guidelines.md` → renamed and rewritten to Koriq design notes (kept for future milestones).

---

## 5. Data Model

The prompt-domain schema is removed. Final shared schema (`shared/schema.ts`) contains only:

- `users` table: `id`, `email`, `passwordHash`, `displayName`, `createdAt`. No karma, badges, prompts, comments, votes.

Removed tables: `prompts`, `comments`, `votes`, `bookmarks`, `follows`, `badges`, `user_badges`, `karma_events`, `sponsorship`. Their Drizzle exports are removed. Migrations are reset (`db:push` builds the new schema on next run).

A new `applications` table is added: `id (uuid)`, `name`, `email`, `background`, `message`, `createdAt`. Accessed only via the server stub.

---

## 6. Backend (Server)

### Kept

- `server/app.ts`, `server/index-dev.ts`, `server/index-prod.ts` — Express bootstrap.
- `server/db.ts`, `server/storage.ts` (slimmed — only `users` and `applications`).
- `server/middleware/auth.ts` — kept for stub Auth pages, even if not actually wired.
- `server/middleware/logging.ts`, `server/metrics.ts`, `server/sentry.ts`, rate limit, helmet — kept.
- `server/__tests__/apply.test.ts` — new supertest test for the `/api/apply` stub.

### Removed

All route files referencing prompts, comments, votes, karma, badges, sponsorship, remix, leaderboard, admin, workflow, search, tags. Their `routes.ts` registrations are removed.

### New

- `server/routes/apply.ts` — `POST /api/apply` validates `{name, email, background, message}` with Zod, inserts into `applications`, returns `{ok: true, id}`. Logs via Pino.
- `server/__tests__/apply.test.ts` — happy path + validation failure.

### Updated registration
- `server/routes.ts` — imports and mounts `applyRouter` at `/api/apply`; removes all import lines and `app.use(...)` calls for the deleted modules listed above.

---

## 7. Landing Sections (Detailed)

All sections reuse the existing dark/glass + Framer Motion visual language. No parallax, no auto-carousel, no parallax scroll.

1. **Hero**
   - Wordmark "KORIQ" (splash + persistent).
   - Headline: "The MBA, redesigned for builders."
   - Sub: "Twelve months. Small cohorts. Cases shipped in public."
   - Two CTAs: `Apply Now` (gradient, → `/apply`) and `View Curriculum` (ghost pill, → `#curriculum`).

2. **StatsStrip**
   - 4 stat tiles: average salary lift (placeholder `+38%`), cohort size (`24`), months to finish (`12`), hiring-company count (`120+`).
   - Placeholders are surfaced in code as constants so the user can edit one place.

3. **ProgramOverview**
   - 4 module cards: `Strategy`, `Product`, `Finance`, `Leadership`. Each card: line-icon, 2-line description, "Outcomes:" list.

4. **Outcomes**
   - 4-up grid mirroring StatStrip but with outcome narrative (founder role lift, equity outcomes, time-to-promotion, founder rate).
   - Each card has a small percentage chip.

5. **Curriculum**
   - Vertical timeline: 4 quarters (Foundations → Build → Operate → Capstone) with 3 bullet modules each.
   - Each quarter node is a glass card with monospace quarter label.

6. **Faculty**
   - 3 persona cards: avatar (initials fallback), name, role, 2-line bio.

7. **Testimonials**
   - 3 quote cards. Author + role + cohort year.

8. **FAQ**
   - Accordion (Radix Accordion already available). 6 Q&As covering admissions, prerequisites, tuition placeholder, format, online vs. in-person, refund policy.

9. **ApplyCTA**
   - Full-width gradient band. Headline: "Cohort 7 opens in [Month YYYY]." Two CTAs: `Apply Now` → `/apply`, `Talk to admissions` → `mailto:admissions@koriq.example`.

10. **Footer**
    - Brand wordmark, links to About / Terms / Privacy / Support / Changelog / API, copyright.

### Section component contracts

- All section components export default React components and take no props.
- Section content lives in `client/src/data/landing.ts`. Sections render from a typed `landingData` export so swapping copy later is a one-file edit.
- Section ids (anchor targets) follow this map: `hero` (implicit), `#stats`, `#program`, `#outcomes`, `#curriculum`, `#faculty`, `#testimonials`, `#faq`, `#apply`.

---

## 8. Apply Page

- Single column, max-w-2xl, centered.
- Fields: `name`, `email`, `background` (select: `engineer`, `designer`, `founder`, `analyst`, `other`), `message` (textarea, 800 char limit).
- Submit posts to `/api/apply` via `lib/apply.ts`.
- States: idle, submitting (button spinner), success (thank-you screen), error (inline).
- Page header reads "Apply to Koriq Cohort 7."

---

## 9. Branding / Visual System

- Palette unchanged (existing CSS variables).
- Typography unchanged (Inter + JetBrains Mono).
- TechShell preserved; splash wordmark text becomes `KORIQ`.
- Pill-frame buttons (`rounded-full`, monospace), scanline/grid background, `custom-scrollbar`, `LayoutGroup` shell preserved.
- New `koriq-wordmark` class is added to `index.css` for the monospace display usage (purely cosmetic, identical rules reused from existing classes).

---

## 10. Animation Inventory (Preserved)

- Splash screen (Framer Motion `layoutId="logo"`) — text only changes.
- SearchHero pill input — preserved.
- Pinned sidebar/app shell scroll behavior — preserved.
- No new animations added.

---

## 11. Testing Strategy

- Existing test files tied to deleted modules are deleted.
- New `server/__tests__/apply.test.ts`: supertest happy path + missing-field failure.
- New `client/src/__tests__/landing-renders.test.tsx`: assert key section anchors exist by id given a stub `queryClient`.
- `vitest.config.ts` unchanged.
- Manual verification: dev server, click through `Landing` → `Hero`, scroll sections, tabs to `/about` / `/terms` / `/privacy` / `/apply`, hit submit.

### Test commands

- `npm run test:unit` — all unit tests pass.
- `npm run check` — tsc clean.
- `npm run dev` — dev server boots, all kept routes 200, no console errors on Landing.

---

## 12. Out of Scope

- Real admissions pipeline / CRM.
- Payment / Stripe.
- Analytics.
- Email service.
- Authentication wiring (login/register are visible but do not submit anywhere).
- Internationalization rewrite (`i18n.ts` left as-is, English-only strings).
- Replit-specific deployment configuration beyond what already exists.

---

## 13. Risks

- **Hidden brand literals.** Grep risk. Mitigation: a final `rg` sweep with case-insensitive variants of `PromptsLoop`, `PromptLibrary`, `promptlib`, `promptloop`.
- **Stale component imports.** Pruning risk. Mitigation: tsc must be green before commit.
- **Tailwind classes referencing unused colors stay.** Cosmetic only. Acceptable.
- **Migration drift.** `db:push` runs against a moved schema. Acceptable; user will reset the database when ready.

---

## 14. Acceptance Criteria

- [ ] Every visible brand string is `Koriq` or `KORIQ`.
- [ ] `Landing` page composes all 9 sections with real content (placeholders OK).
- [ ] `/apply` renders and submits successfully to the stub endpoint.
- [ ] All removed routes return 404 (via `not-found.tsx`).
- [ ] Server boots; removed route modules no longer import in `routes.ts`.
- [ ] `npm run check` passes.
- [ ] `npm run test:unit` passes.
- [ ] `rg` for old brand names returns zero matches in source-controlled files (excluding `attached_assets/*` original specs).
- [ ] README, package.json name, meta tags all say `Koriq`.

---

## 15. File Manifest Summary

**Create (frontend):**
- `client/src/pages/Apply.tsx`
- `client/src/components/landing/sections/{Hero,StatsStrip,ProgramOverview,Outcomes,Curriculum,Faculty,Testimonials,FAQ,ApplyCTA}.tsx`
- `client/src/data/landing.ts`
- `client/src/lib/apply.ts`
- `client/src/__tests__/landing-renders.test.tsx`

**Create (backend):**
- `server/routes/apply.ts`
- `server/__tests__/apply.test.ts`

**Modify (brand sweep):**
- `client/index.html`, `client/src/components/layout/TechShell.tsx`, `client/src/App.tsx`, root `README.md`, `replit.md`, `package.json`, all kept page files.

**Delete:** all files listed in section 4.

**Rewrite:** Landing.tsx and the rewritten page files listed in section 4.
