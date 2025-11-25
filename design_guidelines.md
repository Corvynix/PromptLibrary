# Design Guidelines: Viral AI Prompt Library & Social Platform

## Design Approach

**Reference-Based Social Platform**
Drawing from ProductHunt's engagement mechanics, Linear's technical polish, and Notion's workspace clarity. This platform balances professional credibility with creative energy to appeal across all domains—engineering, medicine, arts, science, and beyond.

**Core Principles:**
- Quality signals front and center (PQAS badges dominate visual hierarchy)
- Viral engagement loops through social proof and gamification
- Information density with breathing room for scan-ability
- Frictionless sharing and remix flows
- Trust through transparency (scores, karma, lineage)

---

## Typography System

**Font Stack:**
- Primary: Inter (Google Fonts) - all UI, body text, labels
- Monospace: JetBrains Mono - prompt code, technical content

**Hierarchy:**
- Hero Headlines: text-5xl md:text-6xl font-bold
- Page Titles: text-3xl md:text-4xl font-semibold
- Section Headers: text-2xl font-semibold
- Card Titles: text-lg font-semibold
- Body: text-base font-normal
- Metadata: text-sm font-medium
- Micro Copy: text-xs
- PQAS Scores: text-3xl md:text-4xl font-bold tabular-nums

---

## Layout & Spacing System

**Tailwind Units:** 4, 8, 12, 16, 24 (p-4, gap-8, py-16, mb-24)

**Container Strategy:**
- Landing sections: max-w-7xl centered
- App feed: max-w-6xl with 280px fixed sidebar (desktop)
- Prompt detail: max-w-4xl for readability
- Modals: max-w-3xl

**Grid Patterns:**
- Feed cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- User portfolios: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4
- Feature sections: grid-cols-1 md:grid-cols-3 gap-8

**Vertical Rhythm:**
- Landing sections: py-20 md:py-32
- App sections: py-12 md:py-16
- Card padding: p-6
- Form groups: space-y-6

---

## Component Library

### Navigation & Headers

**Landing Header:**
- Sticky with backdrop-blur-lg
- Logo left, nav center (Explore, Creators, Workflows, PQAS)
- CTA buttons right (Login, Join Free - gradient background)
- Mobile: slide-out drawer

**App Header:**
- Search bar (50% width, prominent positioning)
- Icons: Notifications (with red dot), Messages, Profile dropdown
- Breadcrumbs below on detail pages

**App Sidebar (280px):**
- Logo + collapse toggle
- Primary nav with icons (Feed, Discover, My Prompts, Following)
- Domain filter tree-select (collapsible)
- Trending tags (top 5 with post counts)
- User karma card at bottom (avatar, username, score with sparkline)

### Cards & Feed

**Prompt Card:**
- Rounded-xl border with hover:shadow-xl transition
- Corner ribbon: PQAS score with gradient background (gold/silver/bronze)
- Domain badge (top-left, small pill)
- Title: text-lg font-semibold, 2-line clamp, link underline on hover
- Description: text-sm, 3-line clamp
- Model tags: small pills with AI icons, max 3 visible + "+2 more"
- Engagement row: upvote count + button, remix count, bookmark icon
- Footer: avatar (32px) + username + "3h ago"
- Sponsored: subtle gradient border-l-4 + "SPONSORED" label

**Featured Prompt Card (Hero):**
- Larger format: p-8, gradient background overlay
- PQAS badge prominent (text-4xl)
- "Featured" label with star icon
- Larger title (text-2xl)
- Full description visible
- Primary CTA: "View Prompt" button

### Social Features

**User Profile Card:**
- Large avatar (120px) centered
- Username (text-2xl font-bold)
- Bio (text-sm, max-w-prose)
- Stats row: Karma • Prompts • Followers • Following (clickable)
- Follow/Unfollow button (prominent)
- Badge showcase below (earned badges, 48px each)

**Activity Feed Item:**
- Avatar + username in header
- Action text: "remixed [Prompt Title]" or "earned [Badge Name]"
- Preview card of affected prompt/achievement
- Timestamp + engagement (upvotes, comments)

**Comment Thread:**
- Nested with border-l-2, pl-4 per level
- Upvote/downvote inline left of avatar
- Username (font-semibold) + verified badge + karma score
- Collapse toggle for threads >3 deep

### Forms & Creation

**Prompt Upload Flow:**
- Progress stepper (5 steps, filled circles for completed)
- Step 1: Title + Description (large textareas with char counts)
- Step 2: Tags (autocomplete input with pill display)
- Step 3: AI Models (checkbox grid with logos)
- Step 4: Domain selection (dropdown with icons)
- Step 5: Preview card before publish
- Bottom actions: Back (ghost), Save Draft (outlined), Publish (gradient primary)

**Search & Discovery:**
- Large search input with icon, rounded-2xl
- Instant dropdown results (grouped: Prompts, Users, Tags)
- Filters panel (collapsible): PQAS range slider, domains multi-select, models checkboxes, sort dropdown
- Active filters: dismissible pills above results

