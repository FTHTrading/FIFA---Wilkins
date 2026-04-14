# ─── Stage 1: deps ────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/admin-console/package.json  ./apps/admin-console/
COPY packages/types/package.json      ./packages/types/
COPY packages/lib/package.json        ./packages/lib/
COPY packages/config/package.json     ./packages/config/
COPY packages/ui/package.json         ./packages/ui/
COPY packages/analytics/package.json  ./packages/analytics/
COPY packages/campaigns/package.json  ./packages/campaigns/
COPY packages/auth/package.json       ./packages/auth/

RUN pnpm install --frozen-lockfile --ignore-scripts

# ─── Stage 2: build ───────────────────────────────────────────────────────────
FROM deps AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY packages/types/     ./packages/types/
COPY packages/lib/       ./packages/lib/
COPY packages/config/    ./packages/config/
COPY packages/ui/        ./packages/ui/
COPY packages/analytics/ ./packages/analytics/
COPY packages/campaigns/ ./packages/campaigns/
COPY packages/auth/      ./packages/auth/
COPY apps/admin-console/ ./apps/admin-console/
COPY --from=deps /app/node_modules ./node_modules

RUN pnpm --filter @wilkins/types     build 2>/dev/null || true
RUN pnpm --filter @wilkins/lib       build 2>/dev/null || true
RUN pnpm --filter @wilkins/ui        build 2>/dev/null || true

ARG NEXT_PUBLIC_API_URL
RUN pnpm --filter @wilkins/admin-console run build

# ─── Stage 3: runner ──────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/apps/admin-console/public          ./public 2>/dev/null || true
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin-console/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin-console/.next/static      ./.next/static

USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
