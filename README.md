# FIFA---Wilkins

![CI](https://github.com/FTHTrading/FIFA---Wilkins/actions/workflows/ci.yml/badge.svg)

> FTHTrading x Wilkins Media Global Guest OS for the Atlanta-area FIFA moment: a production-grade, white-label multilingual fan operations platform with live wayfinding, cultural concierge, deterministic safety flows, sponsor monetization, and operator analytics.

## Table Of Contents

1. [System Snapshot](#system-snapshot)
2. [Color-Coded Stack](#color-coded-stack)
3. [One-Button Activation](#one-button-activation)
4. [Live Demo Surfaces](#live-demo-surfaces)
5. [Architecture Flowcharts](#architecture-flowcharts)
6. [Repository Map](#repository-map)
7. [White-Label Branding](#white-label-branding)
8. [GitHub Pages Demo](#github-pages-demo)
9. [Environment And Infra](#environment-and-infra)
10. [API And Monetization](#api-and-monetization)
11. [Operations Docs](#operations-docs)
12. [Push To GitHub](#push-to-github)

## System Snapshot

This repository is set up to demo and operate a FIFA-ready guest experience for Atlanta with four live surfaces and a shared API/data plane:

- Guest PWA for fans in 10 languages
- Staff console for translated assistance and escalation
- Admin console for campaign and revenue reporting
- Admin CMS for venue, translation, and event operations
- NestJS API with pgvector RAG, sponsor injection, WebSockets, PostgreSQL, and Redis

| Surface | Port | Outcome |
|---|---:|---|
| Guest Web | `3000` | Fan map, concierge, rewards, translation, emergency |
| Admin | `3001` | Event ops, POIs, emergency phrases, translation review |
| Staff Console | `3002` | Queue handling, quick replies, incident support |
| Admin Console | `3003` | Revenue, campaign performance, language and intent analytics |
| API | `4000` | REST, WebSockets, Swagger, orchestration |
| PostgreSQL | `5432` | Tenant, event, venue, rewards, campaign, RAG data |
| Redis | `6379` | Queueing, cache, translation jobs |

## Color-Coded Stack

| Zone | Color | Hex | Responsibility |
|---|---|---|---|
| Guest Experience | Blue | `#3B82F6` | PWA, map, rewards, translation, event UX |
| Staff Operations | Emerald | `#22C55E` | Guest assistance, escalations, queue workflows |
| Admin / Control | Violet | `#7C3AED` | Content operations, approvals, event control |
| Sponsor / Revenue | Fuchsia | `#C026D3` | Campaigns, monetization, premium placements |
| AI / Agentic | Amber | `#D97706` | Intent parsing, RAG, cultural ranking |
| Safety / Emergency | Red | `#EF4444` | Approved phrases, medical routing, alerts |
| Data / Storage | Slate | `#334155` | PostgreSQL, Redis, analytics, logs |
| Integration | Orange | `#EA580C` | Mapbox, OCR, voice, translation providers |

## One-Button Activation

The fastest local path on Windows is the FTHTrading launcher:

```powershell
pnpm activate:fth
```

What it does:

1. Copies the active white-label brand pack into the Pages demo.
2. Creates `.env` from `.env.example` if needed.
3. Installs dependencies unless you skip install.
4. Starts PostgreSQL and Redis with Docker Compose.
5. Generates Prisma client, runs migrations, and seeds Atlanta demo data.
6. Starts the full Turborepo dev stack in a new PowerShell window.
7. Opens the key demo URLs in your browser.

Direct launcher usage:

```powershell
.\scripts\activate-wilkins.ps1 -Brand fthtrading-fifa-wilkins
```

Useful switches:

- `-NoBrowser` to skip opening URLs
- `-SkipInstall` to skip `pnpm install`
- `-PagesOnly` to sync branding into the Pages demo without starting the stack

## Live Demo Surfaces

| Surface | URL | Demo Value |
|---|---|---|
| Guest Experience | `http://localhost:3000` | Multilingual navigation, concierge, rewards, sponsor placements |
| Map Experience | `http://localhost:3000/event/map` | Venue discovery, sponsor cards, cultural POIs |
| Admin Revenue | `http://localhost:3003/dashboard` | Revenue-forward executive summary |
| Full Analytics | `http://localhost:3003/analytics` | Revenue by language, intent, zone, campaign |
| Staff Operations | `http://localhost:3002` | Multilingual assistance queue |
| CMS / Control | `http://localhost:3001` | Event and content management |
| Swagger | `http://localhost:4000/docs` | API proof for technical buyers |

## Architecture Flowcharts

### End-To-End Guest Flow

```mermaid
flowchart LR
    A[Fan Opens Guest PWA] --> B[Language + Context Capture]
    B --> C[Agentic Concierge]
    C --> D[Intent Parser]
    D --> E[RAG + Cultural Ranker]
    E --> F[Venue / City / Sponsor Results]
    F --> G[Map + Rewards + CTA]
    D --> H[Emergency Path]
    H --> I[Approved Phrase + Staff Escalation]
```

### Platform And Infrastructure

```mermaid
flowchart TB
    subgraph Frontend[Frontend Surfaces]
      Web[Guest Web 3000]
      Admin[Admin 3001]
      Staff[Staff Console 3002]
      Revenue[Admin Console 3003]
    end

    subgraph Core[Core Services]
      API[NestJS API 4000]
      PG[(PostgreSQL 16)]
      Redis[(Redis 7)]
      RAG[pgvector RAG]
    end

    subgraph Integrations[External Integrations]
      Mapbox[Mapbox / OSM]
      Azure[Translation / OCR / Speech]
    end

    Web --> API
    Admin --> API
    Staff --> API
    Revenue --> API
    API --> PG
    API --> Redis
    API --> RAG
    API --> Mapbox
    API --> Azure
```

### Sponsor Revenue Loop

```mermaid
flowchart LR
    A[Guest Intent] --> B[Eligible Campaign Match]
    B --> C[Transparent Sponsor Injection]
    C --> D[Impression / Click Event]
    D --> E[Revenue Attribution]
    E --> F[Admin Console Dashboard]
    F --> G[Campaign Optimization]
    G --> B
```

For deeper diagrams, see [infra/diagrams/system-overview.mmd](infra/diagrams/system-overview.mmd) and [docs/architecture/system-overview.md](docs/architecture/system-overview.md).

## Repository Map

```text
apps/
  web/             guest PWA
  api/             NestJS + Prisma + WebSockets
  admin/           event operations CMS
  staff-console/   translator + assistance workflow
  admin-console/   revenue + campaign analytics

packages/
  agentic/         concierge logic and interfaces
  analytics/       reporting models
  campaigns/       sponsor rules and rewards
  config/          shared tailwind + tsconfig
  emergency/       deterministic safety language
  i18n/            locales and translation runtime
  lib/             utilities
  maps/            geo helpers and rankers
  types/           shared contracts
  ui/              design system

branding/
  brands/          white-label brand packs

docs/
  index.html       GitHub Pages demo site
  architecture/    system overview
  product/         positioning and demo script
  operations/      run guides
  api/             reference
```

## White-Label Branding

The repo now includes explicit brand packs for easy re-skinning and sales demos.

- Brand packs live in [branding/brands/default.json](branding/brands/default.json) and [branding/brands/fthtrading-fifa-wilkins.json](branding/brands/fthtrading-fifa-wilkins.json).
- The launcher copies the selected pack into `docs/brand.json` so the GitHub Pages demo instantly reflects the chosen client and event identity.
- This supports FTHTrading-owned demos today and straightforward conversion to new host cities, clubs, tournaments, or sponsors later.

Current default pack:

- Brand owner: `FTHTrading`
- Program: `FIFA x Wilkins`
- Market: `Atlanta, Georgia`
- Positioning: multilingual fan operations + sponsor monetization + safety layer

## GitHub Pages Demo

The repo includes a static demo site at [docs/index.html](docs/index.html) with:

- a branded hero
- architecture and infra sections
- color-coded capability cards
- live flowcharts rendered with Mermaid
- a commercial-ready overview for repo visitors and buyers

GitHub Actions deployment is configured in [.github/workflows/pages.yml](.github/workflows/pages.yml). Once GitHub Pages is enabled for the repository, pushes to `main` will publish the `docs/` folder.

## Environment And Infra

Base services come from [docker-compose.yml](docker-compose.yml):

- `postgres` for primary event and sponsor data
- `redis` for queueing and caching
- `api` for all business logic and integrations
- `web`, `admin`, `staff-console`, `admin-console` for the user-facing surfaces

Local boot prerequisites:

- Node.js 20+
- `pnpm` 9+
- Docker Desktop and Docker Compose

Environment variables are defined in [.env.example](.env.example).

## API And Monetization

Commercial proof points already surfaced in the product:

- multilingual intent engine across 10 languages
- deterministic emergency translations
- pgvector venue knowledge retrieval
- sponsor cards with transparent labeling
- rewards, badges, challenges, and coupon flows
- revenue dashboards by campaign, language, and intent

Key route groups:

- guest: `/api/v1/events`, `/api/v1/maps`, `/api/v1/agentic`, `/api/v1/translate`
- staff: `/api/v1/staff/queue`, `/api/v1/staff/respond`, `/api/v1/staff/escalate`
- campaigns: `/api/v1/campaigns/*`
- admin: `/api/v1/admin/*`

## Operations Docs

- [docs/product/overview.md](docs/product/overview.md)
- [docs/product/demo-script-5-minute.md](docs/product/demo-script-5-minute.md)
- [docs/operations/operations-guide.md](docs/operations/operations-guide.md)
- [docs/api/api-reference.md](docs/api/api-reference.md)
- [docs/runbooks/incident-response.md](docs/runbooks/incident-response.md)

## Push To GitHub

The target remote for this repository is:

```bash
https://github.com/FTHTrading/FIFA---Wilkins.git
```

Recommended sequence after local review:

```bash
git init
git branch -M main
git remote add origin https://github.com/FTHTrading/FIFA---Wilkins.git
git add .
git commit -m "Launch FIFA Wilkins public repo"
git push -u origin main
```# FIFA---Wilkins

![CI](https://github.com/FTHTrading/FIFA---Wilkins/actions/workflows/ci.yml/badge.svg)

> FTHTrading x Wilkins Media Global Guest OS for the Atlanta-area FIFA moment: a production-grade, white-label multilingual fan operations platform with live wayfinding, cultural concierge, deterministic safety flows, sponsor monetization, and operator analytics.

## Table Of Contents

1. [System Snapshot](#system-snapshot)
2. [Color-Coded Stack](#color-coded-stack)
3. [One-Button Activation](#one-button-activation)
4. [Live Demo Surfaces](#live-demo-surfaces)
5. [Architecture Flowcharts](#architecture-flowcharts)
6. [Repository Map](#repository-map)
7. [White-Label Branding](#white-label-branding)
8. [GitHub Pages Demo](#github-pages-demo)
9. [Environment And Infra](#environment-and-infra)
10. [API And Monetization](#api-and-monetization)
11. [Operations Docs](#operations-docs)
12. [Push To GitHub](#push-to-github)

## System Snapshot

This repository is set up to demo and operate a FIFA-ready guest experience for Atlanta with four live surfaces and a shared API/data plane:

- Guest PWA for fans in 10 languages
- Staff console for translated assistance and escalation
- Admin console for campaign and revenue reporting
- Admin CMS for venue, translation, and event operations
- NestJS API with pgvector RAG, sponsor injection, WebSockets, PostgreSQL, and Redis

| Surface | Port | Outcome |
|---|---:|---|
| Guest Web | `3000` | Fan map, concierge, rewards, translation, emergency |
| Admin | `3001` | Event ops, POIs, emergency phrases, translation review |
| Staff Console | `3002` | Queue handling, quick replies, incident support |
| Admin Console | `3003` | Revenue, campaign performance, language and intent analytics |
| API | `4000` | REST, WebSockets, Swagger, orchestration |
| PostgreSQL | `5432` | Tenant, event, venue, rewards, campaign, RAG data |
| Redis | `6379` | Queueing, cache, translation jobs |

## Color-Coded Stack

| Zone | Color | Hex | Responsibility |
|---|---|---|---|
| Guest Experience | Blue | `#3B82F6` | PWA, map, rewards, translation, event UX |
| Staff Operations | Emerald | `#22C55E` | Guest assistance, escalations, queue workflows |
| Admin / Control | Violet | `#7C3AED` | Content operations, approvals, event control |
| Sponsor / Revenue | Fuchsia | `#C026D3` | Campaigns, monetization, premium placements |
| AI / Agentic | Amber | `#D97706` | Intent parsing, RAG, cultural ranking |
| Safety / Emergency | Red | `#EF4444` | Approved phrases, medical routing, alerts |
| Data / Storage | Slate | `#334155` | PostgreSQL, Redis, analytics, logs |
| Integration | Orange | `#EA580C` | Mapbox, OCR, voice, translation providers |

## One-Button Activation

The fastest local path on Windows is the FTHTrading launcher:

```powershell
pnpm activate:fth
```

What it does:

1. Copies the active white-label brand pack into the Pages demo.
2. Creates `.env` from `.env.example` if needed.
3. Installs dependencies unless you skip install.
4. Starts PostgreSQL and Redis with Docker Compose.
5. Generates Prisma client, runs migrations, and seeds Atlanta demo data.
6. Starts the full Turborepo dev stack in a new PowerShell window.
7. Opens the key demo URLs in your browser.

Direct launcher usage:

```powershell
.\scripts\activate-wilkins.ps1 -Brand fthtrading-fifa-wilkins
```

Useful switches:

- `-NoBrowser` to skip opening URLs
- `-SkipInstall` to skip `pnpm install`
- `-PagesOnly` to sync branding into the Pages demo without starting the stack

## Live Demo Surfaces

| Surface | URL | Demo Value |
|---|---|---|
| Guest Experience | `http://localhost:3000` | Multilingual navigation, concierge, rewards, sponsor placements |
| Map Experience | `http://localhost:3000/event/map` | Venue discovery, sponsor cards, cultural POIs |
| Admin Revenue | `http://localhost:3003/dashboard` | Revenue-forward executive summary |
| Full Analytics | `http://localhost:3003/analytics` | Revenue by language, intent, zone, campaign |
| Staff Operations | `http://localhost:3002` | Multilingual assistance queue |
| CMS / Control | `http://localhost:3001` | Event and content management |
| Swagger | `http://localhost:4000/docs` | API proof for technical buyers |

## Architecture Flowcharts

### End-To-End Guest Flow

```mermaid
flowchart LR
    A[Fan Opens Guest PWA] --> B[Language + Context Capture]
    B --> C[Agentic Concierge]
    C --> D[Intent Parser]
    D --> E[RAG + Cultural Ranker]
    E --> F[Venue / City / Sponsor Results]
    F --> G[Map + Rewards + CTA]
    D --> H[Emergency Path]
    H --> I[Approved Phrase + Staff Escalation]
```

### Platform And Infrastructure

```mermaid
flowchart TB
    subgraph Frontend[Frontend Surfaces]
      Web[Guest Web 3000]
      Admin[Admin 3001]
      Staff[Staff Console 3002]
      Revenue[Admin Console 3003]
    end

    subgraph Core[Core Services]
      API[NestJS API 4000]
      PG[(PostgreSQL 16)]
      Redis[(Redis 7)]
      RAG[pgvector RAG]
    end

    subgraph Integrations[External Integrations]
      Mapbox[Mapbox / OSM]
      Azure[Translation / OCR / Speech]
    end

    Web --> API
    Admin --> API
    Staff --> API
    Revenue --> API
    API --> PG
    API --> Redis
    API --> RAG
    API --> Mapbox
    API --> Azure
```

### Sponsor Revenue Loop

```mermaid
flowchart LR
    A[Guest Intent] --> B[Eligible Campaign Match]
    B --> C[Transparent Sponsor Injection]
    C --> D[Impression / Click Event]
    D --> E[Revenue Attribution]
    E --> F[Admin Console Dashboard]
    F --> G[Campaign Optimization]
    G --> B
```

For deeper diagrams, see [infra/diagrams/system-overview.mmd](infra/diagrams/system-overview.mmd) and [docs/architecture/system-overview.md](docs/architecture/system-overview.md).

## Repository Map

```text
apps/
  web/             guest PWA
  api/             NestJS + Prisma + WebSockets
  admin/           event operations CMS
  staff-console/   translator + assistance workflow
  admin-console/   revenue + campaign analytics

packages/
  agentic/         concierge logic and interfaces
  analytics/       reporting models
  campaigns/       sponsor rules and rewards
  config/          shared tailwind + tsconfig
  emergency/       deterministic safety language
  i18n/            locales and translation runtime
  lib/             utilities
  maps/            geo helpers and rankers
  types/           shared contracts
  ui/              design system

branding/
  brands/          white-label brand packs

docs/
  index.html       GitHub Pages demo site
  architecture/    system overview
  product/         positioning and demo script
  operations/      run guides
  api/             reference
```

## White-Label Branding

The repo now includes explicit brand packs for easy re-skinning and sales demos.

- Brand packs live in [branding/brands/default.json](branding/brands/default.json) and [branding/brands/fthtrading-fifa-wilkins.json](branding/brands/fthtrading-fifa-wilkins.json).
- The launcher copies the selected pack into `docs/brand.json` so the GitHub Pages demo instantly reflects the chosen client and event identity.
- This supports FTHTrading-owned demos today and straightforward conversion to new host cities, clubs, tournaments, or sponsors later.

Current default pack:

- Brand owner: `FTHTrading`
- Program: `FIFA x Wilkins`
- Market: `Atlanta, Georgia`
- Positioning: multilingual fan operations + sponsor monetization + safety layer

## GitHub Pages Demo

The repo includes a static demo site at [docs/index.html](docs/index.html) with:

- a branded hero
- architecture and infra sections
- color-coded capability cards
- live flowcharts rendered with Mermaid
- a commercial-ready overview for repo visitors and buyers

GitHub Actions deployment is configured in [.github/workflows/pages.yml](.github/workflows/pages.yml). Once GitHub Pages is enabled for the repository, pushes to `main` will publish the `docs/` folder.

## Environment And Infra

Base services come from [docker-compose.yml](docker-compose.yml):

- `postgres` for primary event and sponsor data
- `redis` for queueing and caching
- `api` for all business logic and integrations
- `web`, `admin`, `staff-console`, `admin-console` for the user-facing surfaces

Local boot prerequisites:

- Node.js 20+
- `pnpm` 9+
- Docker Desktop and Docker Compose

Environment variables are defined in [.env.example](.env.example).

## API And Monetization

Commercial proof points already surfaced in the product:

- multilingual intent engine across 10 languages
- deterministic emergency translations
- pgvector venue knowledge retrieval
- sponsor cards with transparent labeling
- rewards, badges, challenges, and coupon flows
- revenue dashboards by campaign, language, and intent

Key route groups:

- guest: `/api/v1/events`, `/api/v1/maps`, `/api/v1/agentic`, `/api/v1/translate`
- staff: `/api/v1/staff/queue`, `/api/v1/staff/respond`, `/api/v1/staff/escalate`
- campaigns: `/api/v1/campaigns/*`
- admin: `/api/v1/admin/*`

## Operations Docs

- [docs/product/overview.md](docs/product/overview.md)
- [docs/product/demo-script-5-minute.md](docs/product/demo-script-5-minute.md)
- [docs/operations/operations-guide.md](docs/operations/operations-guide.md)
- [docs/api/api-reference.md](docs/api/api-reference.md)
- [docs/runbooks/incident-response.md](docs/runbooks/incident-response.md)

## Push To GitHub

The target remote for this repository is:

```bash
https://github.com/FTHTrading/FIFA---Wilkins.git
```

Recommended sequence after local review:

```bash
git init
git branch -M main
git remote add origin https://github.com/FTHTrading/FIFA---Wilkins.git
git add .
git commit -m "Launch FIFA Wilkins public repo"
git push -u origin main
```