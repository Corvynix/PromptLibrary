# AGENTS.md — أول بيعة (Awal Beyaa / First Sale)

This file is the permanent engineering contract for this repository.
Every AI agent or human developer must read and follow this before making changes.

---

## Product Purpose

**أول بيعة** is a practical builder-to-market system for Egyptian AI builders who built a software or digital product and have not achieved meaningful sales.

The central question the product answers:
> "بنيت حاجة بالـAI… ومحدش اشتراها؟"

The product helps users:
1. Understand their buyer and problem
2. Clarify their offer
3. Find real prospects
4. Start conversations
5. Make an actual selling attempt
6. Interpret the evidence
7. Decide what to change next

---

## Target User

Egyptian AI builders / vibe coders who:
- Built something (SaaS, app, tool, extension, automation, digital product)
- Want to monetize it
- Have little or no sales

The niche is defined by **state of the builder**, not by industry.

---

## Core Product Principle

The product must always answer: **"What should I do next?"**

It must never become a passive content library. Even community, radar, and vault must have a clear path back to action.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript (strict) |
| Routing | wouter |
| State | React Query (server state) + React useState (local) |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 + shadcn/ui |
| i18n | react-i18next |
| Animation | framer-motion |
| Backend | Express 4 + TypeScript |
| ORM | Drizzle ORM |
| Database | PostgreSQL (Supabase) |
| Auth | JWT (stateless, stored in localStorage) |
| File Storage | Supabase Storage |
| Testing | Vitest (unit/integration) + Playwright (E2E) |
| Deployment | Vercel-compatible (static frontend + serverless or Node) |

---

## Coding Conventions

### TypeScript
- Strict mode is ON. No `any` unless absolutely unavoidable with a comment.
- All API request/response types must be defined in `shared/types.ts`.
- Use Zod for all server-side input validation.

### File Naming
- Components: `PascalCase.tsx`
- Utilities/services: `camelCase.ts`
- Routes: `camelCase.ts`
- Pages: `PascalCase.tsx`

### Imports
- Use `@/` alias for `client/src/`
- Use `@shared/` alias for `shared/`
- No circular imports between server/ and client/

### API Routes
- All API routes live in `server/routes/`
- Routes are registered in `server/routes.ts`
- Every route that modifies data requires authentication
- Admin routes require `requireRole('admin')`
- Rate limit user-facing write endpoints

### Database
- All schema changes go through `shared/schema.ts` (Drizzle)
- Apply with `npm run db:push`
- Never modify the database directly outside of Drizzle migrations/push
- Use UUIDs for all primary keys except legacy `users.id` (serial)
- All tables must have `created_at` (defaultNow)

---

## Security Rules

1. **No secrets in the frontend.** Never put API keys, service role keys, or payment secrets in any file under `client/`.
2. **No secrets committed to git.** All secrets go in `.env` (git-ignored). Reference `.env.example` for documentation.
3. **Server-side authorization on every protected endpoint.** Never trust the client for access control.
4. **Admin role check via `requireRole('admin')`** middleware on all `/api/admin/*` routes.
5. **Input validation** with Zod on every POST/PATCH/PUT route.
6. **Payment status can only be changed by admin.** Users can SUBMIT a payment claim. Only admin can VERIFY or REJECT.
7. **Supabase service role key** is server-only. Never expose it to the client.
8. **Audit log** any admin action that modifies user data, payment status, or entitlements.
9. **Rate limiting** on all public write endpoints and auth endpoints.
10. **Safe error messages.** Never expose stack traces or raw DB errors to the client.

---

## NO FAKE DATA POLICY

This is absolute and non-negotiable.

- ❌ No fake testimonials
- ❌ No fake user counts ("10,000 builders!")
- ❌ No fake social proof
- ❌ No fake payment success
- ❌ No fake analytics numbers
- ❌ No invented customer feedback
- ❌ No guaranteed revenue claims

Seed content is clearly marked as DEMO internally and never presented to users as real customer claims.

The product copy must say:
> "هدف التحدي هو تنفيذ أول تجربة بيع حقيقية، والحصول على evidence واضح."

Never say "guaranteed sale" or "guaranteed customer."

---

## UI Language Rules

- **Primary language: Egyptian Arabic (RTL)**
- **Secondary language: English**
- `<html dir="rtl" lang="ar">` by default
- Tailwind `rtl:` variants for directional layout
- The `i18n.ts` file contains all translation keys
- All user-facing copy is in Arabic first
- Avoid corporate, guru, or hype language
- Writing style: direct, modern, Egyptian, intelligent, concise

Arabic examples:
- "ابدأ أول بيعة" ✅
- "Start Your Entrepreneurship Journey" ❌
- "تشخيص مجاني" ✅
- "Free Consultation" ❌

---

