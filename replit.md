# Viral AI Prompt Library & Social Platform

## Overview

A production-grade social platform for sharing, discovering, and remixing AI prompts across all domains and AI models. The platform combines a comprehensive prompt library with social features, quality scoring (PQAS), karma-based reputation, and viral engagement mechanics. Built to scale to millions of users with zero platform fees, using open-source scoring models and free-tier infrastructure.

**Key Features:**
- Multi-format prompt support (text, image, video) across all domains (Engineering, Medicine, Science, Arts, etc.)
- PQAS (Prompt Quality Assessment System) - rule-based scoring across 6 dimensions
- Social engagement layer with follows, comments, votes, and activity feeds
- Karma/reputation system with transparent algorithm
- Badge and achievement system with automatic detection
- Visual remix editor for prompt workflows and lineage tracking
- Multi-view feeds (Trending, New, Editor's Choice)
- PWA-ready with mobile-first responsive design

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling:**
- React 18+ with TypeScript via Vite build system
- Wouter for client-side routing (lightweight React Router alternative)
- TanStack Query (React Query) for server state management and caching
- Tailwind CSS with shadcn/ui component library (Radix UI primitives)
- Form handling via React Hook Form with Zod validation

**Design System:**
- Typography: Inter (primary UI), JetBrains Mono (code/technical content)
- Component library: shadcn/ui with "new-york" style preset
- Custom design tokens for light/dark mode theming
- Responsive breakpoints: mobile-first (md: 768px, lg: 1024px)
- Layout patterns: max-w-7xl landing, max-w-6xl feed, max-w-4xl detail pages

**State Management:**
- Authentication context (AuthProvider) with JWT token in localStorage
- React Query for all API data fetching with cache invalidation
- Local component state via hooks for UI interactions

**Key Pages:**
- Landing: Marketing page with hero, stats, features, domain showcase
- Feed: Multi-tab view (Trending/New/Editor's Choice) with infinite scroll capability
- Prompt Detail: Full prompt view with PQAS scores, version history, lineage graph
- Create Prompt: Multi-step wizard supporting text/image/video prompt types
- User Profile: Portfolio view with karma breakdown, badges, and user prompts

### Backend Architecture

**Framework:**
- Express.js with TypeScript for REST API
- Development: tsx with Vite middleware for hot reloading
- Production: esbuild-bundled single file deployment

**API Design:**
- RESTful endpoints under `/api` namespace
- JWT-based authentication with bcrypt password hashing
- Role-based access control middleware (guest → super_admin)
- Request/response logging for observability

**Authentication & Authorization:**
- JWT tokens generated with jsonwebtoken library
- Token stored in localStorage, passed via Authorization header
- Role hierarchy: guest, user, moderator, curator, org_admin, super_admin
- Row-level security enforced at query level

**Core Services:**
- **PQAS Service** (`server/services/pqas.ts`): Rule-based prompt quality scoring using readability metrics, structural analysis, and safety checks. Scores 6 dimensions: clarity, specificity, effectiveness, consistency, safety, efficiency. Returns composite score 0-100.
- **Karma Service** (`server/services/karma.ts`): Calculates user reputation using published algorithm: 0.40×avg_pqas + 0.25×remix_success_rate + 0.20×engagement + 0.15×referrals. Stores breakdown in user.metrics JSONB field.
- **Badge Service** (`server/services/badges.ts`): Automatic badge detection and awarding based on configurable JSON criteria. Checks prompt counts, PQAS thresholds, remix success, engagement milestones.

**Key Endpoints:**
- `POST /api/auth/login` - Email/password authentication
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Current user session
- `GET /api/prompts` - Feed with filtering (trending/new)
- `GET /api/prompts/:slug` - Prompt detail with versions
- `POST /api/prompts` - Create new prompt
- `GET /api/users/:id` - User profile with karma
- `POST /api/follows` - Follow/unfollow users
- `POST /api/votes` - Upvote/downvote content

### Data Storage

**Database:** PostgreSQL via Neon serverless driver (@neondatabase/serverless)

**ORM:** Drizzle ORM with schema-first approach

**Schema Design:**
- **users**: Authentication, roles (JSONB array), karma score, metrics (JSONB for breakdown)
- **prompts**: Core prompt metadata with slug, type enum (text/image/video), industry/social tags (arrays), total uses counter
- **prompt_versions**: Versioning system with content (JSONB), PQAS scores (JSONB), model compatibility, status enum
- **remixes**: Lineage tracking with from_version_id → to_version_id relationships
- **workflows**: Multi-step prompt sequences with execution tracking
- **comments**: Threaded discussions with parent_id for nesting
- **votes**: Upvote/downvote tracking with vote_type enum
- **follows**: Social graph with user_id → followed_user_id
- **badges**: Achievement definitions with criteria (JSONB)
- **user_badges**: Many-to-many bridge with awarded_at timestamp
- **notifications**: User alerts with type enum, read status
- **usage_logs**: Prompt usage analytics
- **referrals**: Viral tracking with conversion counts
- **execution_logs**: Workflow execution history
- **admin_settings**: Platform configuration key-value store

**Indexing Strategy:**
- GIN indexes on JSONB fields (roles, tags, content, pqas_score)
- Full-text search via tsvector on prompt title/description
- Composite indexes on foreign keys + timestamps for feed queries
- Unique indexes on email, slug for data integrity

**Migration:** Drizzle Kit for schema migrations (`npm run db:push`)

### External Dependencies

**Infrastructure:**
- **Neon Database**: Serverless PostgreSQL with connection pooling via WebSockets
- **Deployment**: Designed for Replit with both dev (`server/index-dev.ts`) and production (`server/index-prod.ts`) entry points

**Authentication:**
- **bcrypt**: Password hashing (v6.0.0)
- **jsonwebtoken**: JWT token generation and validation

**UI Components:**
- **Radix UI**: Headless component primitives (@radix-ui/react-*)
- **shadcn/ui**: Pre-styled component library built on Radix
- **Lucide React**: Icon library
- **cmdk**: Command palette component
- **Vaul**: Drawer/modal primitives
- **Embla Carousel**: Carousel component
- **React Day Picker**: Calendar/date picker

**Development Tools:**
- **Vite**: Frontend build tool with hot module replacement
- **esbuild**: Backend production bundler
- **tsx**: TypeScript execution for development
- **Tailwind CSS**: Utility-first styling with PostCSS

**Planned Integrations:**
- **Open-source LLMs via Hugging Face**: For PQAS evaluation (currently rule-based) and auto-tagging (DistilBERT for classification)
- **Google AdSense**: Non-intrusive ad slots (sidebar, feed insertion every 6th item)

**Type Safety:**
- Drizzle Zod for runtime schema validation
- Shared types between client/server via `@shared/schema` path alias

**Notable Constraints:**
- Zero-cost architecture using free tiers and open-source alternatives
- No paid AI APIs (OpenAI, Anthropic, Google) - designed for OSS models
- Scalable to millions of users through efficient database design and caching