# API Reference — Wilkins Media Global Guest OS

## Base URL

```
/api/v1
```

---

## Guest APIs

### Maps

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/maps/venues/:venueId/pois` | Venue POIs by category, translated |
| `GET` | `/maps/online/search` | Online geocoding + nearby amenities |
| `GET` | `/maps/health` | Maps service health check |

**Query params for `/maps/online/search`:**
- `q` — search query
- `lang` — ISO 639-1 language code
- `lat`, `lng` — center coordinates
- `worldview` — Mapbox worldview code

### Agentic Concierge

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/agentic/concierge-assist` | Intent-driven concierge with tool traces |

**Query params:**
- `q` — natural language query
- `lang` — guest language
- `venueId` — current venue
- `eventId` — current event
- `region` — cultural region hint
- `lat`, `lng` — guest location
- `worldview` — map worldview

**Response contract:**
```json
{
  "intent": "food",
  "toolsUsed": [{ "tool": "nearbyPOI", "durationMs": 45, "resultCount": 5 }],
  "profile": { "languageCode": "ar", "dietaryPreferences": ["halal"] },
  "venuePois": [],
  "nearbyAmenities": [],
  "sponsorRecommendations": [],
  "explanation": "..."
}
```

### Emergency

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/emergency/options` | Deterministic emergency phrase list |
| `GET` | `/emergency/phrases` | All active emergency phrases |
| `POST` | `/emergency/incidents` | Report an emergency incident |

### Translation

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/translate/text` | Translate text between languages |
| `POST` | `/translate/voice` | Speech-to-text + translate |
| `POST` | `/ocr/translate` | OCR image + translate extracted text |

### Events

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/events` | List published/live events |
| `GET` | `/events/:slug` | Event details by slug |
| `GET` | `/events/:slug/alerts` | Active alerts for an event |

---

## Staff APIs

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/staff/queue` | Pending assistance requests |
| `POST` | `/staff/respond` | Reply to an assistance request |
| `POST` | `/staff/escalate` | Escalate a request |

---

## Admin APIs

| Method | Path | Description |
|--------|------|-------------|
| `CRUD` | `/admin/events` | Manage events |
| `CRUD` | `/admin/venues` | Manage venues |
| `CRUD` | `/admin/pois` | Manage venue POIs |
| `CRUD` | `/admin/translations` | Translation review workflow |
| `CRUD` | `/admin/emergency-options` | Manage emergency phrases |
| `CRUD` | `/admin/campaigns` | Manage sponsor campaigns |
| `GET` | `/admin/analytics/summary` | Dashboard summary |

---

## Telecom APIs (Wilkins Media FIFA AI Connection System)

Primary number: `+1-888-827-3432`

Core CTA language:

- Text FIFA
- Tap FIFA
- Call FIFA

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/telecom/webhooks/telnyx/sms` | Inbound SMS webhook (Telnyx) |
| `POST` | `/telecom/webhooks/telnyx/status` | Delivery status webhook |
| `POST` | `/telecom/webhooks/telnyx/voice` | Voice webhook scaffold + SMS follow-up path |
| `POST` | `/telecom/send` | Manual outbound SMS send (ops/testing) |
| `GET` | `/telecom/summary` | Telecom analytics summary (inbound, language, intent, emergency, sponsor, rewards) |
| `GET` | `/telecom/health` | Provider and number health status |
| `GET` | `/telecom/cta` | Localized public CTA copy |

Telecom flow rules:

- Emergency always outranks sponsor logic
- Emergency messages use deterministic phrase handling
- Sponsor injection is suppressed during emergency/medical routing
- Rewards and sponsor offers are tracked as telecom-originated analytics events

---

## Authentication

- JWT bearer tokens for staff and admin routes
- Guest sessions are anonymous with `sessionId`
- Rate limiting: 20 req/s burst, 200 req/min sustained
