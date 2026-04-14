# Wilkins Sponsor OS — 5-Minute Demo Script

## Audience
- Venue operators
- Event organizers
- Sponsor revenue teams
- Hospitality partners

## Core Narrative
Wilkins is not just translation. It is a multilingual guest operating system that combines intent-driven utility, cultural relevance, emergency trust, and sponsor/reward activation in one surface.

## Demo Goals
- Show utility-first adoption: map + concierge + emergency are valuable with zero sponsors.
- Show sponsor fit: promotions are attached to guest intent, not random ad inventory.
- Show cultural differentiation: language and cultural profile reshape ranking and offers.
- Show revenue controls: admin can target by language, intent, geo, and matchday windows.
- Show reward flywheel: passport badges, points, and coupon redemptions increase engagement.

## Pre-Demo Setup
1. Run baseline stack:
   ```bash
   pnpm install
   docker compose up postgres redis -d
   pnpm db:migrate
   pnpm --filter @wilkins/api db:seed
   npx ts-node scripts/seed-atlanta.ts
   pnpm dev
   ```
2. Open guest app: http://localhost:3000/event
3. Open admin campaign manager: http://localhost:3001/campaigns
4. Open admin dashboard: http://localhost:3001/dashboard

## 5-Minute Flow

### Minute 0:00-1:00 — Utility First (Guest Home)
- Start on home screen.
- Callout: quick intent chips + free text + language-aware scenarios.
- Trigger a realistic query:
  - Arabic scenario: "Halal near stadium"
  - Spanish scenario: "Hospital + directions"
- Click into map flow.

Positioning line:
- "We earn trust first by solving immediate guest needs in their own language."

### Minute 1:00-2:20 — Map + Cultural Sponsor Layer
- On map/results screen, show:
  - Auto-fit pins
  - Organic utility results
  - Clearly labeled "Official Partner" placement
- Explain ranking model:
  - `final_score = intent_match + cultural_match + proximity + trust + sponsor_priority + time_relevance`
- Show that sponsor appears as part of useful outcome, not a popup interruption.

Positioning line:
- "Sponsors are answer quality, not banner clutter."

### Minute 2:20-3:00 — Emergency Trust Layer
- Open emergency screen.
- Select critical phrase.
- Show full-screen translated phrase, report action, map route, and call action.

Positioning line:
- "In high-pressure moments, deterministic language and utility matter more than novelty."

### Minute 3:00-4:00 — Rewards and Passport Loop
- Open rewards page.
- Show points balance, badge passport, in-progress challenges, and coupon wallet.
- Highlight wallet-optional strategy:
  - No mandatory crypto onboarding
  - Optional export/collectible path later

Positioning line:
- "We keep rewards frictionless for casual visitors and extensible for advanced users."

### Minute 4:00-5:00 — Admin Monetization Controls
- Open campaign manager.
- Expand Campaign Composer and show targeting controls:
  - language
  - intent
  - geo radius
  - time window (pre-match/halftime/post-match)
  - reward object (coupon/badge/passport stamp)
- Open dashboard and show campaign performance + language and intent breakdown.

Positioning line:
- "This turns fan utility into measurable sponsor outcomes."

## Suggested Live Queries
- Arabic: "أحتاج طعام حلال قرب الملعب"
- Spanish: "hospital más cercano con direcciones"
- Portuguese: "vida noturna perto do estádio"
- French: "comment rentrer à mon hôtel en transport"
- Japanese: "最寄りのトイレはどこ"
- Korean: "호텔로 가는 교통편"

## Objection Handling
- "Is this just another event app?"
  - No: multilingual utility + cultural ranking + emergency + reward operations in one workflow.
- "Do users need wallets?"
  - No. Rewards are wallet-optional and frictionless by default.
- "Are official FIFA collectibles included?"
  - Only with explicit rights. Default positioning is Wilkins/host/sponsor reward objects.

## Commercial Packaging
- Tier 1: Smart Placement
  - Language-aware map/concierge placements + coupons
- Tier 2: Cultural Concierge
  - Cultural relevance targeting + intent routing + post-match flows
- Tier 3: Reward Engine
  - Passport challenges + badges + premium analytics

## Demo Close
- "Wilkins converts guest trust into sponsor performance without compromising safety or usability."
- "This is Sponsor OS built on guest utility, not ad interruption."
