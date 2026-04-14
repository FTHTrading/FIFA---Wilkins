# Operations Guide — Wilkins Media Global Guest OS

## Infrastructure

### Required Services

| Service | Purpose | Default Local |
|---------|---------|---------------|
| PostgreSQL 16 | Primary database | `localhost:5432` |
| Redis 7 | Cache, queues, pub/sub | `localhost:6379` |
| Object Storage | Media uploads (optional) | S3-compatible |

### Starting Infrastructure

```bash
docker compose up postgres redis -d
```

### Health Checks

- API: `GET /api/v1/health`
- Maps: `GET /api/v1/maps/health`

---

## Database Operations

### Generate Prisma Client

```bash
pnpm --filter @wilkins/api db:generate
```

### Run Migrations

```bash
pnpm --filter @wilkins/api db:migrate
```

### Seed Data

```bash
pnpm --filter @wilkins/api db:seed
```

### Prisma Studio (GUI)

```bash
pnpm --filter @wilkins/api db:studio
```

---

## Monitoring Checklist

- [ ] API health endpoint returns 200
- [ ] Redis connection healthy
- [ ] PostgreSQL connection healthy
- [ ] Active emergency incidents < threshold
- [ ] Translation queue depth < 100
- [ ] Error rate < 1%
- [ ] P95 latency < 500ms

---

## Feature Flags

| Flag | Default | Purpose |
|------|---------|---------|
| `MCP_AGENTIC_ENABLED` | `true` | Enable agentic concierge features |
| `RAG_PROVIDER` | `local` | RAG backend: `local`, `pinecone`, `pgvector` |

---

## Scaling Considerations

- API is stateless — scale horizontally
- Redis handles pub/sub and queue — use managed Redis with replicas
- PostgreSQL handles all persistence — use read replicas for analytics
- Mapbox/Overpass calls are cached in Redis
- Translation results cached by key+lang pair
