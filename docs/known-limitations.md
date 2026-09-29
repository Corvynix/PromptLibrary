# Known Limitations

- No verified staging or production deployment, database migration, or end-to-end run has been performed.
- E2E tests and a disposable integration-test database are not configured; automated coverage is five unit tests (diagnosis and sprint-reflection validation). The Playwright browser binary is not installed in this environment.
- The landing page and TechShell navigation have Arabic and English copy. Most newly added account and product screens currently remain Arabic-only, so the language toggle does not translate every screen yet.
- Supabase Storage proof flow needs a private `payment-proofs` bucket and server credentials; uploaded files have no retention/deletion workflow yet.
- Feature-flag and rate-limit state is in-process and not shared across replicas.
- AI is not implemented. Email, gateway payments, subscription renewal/cancellation, and automated notifications are absent.
- Admin covers user bans, payment review, reports, settings, and flags; full CRUD for sprint lessons, radar, vault, announcements, and analytics dashboards is missing.
- Privacy, terms, refund, and community-guideline content needs founder details and qualified legal review before launch.
- Vercel serverless deployment has not been verified. Sitemap/canonical/structured metadata are generated only when the actual `SITE_URL` is configured; public indexing and production SEO have not been verified.
- Database schema changes have not been pushed to any live database.
