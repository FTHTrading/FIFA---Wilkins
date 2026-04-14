# Runbook: Emergency Incident Response

## Trigger

An emergency incident is created when a guest taps an emergency phrase in the app.

## Severity Classification

| Phrase | Escalation Level | Response Time Target |
|--------|-----------------|---------------------|
| Need hospital | CRITICAL | < 2 min |
| Need police | CRITICAL | < 2 min |
| Need medical assistance | CRITICAL | < 2 min |
| Lost child | CRITICAL | < 2 min |
| Lost passport | HIGH | < 5 min |
| I am lost | MEDIUM | < 10 min |
| Need translator | MEDIUM | < 10 min |
| Need transportation | LOW | < 15 min |

## Response Steps

1. **Alert appears in staff console** — includes guest location, language, and phrase
2. **Staff acknowledges** — status changes from `open` to `acknowledged`
3. **Staff dispatches help** — contacts security, medical, or transport team
4. **Staff resolves** — marks incident as `resolved` with notes
5. **Analytics logged** — incident tracked for post-event reporting

## Escalation Rules

- CRITICAL incidents trigger audible alerts in staff console
- If not acknowledged within 5 minutes, escalate to supervisor
- Lost child triggers automatic security team notification
- Medical triggers automatic first aid station notification

## Post-Incident

- Review incident timeline in admin console
- Check response times against SLA targets
- Report trends to event organizers

---

# Runbook: Translation Queue Backup

## Trigger

Translation queue depth exceeds 100 pending items.

## Diagnosis

1. Check Redis connection: `redis-cli ping`
2. Check BullMQ worker status in API logs
3. Check translation provider API status (Azure/Google/DeepL)
4. Check rate limits on translation provider

## Resolution

1. If provider is down — switch to backup provider via env config
2. If rate limited — reduce batch size, enable queue throttling
3. If Redis issue — restart Redis, check memory usage
4. If worker crash — restart API service

---

# Runbook: Sponsor Campaign Not Displaying

## Trigger

Admin reports a sponsor campaign is not appearing to guests.

## Diagnosis

1. Check campaign status is `ACTIVE`
2. Check `startsAt` / `endsAt` window includes current time
3. Check `targetLanguages` includes guest's language (empty = all)
4. Check `placement` matches the surface being viewed
5. Check event ID matches current event

## Resolution

1. Update campaign dates if expired
2. Add missing languages to `targetLanguages`
3. Verify placement string matches valid options
4. Check campaign `impressions` counter is incrementing
