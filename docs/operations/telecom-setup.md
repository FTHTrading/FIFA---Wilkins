# Telecom Setup - Wilkins Media FIFA AI Connection System

## Primary Number

- `+1-888-827-3432`

## Public CTA Language

- Text FIFA
- Tap FIFA
- Call FIFA

## Required Environment Variables

```env
TELECOM_PROVIDER=telnyx
TELNYX_API_KEY=
TELNYX_PUBLIC_KEY=
TELNYX_MESSAGING_PROFILE_ID=
TELNYX_CONNECTION_ID=
TELNYX_PHONE_NUMBER=+18888273432
TELECOM_DEFAULT_EVENT_ID=
TELECOM_DEFAULT_VENUE_ID=mercedes-benz-stadium
TELECOM_PUBLIC_BASE_URL=http://localhost:3000
SHORT_LINK_BASE_URL=http://localhost:3000
```

## Telnyx Webhook Configuration

Configure these URLs in Telnyx messaging profile settings:

- Inbound SMS webhook: `https://<api-host>/api/v1/telecom/webhooks/telnyx/sms`
- Delivery status webhook: `https://<api-host>/api/v1/telecom/webhooks/telnyx/status`
- Voice webhook scaffold: `https://<api-host>/api/v1/telecom/webhooks/telnyx/voice`

## Flow Behavior

1. Inbound SMS arrives on `+1-888-827-3432`
2. Body and sender are normalized
3. Language and intent are classified
4. Emergency intent is handled first and bypasses sponsor logic
5. Concierge path uses existing map/RAG/sponsor systems
6. Reward path returns points and badge state
7. Outbound SMS is sent through Telnyx and logged for attribution

## Operational Guardrails

- Emergency always outranks sponsor monetization
- Sponsor injection is disabled on emergency/medical intent
- Every inbound/outbound interaction emits analytics events
- Escalations are persisted for staff follow-up
