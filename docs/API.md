# API Overview

All endpoints are same-origin under `/api`. Authenticated endpoints require `Authorization: Bearer <JWT>`. JSON writes are validated on the server. Admin endpoints additionally require the current database role `admin`.

## Available Groups

- `/api/auth`: register, login, current user, onboarding.
- `/api/diagnose`: submit validated diagnosis answers and retrieve a result by UUID.
- `/api/projects`: authenticated project CRUD and updates.
- `/api/sprint`: public sprint information; authenticated enrollment, entries, prospects, outreach, and lead tracking.
- `/api/payments`: current user's claims, proof upload, and manual payment claim submission.
- `/api/community`: feed, posts, comments, likes, bookmarks, and reports. Feature-flagged.
- `/api/radar`, `/api/repos`, `/api/vault`: published data feeds. Feature-flagged.
- `/api/admin`: users, payment review, proof access, reports, site settings, and feature flags. Admin-only and rate-limited on writes.

## Payment Invariants

`POST /api/payments/proof` accepts JPEG, PNG, or PDF bytes up to 5 MB and returns a server-generated private object key. `POST /api/payments/initiate` requires a valid reference, proof key owned by the authenticated user, active sprint product when applicable, configured payment instructions, and enabled feature flags. Claims stay `submitted` until an admin verifies them. Verification/rejection only operates on `submitted` records; verification grants entitlement, records notification, and creates an audit log transactionally.

Exact request and response shapes are defined in `shared/types.ts` where shared between client and server, and validated at the route boundary with Zod. This document is an overview; use route definitions as the authoritative current API contract.