### Gamification & Scores

**PQAS Display (Prompt Detail):**
- Hero section with massive score (text-6xl font-bold)
- Gradient background matching tier (gold/silver/bronze)
- Icon (star/check/dot) beside score
- Breakdown grid below: 4 cards showing Quality, Consistency, Safety, Efficiency
- Each card: icon + label + score + horizontal meter bar

**Karma Breakdown:**
- Horizontal stacked bar (4 segments with distinct gradients)
- Tooltip on hover showing exact values
- Legend below: Prompts Created • Remixes • Upvotes Received • Quality Bonus

**Badge Showcase:**
- Grid display: unlocked badges in full vibrancy, locked in grayscale opacity-30
- Hover tooltip: badge name + criteria + progress bar
- Rarity indicators: Common (bronze ring), Rare (silver), Epic (gold), Legendary (gradient ring)

**Leaderboard:**
- Table with sticky header
- Rank (medals for top 3), Avatar, Username, Karma (with trend sparkline), Top Domain
- Current user highlighted row

### Data Visualization

**Lineage Graph (React Flow):**
- Nodes: rounded rectangles with mini PQAS badge
- Original prompt: larger node with gradient border
- Edges: curved arrows
- Zoom controls + minimap (bottom-right)
- Node click: quick preview modal

**Engagement Chart:**
- Line chart showing upvotes/remixes/views over time
- Toggle buttons: 7D, 30D, 90D, All Time
- Tooltips on data point hover

### Modals & Overlays

**Remix Modal:**
- Split view: original (left), your fork (right)
- Diff highlighting for changes
- Summary textarea at bottom
- Actions: Cancel (ghost), Fork & Edit (primary gradient)

**Share Modal:**
- Quick copy link button
- Social share buttons (Twitter, LinkedIn, Discord with icons)
- Embed code snippet (monospace)
- QR code generator option

**Notification Dropdown:**
- Max-h-96 with scroll
- Grouped by date headers
- Unread: subtle background highlight + blue dot
- Icons per type (upvote, comment, follow, remix, badge)
- "Mark all read" link at bottom

---

## Images & Visual Assets

**Hero Image (Landing Page):**
Large, full-width hero section (min-h-[600px]) featuring a vibrant abstract gradient mesh background (purple, blue, cyan, pink gradients blending). Overlay this with a semi-transparent grid of 6 featured prompt cards (3x2 on desktop, 2x3 on tablet, stacked on mobile) showcasing real PQAS scores and diverse domains. Cards should have subtle backdrop-blur and appear to float over the gradient. Center the main headline and CTA buttons with backdrop-blur-md rounded backgrounds for legibility.

**User Avatars:**
Rounded-full throughout: 32px in feeds, 48px in comments, 80px in profiles, 120px in profile headers. Fallback to colorful initials with gradient backgrounds when no image uploaded.

**AI Model Icons:**
Use Font Awesome or Heroicons brand icons (24px) in pill tags. Include: OpenAI, Anthropic, Google, Meta, Mistral logos.

**Domain Icons:**
Line icons from Heroicons (32px): BeakerIcon (science), CodeBracketIcon (engineering), HeartIcon (medicine), PaintBrushIcon (arts), etc.

**Achievement Badges:**
Custom SVG designs with consistent 2px stroke outlined style. Shield, star, and ribbon shapes containing domain-specific icons. Use gradient fills for rarity tiers.

**Empty States:**
Large Heroicon (96px, opacity-20) centered above helpful text. Examples: "No prompts yet - create your first!", "You're not following anyone - discover creators"

---

## Animation Strategy

**Viral Engagement Animations:**
- Upvote button: scale(1.2) + color fill animation (300ms)
- Badge unlock: confetti particle burst (2s, once)
- PQAS score reveal: count-up animation on scroll into view
- New follower: gentle slide-in notification toast
- Karma increase: number ticker with green glow pulse

**Micro-interactions:**
- Card hover: shadow-xl + subtle lift (-2px translateY)
- Button hover: handled by component (no custom on images)
- Loading: skeleton shimmer pulse
- Infinite scroll: spinner at bottom

**Avoid:** Parallax, auto-play carousels, excessive scroll animations

---

## Call-to-Action Strategy

**Landing Page CTAs:**
- Hero: Large gradient button "Get Started Free" + ghost "View Top Prompts"
- Section CTAs: "Join 50K+ Creators" with user avatar stack social proof
- Footer: "Start Sharing Prompts Today" with email signup

**App CTAs:**
- Floating "Create Prompt" button (bottom-right, gradient background, plus icon)
- Follow buttons: prominent on profiles, subtle in cards
- Share everywhere: icon button with share icon, opens modal

**Social Proof Integration:**
- User count ticker in header ("125,342 prompts shared")
- Live activity feed in sidebar ("Sarah just earned Gold Badge")
- Testimonial avatars in landing sections

This design system optimizes for **viral growth through visible quality signals, frictionless engagement, and strategic gamification** while maintaining **professional credibility across all domains**.