# Design Guidelines: AI Prompt Library & Social Platform

## Design Approach

**Reference-Based Technical Polish**
Drawing inspiration from Linear's modern minimalism, GitHub's information density, and Notion's workspace clarity. This platform demands crystal-clear information hierarchy while maintaining approachability for mass adoption across all scientific and creative domains.

**Core Principles:**
- Technical clarity over decorative elements
- Scannable information architecture for rapid discovery
- Trust signals through consistent quality indicators (PQAS badges)
- Frictionless contribution flow to maximize viral growth
- Dense yet breathable layouts for power users

---

## Typography System

**Font Stack:**
- Primary: Inter (via Google Fonts CDN) - exceptional readability at all sizes, extensive weight range
- Monospace: JetBrains Mono - for prompt content, code snippets, technical metadata

**Hierarchy:**
- Hero Headlines: text-5xl md:text-6xl font-bold (60-72px)
- Page Titles: text-3xl md:text-4xl font-semibold (36-48px)
- Section Headers: text-2xl font-semibold (24px)
- Card Titles: text-lg font-semibold (18px)
- Body Text: text-base font-normal (16px)
- Metadata/Labels: text-sm font-medium (14px)
- Micro Copy: text-xs font-normal (12px)
- PQAS Scores: text-2xl font-bold with tabular-nums

**Weight Distribution:**
Use font-normal (400) for body, font-medium (500) for labels, font-semibold (600) for emphasis, font-bold (700) sparingly for critical CTAs and scores.

---

## Layout & Spacing System

**Tailwind Spacing Units:** Standardize on 4, 8, 12, 16, 20, 24 (p-4, gap-8, mb-12, py-16, mt-20, space-y-24)

**Container Strategy:**
- Max widths: max-w-7xl (1280px) for main content, max-w-prose (65ch) for long-form text
- Landing page sections: full-width with inner max-w-7xl containers
- App layout: sidebar 280px + main content area with max-w-6xl
- Prompt detail: max-w-4xl centered for readability

**Grid Patterns:**
- Feed cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Feature showcases: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8
- User profiles portfolio: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4
- Always stack to single column on mobile

**Vertical Rhythm:**
- Landing sections: py-20 md:py-32 for generous breathing room
- App content sections: py-12 md:py-16
- Card internal padding: p-6
- Form spacing: space-y-6 for groups, space-y-4 for related fields

---

## Component Library

### Navigation & Layout

**Header (Landing):**
- Sticky top, backdrop-blur with subtle border-b
- Logo left, nav links center, CTA buttons right
- Mobile: hamburger menu with slide-out drawer

**App Header:**
- Logo + search bar (40% width) + notification bell + profile dropdown
- Breadcrumb trail below on detail pages

**Sidebar (App):**
- Fixed 280px width on desktop, collapsible to icons on tablet, slide-over on mobile
- Primary nav (Explore, My Prompts, Following, Workflows)
- Secondary section (Domains tree-select, Top Tags)
- Bottom: User card with avatar + karma score

### Cards & Content

**Prompt Card (Feed):**
- Border with rounded-xl, hover:shadow-lg transition
- Header: Domain badge + PQAS ribbon (top-right corner)
- Title (text-lg font-semibold, 2-line clamp)
- Description (text-sm, 3-line clamp)
- Metadata row: AI model icons + tags (max 3 visible)
- Footer: User avatar + name, stats (uses/remixes/upvotes), bookmark icon
- Sponsored cards: subtle blue border-l-4 + "SPONSORED" label top-left

**PQAS Badge System:**
- Gold (90-100): Solid badge with star icon
- Silver (75-89): Outlined badge with check icon
- Bronze (60-74): Minimal badge with dot icon
- Display as pill: rounded-full px-3 py-1 with score number

**Comment Thread:**
- Nested with left border-l-2 and pl-4 for each depth level
- Avatar + username + timestamp in header
- Upvote/downvote arrows left of content
- Collapse/expand for deep threads (>3 levels)

### Forms & Inputs

**Prompt Creation Wizard:**
- Multi-step with progress indicator (1/5 steps)
- Large text areas with character counts
- Tag input with autocomplete dropdown
- AI model selector: checkbox grid with logos
- Image upload: drag-drop zone with preview thumbnails

**Search Interface:**
- Prominent search bar with icon, instant results dropdown
- Advanced filters: collapsible panel with multi-select, sliders, toggles
- Active filters displayed as dismissible pills above results

### Modals & Overlays

**Remix Modal:**
- Large centered modal (max-w-3xl)
- Side-by-side diff viewer (original left, fork right)
- Summary textarea at bottom
- Action buttons: Cancel (ghost), Fork & Edit (primary)

**Notification Center:**
- Dropdown from bell icon, max-h-96 overflow-scroll
- Grouped by date (Today, Yesterday, This Week)
- Unread: subtle background highlight
- Icons per notification type

### Data Visualization

**Karma Breakdown Chart:**
- Horizontal stacked bar showing 4 components
- Tooltip on hover with exact values
- Legend below with component names

**PQAS Ribbon (Prompt Detail):**
- Large hero display showing composite score (text-6xl)
- Breakdown cards below: Quality, Consistency, Safety, Efficiency
- Each card: icon + label + score with visual meter

**Lineage Graph (React Flow):**
- Nodes: rounded rectangles with avatar + PQAS badge
- Edges: curved lines with arrow
- Minimap bottom-right corner
- Zoom controls bottom-left

### Gamification Elements

**Badge Display:**
- Grid of earned badges (grayscale for locked)
- Hover reveals name + criteria
- Progress bar below for next tier

**Leaderboard Table:**
- Rank column with medal icons (top 3)
- Avatar + username + karma score
- Sparkline showing trend
- Sticky header on scroll

---

## Images & Visual Assets

**Hero Section (Landing):**
- Large hero with abstract gradient mesh background (purple/blue/cyan gradients)
- Overlay with semi-transparent backdrop-blur cards showcasing featured prompts
- No need for stock photography - use dynamic prompt cards as visual interest

**Prompt Cards:**
- User avatars: rounded-full, 40x40px in feeds, 80x80px in profiles
- AI model icons: use Font Awesome or Heroicons brand icons (20x20px)
- Domain icons: simple line icons from Heroicons (24x24px)

**Empty States:**
- Illustration-free approach using large icons + helpful text
- Example: "No prompts yet" with plus-circle icon from Heroicons

**Achievement Badges:**
- SVG icon library with consistent style (outlined, 2px stroke)
- Badge designs: shield/star/ribbon shapes with icons inside

**No stock photos needed** - the content (prompts, user contributions, PQAS scores) provides all visual interest. Use iconography and data visualization instead.

---

## Animation Strategy

**Minimal, Purposeful Motion:**
- Page transitions: none (instant navigation)
- Card hover: subtle shadow elevation (150ms ease)
- Badge unlock: confetti burst (once, 2s duration)
- PQAS score: count-up animation on first view
- Loading states: skeleton shimmer, spinner for actions
- Notification badge: gentle pulse animation

**Avoid:** Parallax scrolling, scroll-triggered animations, auto-playing carousels

---

This design system prioritizes **information density without clutter**, **instant recognition of quality signals (PQAS)**, and **frictionless contribution flows** to maximize viral engagement across all scientific and creative domains.