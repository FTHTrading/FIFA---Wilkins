# System Architecture — Wilkins Media Global Guest OS

## Overview

Wilkins Media Global Guest OS is a production-grade, white-label multilingual event platform. It serves international guests, staff, admins, sponsors, and city services around major live events.

---

## Architecture Principles

1. **Multi-tenant by design** — every data model scoped by organization + event
2. **Language-first** — every surface renders in the guest's chosen language
3. **Deterministic safety** — emergency content uses approved translations, never AI-generated
4. **Cultural intelligence** — recommendations ranked by cultural profile, not just proximity
5. **Sponsor transparency** — promoted placements clearly labeled, never override safety
6. **White-label ready** — tenant-level branding, config, and domain overrides

---

## System Layers

| Layer | Color | Hex | Responsibility |
|-------|-------|-----|----------------|
| Guest Experience | Blue | `#2563EB` | Fan app, navigation, multilingual UI |
| Staff Operations | Emerald | `#059669` | Staff queue, translator bridge, escalations |
| Admin / Control | Violet | `#7C3AED` | CMS, workflows, approvals, configuration |
| Maps / Geo | Cyan | `#0891B2` | Venue maps, geocoding, POIs, transit |
| AI / Agentic | Amber | `#D97706` | Intent parsing, tool routing, RAG, ranking |
| Emergency / Safety | Red | `#DC2626` | Hospitals, alerts, emergency phrases |
| Sponsor / Monetization | Fuchsia | `#C026D3` | Campaigns, targeting, promoted placements |
| Data / Storage | Slate | `#334155` | PostgreSQL, Redis, object storage |
| Integration | Orange | `#EA580C` | Mapbox, OCR, translation APIs, transit |
| Analytics / Insights | Indigo | `#4F46E5` | Dashboards, sponsor reporting, search failures |

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Monorepo | Turborepo 2.x + pnpm workspaces |
| Guest Web | Next.js 15 (App Router) + Tailwind + PWA |
| Staff Console | Next.js 15 (App Router) |
| Admin Console | Next.js 15 (App Router) + Recharts |
| Backend API | NestJS 10 + Fastify + Prisma |
| Database | PostgreSQL 16 |
| Queue / Cache | Redis 7 + BullMQ |
| Maps | Mapbox GL JS + Overpass/OSM |
| Translation | Azure Cognitive Services (swappable) |
| OCR | Azure Computer Vision |
| Speech | Azure Cognitive Services Speech |

---

## Data Flow

```
Guest (PWA) ──→ API Gateway ──→ Intent Parser ──→ Tool Router
                    │                                   │
                    ├──→ Maps Service ←─────────────────┤
                    ├──→ Translation Service             │
                    ├──→ Emergency Service ←─────────────┤
                    ├──→ Campaigns Service ←─────────────┤
                    ├──→ Staff Queue Service              │
                    └──→ Analytics Service               │
                                                         │
                    Tool Router ──→ Cultural Profile     │
                                ──→ RAG Retrieval        │
                                ──→ Sponsor Inject       │
```

---

## Diagrams

See `/infra/diagrams/` for Mermaid flowcharts:

- `system-overview.mmd` — full system topology
- `guest-flow.mmd` — guest user journey
- `staff-flow.mmd` — staff assistance workflow
- `admin-flow.mmd` — admin console capabilities
- `emergency-flow.mmd` — emergency escalation path
- `sponsor-engine-flow.mmd` — sponsor matching and injection

---

## Database

See `apps/api/prisma/schema.prisma` for the full Prisma schema.

Core domain models: Organization, Tenant, Event, Venue, VenueMap, VenuePOI, Restaurant, CityService, TranslationEntry, ApprovedPhrase, EmergencyPhrase, EmergencyIncident, AssistanceRequest, SponsorCampaign, SponsorRecommendation, CulturalProfile, GuestSession, AnalyticsEvent, SearchQueryLog.

---

## Deployment

- **Frontend**: Vercel or Cloudflare Pages
- **API**: Railway, Fly.io, AWS ECS, or containerized VPS
- **Database**: PostgreSQL managed instance
- **Cache**: Redis managed instance
- **Storage**: S3-compatible bucket
- **CI/CD**: GitHub Actions with preview deployments
