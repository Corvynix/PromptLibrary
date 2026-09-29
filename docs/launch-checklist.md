# Launch Checklist

## Required Before Public Launch

- [ ] Founder confirms product copy, prices, InstaPay recipient, support contact, privacy notice, terms, refund policy, and community rules.
- [ ] Qualified legal review of user-facing policies for the actual operator and jurisdiction.
- [ ] Provision staging PostgreSQL and a private `payment-proofs` Supabase Storage bucket.
- [ ] Set production secrets in the host dashboard; verify the service-role key is server-only and `SESSION_SECRET` is random and 32+ characters.
- [ ] Review and apply Drizzle schema changes to staging; test upgrade and backup/restore before production rollout.
- [ ] Seed content and flags in staging; verify settings and module-off behavior.
- [ ] Create admin account and verify all admin routes reject non-admin users.
- [ ] Test payment submit/upload, admin proof inspection, reject and resubmit, duplicate reference, concurrent review, and verified entitlement grant.
- [ ] Run full funnel E2E on 375px RTL and desktop, including browser console/network checks and basic keyboard/accessibility review.
- [ ] Configure host health monitoring, database backups, retention/deletion for payment proofs, and incident contact.
- [ ] Set the actual HTTPS `SITE_URL`; verify canonical/OG URLs, generated sitemap/robots, and search indexing behavior on the deployed domain.
- [ ] Run `npm run check`, `npm run test:unit`, and `npm run build` against the release commit.

## Verified Locally For This Change

- [x] TypeScript check
- [x] Unit tests (diagnosis and sprint reflection)
- [x] Client/server production build with a reserved local test hostname (not a deployable release artifact)

Those local checks do not replace the staging, legal, migration, security, and E2E gates above.
