# Database

`shared/schema.ts` is the source of truth. Apply schema changes with Drizzle (`npm run db:push`) after reviewing the diff and backing up the target database. Use staging first; production changes are not applied by this repository automatically.

`npm run seed` idempotently inserts feature-flag defaults, site-setting defaults, the first-sale sprint product, and its eight day records. It does not create fake users, testimonials, community activity, or payment records. Set actual payment-recipient details through admin configuration.

The first admin is bootstrapped through a controlled database update of the registered user's `roles` field to `["admin","user"]`; remove any temporary elevated access after verification. The backend owns database authorization; browser code never connects to PostgreSQL directly. Supabase RLS policies are not configured for this custom-JWT/server-only database architecture and must be designed before exposing tables through Supabase client APIs.
