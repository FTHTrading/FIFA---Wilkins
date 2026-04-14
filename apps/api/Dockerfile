# ─── Stage 1: deps ────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
WORKDIR /app

# Copy workspace manifests (all packages needed to satisfy the workspace graph)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json                 ./apps/api/
COPY packages/types/package.json           ./packages/types/
COPY packages/lib/package.json             ./packages/lib/
COPY packages/config/package.json          ./packages/config/

RUN pnpm install --frozen-lockfile --ignore-scripts

# ─── Stage 2: build ───────────────────────────────────────────────────────────
FROM deps AS builder
WORKDIR /app

# Copy source
COPY packages/types/   ./packages/types/
COPY packages/lib/     ./packages/lib/
COPY packages/config/  ./packages/config/
COPY apps/api/         ./apps/api/
# Restore node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Build shared packages first (api depends on @wilkins/types & @wilkins/lib)
RUN pnpm --filter @wilkins/types build 2>/dev/null || true
RUN pnpm --filter @wilkins/lib   build 2>/dev/null || true

# Generate Prisma client then compile NestJS
RUN pnpm --filter @wilkins/api exec prisma generate
RUN pnpm --filter @wilkins/api run build

# ─── Stage 3: production runner ───────────────────────────────────────────────
FROM node:20-alpine AS runner
RUN apk add --no-cache dumb-init \
 && addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nestjs

WORKDIR /app
ENV NODE_ENV=production

# Only copy what the runtime actually needs
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist       ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/prisma     ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/node_modules ./node_modules 2>/dev/null || true
COPY --from=builder --chown=nestjs:nodejs /app/node_modules        ./node_modules_root
# Use the root node_modules as NODE_PATH fallback for workspace packages
ENV NODE_PATH=/app/node_modules_root

COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./

USER nestjs
EXPOSE 4000
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:4000/api/v1/health || exit 1

CMD ["dumb-init", "node", "dist/main"]
