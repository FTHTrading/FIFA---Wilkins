# Wilkins Deep Dive: Online Maps + Multilingual + MCP Agentic RAG + Cultural Adaptation

## 1) What map data is online right now and useful for Wilkins

### Tier A: Venue-controlled data (highest trust)
- Venue CAD/GeoJSON floor plans and gates
- Event-run POIs (restrooms, first aid, exits, transport pickup)
- Sponsor zones, activation routes, emergency zones
- Update method: internal admin CMS, signed uploads, versioned snapshots

### Tier B: Commercial/global map services
- Mapbox vector basemap + geocoding/search APIs
- Runtime language and worldview parameters for localization
- Use cases: geocoding, address normalization, route labels, map rendering

### Tier C: Open public map and mobility feeds
- OpenStreetMap/Overpass for nearby amenities and civic infrastructure
- GTFS static/realtime for surrounding transit and disruptions
- City open data portals for events, roads, closures, and safety notices

## 2) How to ingest maps into this system

### Canonical pipeline
1. Collect source feed (Mapbox/OSM/GTFS/City/Partner APIs).
2. Normalize to Wilkins Geo Feature schema:
   - id, source, featureType, name, namesByLanguage
   - lat/lon, polygon/line geometry
   - category, tags, confidence, freshness timestamps
3. Deduplicate by geohash + normalized name + semantic category.
4. Enrich with translation policy:
   - static-approved for emergency and safety phrases
   - managed-dynamic for POI descriptions
   - live-conversational for ad hoc chat
5. Persist and index:
   - Postgres for canonical entities
   - Redis for hot geosearch cache
   - Vector store for cultural and concierge knowledge RAG
6. Publish to clients via API + websocket cache busting.

### Freshness strategy
- Tier A venue data: event ops push updates immediately
- Tier B geocoding: on-demand query with short cache TTL
- Tier C OSM/GTFS: pull every 5-15 minutes near event bbox

## 3) Multilingual map UX strategy

### Label strategy
- Use provider native language labels when available
- Apply fallback chain: guest language -> event default -> English
- Keep emergency labels human-approved only

### Worldview strategy
- Accept optional worldview from user profile for disputed boundaries
- Default to event governance worldview setting
- Audit worldview usage in analytics for governance reporting

### Search strategy
- Query in guest language first
- Expand with transliteration and alias dictionary
- Blend lexical search + geospatial distance + cultural relevance

## 4) MCP agentic RAG infrastructure (target design)

### Agent roles
- Map Ingest Agent: fetches and normalizes online geodata
- Cultural Context Agent: retrieves language/culture-specific etiquette and recommendations
- Safety Agent: prioritizes emergency/safety content over promotional content
- Route Agent: synthesizes walking/transport options and constraints

### MCP tool contract categories
- geo.search
- geo.reverse
- geo.nearby
- transit.realtime
- culture.retrieve
- translation.rewrite
- emergency.escalate

### RAG memory layers
- Short-term session memory: current guest route intent and recent interactions
- Event memory: venue-specific rules and event-day updates
- Cultural memory: per-language and per-origin preference priors
- Governance memory: blocked/sensitive content and emergency overrides

### Retrieval ranking formula
score = 0.35 * semantic + 0.25 * geospatial + 0.20 * freshness + 0.10 * language_match + 0.10 * safety_priority

## 5) Adaptive learning by culture and surrounding areas

### Cultural profile dimensions
- language and script preference
- dietary pattern
- transport modality preference
- queue tolerance and walking tolerance
- accessibility needs
- risk sensitivity (night routing, crowd density)

### Learning loop
1. Observe implicit signals (clicks, dwell time, route acceptance).
2. Infer preference updates with bounded confidence.
3. Store profile deltas by event and city context.
4. Re-rank recommendations using profile priors.
5. Guardrails: never infer protected attributes for targeting or exclusion.

### Safety and fairness constraints
- No suppression of emergency guidance by personalization.
- Cultural adaptation must broaden options, not restrict critical access.
- Keep explainability fields: why_this_recommendation.

## 6) Concrete implementation path for this repo

### Phase 1 (now)
- Add Maps module scaffold (Mapbox + Overpass adapters)
- Add Agentic module scaffold (RAG retrieval + cultural profile)
- Add endpoints for map source health, nearby POI search, and adaptive concierge ranking

### Phase 2
- Add ingestion jobs using BullMQ
- Add vector indexing for cultural docs and venue guides
- Integrate map page in web app with live source-backed POIs

### Phase 3
- Add online learning loop and profile update events
- Add multilingual map search optimization and worldview controls
- Add dashboard for map freshness, source quality, and recommendation drift

## 7) Operational KPIs
- POI freshness under 15 min for surrounding area feeds
- Translation acceptance rate by language
- Route success rate (accepted route / suggested route)
- Emergency response acknowledgement latency
- Cultural recommendation click-through and completion rates