## RTL Requirements

- `html` element has `dir="rtl"` and `lang="ar"`
- Use `rtl:ml-*` / `rtl:mr-*` / `rtl:pl-*` etc. for directional spacing
- Flex row direction is automatically reversed in RTL
- Icons that imply direction (arrows) must flip: use `rtl:scale-x-[-1]`
- Text alignment defaults to right (via Tailwind RTL)
- Test every layout on mobile at 375px in RTL

---

## Design System Rules

- **Do not change the color tokens** in `tailwind.config.ts` without documenting the reason
- **Do not add new UI libraries.** Use existing shadcn/ui components.
- **Do not use inline styles.** Use Tailwind classes only.
- **Dark mode is supported** via `next-themes` (ThemeProvider)
- **Font stack:** Inter (UI), Outfit (display/headings), Cairo (Arabic text), JetBrains Mono (code)
- **Border radius:** `--radius: 0rem` (sharp edges, futuristic look)
- **Do not add glassmorphism, parallax, or auto-play carousels**

---

## Feature Flags

All major modules are behind feature flags stored in `feature_flags` table and seeded from env vars.

| Flag | Default | Description |
|---|---|---|
| `ENABLE_COMMUNITY` | true | Community feed |
| `ENABLE_MEMBERSHIP` | true | Monthly membership |
| `ENABLE_AI_OPERATOR` | false | AI assistant (not implemented in V1) |
| `ENABLE_RADAR` | true | AI Radar |
| `ENABLE_VAULT` | true | Builder Vault |
| `ENABLE_PUBLIC_PROJECTS` | true | Public project pages |
| `ENABLE_MANUAL_PAYMENTS` | true | Manual InstaPay/payment flow |

The app must remain functional if any module is disabled.

---

## Payment Rules (from Athar pattern)

1. User submits a payment CLAIM with reference number → status = `SUBMITTED`
2. Admin verifies against real InstaPay/bank activity → status = `VERIFIED` → entitlement granted
3. Admin can REJECT → user notified
4. A user can resubmit (update reference) only if status is not `VERIFIED`
5. Payment status can ONLY be changed server-side by admin
6. No payment is ever auto-verified
7. Entitlement is granted ONLY after admin verification

---

## Testing Commands

```bash
# Typecheck
npm run check

# Run all tests (unit + integration)
npm run test:unit

# Watch mode
npm run test:watch

# E2E tests (requires server running on port 5001)
npx playwright test

# Lint
npx eslint client/src server --ext .ts,.tsx

# Production build
npm run build
```

---

## Database Commands

```bash
# Push schema changes to Supabase
npm run db:push

# Generate migration (if using migrations instead of push)
npx drizzle-kit generate

# Seed demo data
npx tsx server/seed.ts
```

---

## Deployment Notes

- Frontend builds to `dist/public/`
- Backend builds to `dist/index.js`
- Vercel: set root as `/`, build command `npm run build`, output dir `dist/public`
- All env vars must be set in Vercel dashboard (never committed)
- `SUPABASE_SERVICE_ROLE_KEY` is server-only — never expose to client builds

---

## "Do Not Overbuild" Rule

> Do not add product features without a user/business reason backed by evidence.

V1 scope is defined in `docs/product-roadmap.md`. Features outside V1 scope must be:
1. Documented in `docs/known-limitations.md`
2. Behind a feature flag if partially implemented
3. Never broken or dead-ended (graceful "coming soon" if surfaced in UI)

---

## Admin Setup

1. Register a user account normally
2. Manually set `roles` to `["admin","user"]` in the `users` table
3. This user can then access `/admin` routes
4. First admin must be created via direct DB update (one-time bootstrap)

---

## Architecture Decisions (see docs/product-decisions.md for full rationale)

1. Vite + Express + Drizzle kept (not migrated to Next.js) — working stack, no migration value
2. JWT auth (not sessions) — stateless, simpler for current scale
3. Manual payments only in V1 — no gateway credentials
4. No AI in V1 — `ENABLE_AI_OPERATOR=false`, placeholder UI only
5. Drizzle `db:push` for schema (not migrations) — acceptable for early stage
6. All content (sprint days, radar, vault) is data-driven from DB, not hardcoded

---

## Critical User Funnel

```
Homepage → Diagnosis → Result → Sprint Purchase → Signup →
Onboarding → Project Creation → Sprint Day 0 → Day 1-7 →
Community Invitation → Membership
```

Every step of this funnel must work end-to-end without errors.

---

## Known V1 Limitations (see docs/known-limitations.md)

- No email sending (notifications are in-app only)
- No real payment gateway (manual InstaPay reference flow)
- No AI assistant (feature flagged off)
- No DMs
- No mobile native app
- No advanced recommendation engine
- Admin setup requires manual DB update for first admin
