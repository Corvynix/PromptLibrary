# Deployment

## Supported Shape

The current production entry point is a long-running Node.js server (`npm run build` then `npm start`) serving both the API and built SPA. Deploy to a Node host that supports a persistent HTTP process. The repository does **not** currently provide a verified Vercel serverless adapter; do not use the old Vercel instructions.

## Environment

Set `NODE_ENV=production`, `PORT`, `SITE_URL` (the real HTTPS origin), `DATABASE_URL`, and a cryptographically random `SESSION_SECRET` with at least 32 characters. The production Vite build fails without an HTTPS `SITE_URL`; it generates canonical/OG metadata, structured website data, `robots.txt`, and `sitemap.xml`. For proof uploads, set `SUPABASE_URL` and the server-only `SUPABASE_SERVICE_ROLE_KEY`, and create a private Storage bucket named `payment-proofs`. Never define the service key with a `VITE_` prefix or put it in client code.

Set `TRUST_PROXY_HOPS` only when the host's proxy topology is known. Incorrect proxy trust breaks client-IP rate limits. See `.env.example` for the full list.

## Release Steps

1. Provision a staging PostgreSQL/Supabase project and private `payment-proofs` bucket.
2. Set staging environment variables and run `npm ci`, `npm run check`, `npm run test:unit`, and `npm run build`.
3. Review the Drizzle schema diff and apply `npm run db:push` to staging only. Back up production and schedule schema changes before applying them there.
4. Run `npm run seed` against staging; configure real InstaPay recipient details and pricing in `/admin`.
5. Bootstrap an admin account as documented in [Database](database.md), then manually test a submitted payment, proof review, reject/resubmit, and verify/entitlement flow.
6. Deploy the built server, enable HTTPS, configure database backups and host-level monitoring, then verify `/health` and the critical user funnel.

This project has not yet been tested against a provisioned staging database or deployed host. A successful build using a preview URL is not a production sign-off. Do not run `npm run db:push` against the configured live database from an agent session.
