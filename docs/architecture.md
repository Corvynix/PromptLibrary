# Architecture

- `client/`: React single-page application, Arabic-first RTL, served by Express in production.
- `server/routes/`: Express API routers. `server/routes.ts` mounts them under `/api`.
- `server/middleware/`: database-backed authentication, role checks, rate limits, and feature gates.
- `server/services/`: diagnosis logic, feature flags, and entitlement checks.
- `shared/`: Drizzle schema and shared API validation/types.
- PostgreSQL is accessed only by the server through Drizzle. JWTs are currently stored in browser localStorage and sent as bearer tokens.

Payment state and entitlement grants are server-controlled. Admin review updates the payment, grants access, writes an in-app notification, and audits the action in one database transaction. Manual proof files are private in Supabase Storage and admins receive five-minute signed URLs.

Rate limits and feature-flag caches are process-local. Use one app instance for the current deployment shape; multi-instance operation needs shared rate-limit/cache storage. Public feature APIs are gated server-side. AI is intentionally absent in V1.
