# Koriq - The MBA, Redesigned for Builders

## Overview

Koriq is a professional accelerator for builders. A focused, twelve-month MBA alternative centered on shipping real cases in public, learning within small elite cohorts, and achieving measurable business outcomes.

## System Architecture

### Frontend Architecture
- **Framework**: React 18+ with TypeScript via Vite.
- **Routing**: Wouter (lightweight).
- **State**: TanStack Query for server state.
- **Styling**: Tailwind CSS + shadcn/ui (Radix UI).
- **Animations**: Framer Motion.

### Backend Architecture
- **Framework**: Express.js with TypeScript.
- **Database**: PostgreSQL via Neon serverless driver.
- **ORM**: Drizzle ORM.
- **Auth**: JWT-based authentication with bcrypt.

### Key Workflows
- **Application Process**: Builder-first application flow to ensure cohort quality.
- **Case Management**: Tracking shipped cases and public outcomes.
- **Cohort Coordination**: Tools for small-group collaboration and networking.

## Deployment

Designed for high-performance delivery on Replit/Vercel/Railway.

- **Dev Entry**: `server/index-dev.ts`
- **Prod Entry**: `server/index-prod.ts`

© 2026 Koriq
