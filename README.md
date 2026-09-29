# Awal Beyaa | أول بيعة

Awal Beyaa helps Egyptian AI builders turn an existing digital product into a real buyer conversation, a clear offer, and a first evidence-based sales attempt. It does not promise or guarantee a sale.

## Stack

React 18, TypeScript, Vite, Wouter, TanStack Query, Tailwind/shadcn, Express 4, Drizzle ORM, and PostgreSQL. The interface is Arabic-first and RTL.

## Local Setup

Use Node.js 20 or later and PostgreSQL (Supabase is supported). Copy `.env.example` to `.env`, set `DATABASE_URL` and a random `SESSION_SECRET` of at least 32 characters, then:

```bash
npm ci
npm run db:push
npm run seed
npm run dev
```

The development app runs at `http://localhost:5000`; `/health` checks the database connection.

## Commands

```bash
npm run check
npm run test:unit
npm run build
npm start
```

Playwright is installed, but this repository does not yet contain an E2E suite or configured production-like test database. Do not point schema commands at production while developing.

## Configuration and Operations

See [Deployment](docs/DEPLOYMENT.md), [Architecture](docs/architecture.md), [Database](docs/database.md), and the [Launch Checklist](docs/launch-checklist.md). The first admin is bootstrapped by setting `roles` to `["admin","user"]` for a registered user through a controlled database operation.

Manual InstaPay claims require a private Supabase Storage bucket named `payment-proofs`, `SUPABASE_URL`, and the server-only `SUPABASE_SERVICE_ROLE_KEY`. Claims are never auto-verified. AI remains disabled and unimplemented in V1.

## Product Scope

See [Roadmap](docs/product-roadmap.md), [Known Limitations](docs/known-limitations.md), and [Product Decisions](docs/product-decisions.md). Seeded sprint lessons are product content, not user stories or evidence of customer outcomes.
