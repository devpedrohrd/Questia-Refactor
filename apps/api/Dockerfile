# ============================================
# Stage 1: Install dependencies
# ============================================
FROM node:20-alpine AS deps

RUN npm install -g bun@1.2.9

WORKDIR /app

# Copy root workspace files
COPY package.json bun.lock turbo.json tsconfig.json ./

# Copy all packages structure
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages/api/package.json ./packages/api/package.json
COPY packages/ui/package.json ./packages/ui/package.json
COPY packages/eslint-config/ ./packages/eslint-config/
COPY packages/typescript-config/ ./packages/typescript-config/
COPY packages/jest-config/ ./packages/jest-config/

# Install dependencies (frozen lockfile for reproducibility)
RUN bun install --frozen-lockfile

# ============================================
# Stage 2: Build the application
# ============================================
FROM node:20-alpine AS builder

RUN npm install -g bun@1.2.9

WORKDIR /app

# Copy everything from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/
COPY package.json bun.lock turbo.json tsconfig.json ./

# Generate Prisma client
RUN cd apps/api && bunx prisma generate

# Build the shared @repo/api package first
RUN cd packages/api && bun run build 2>/dev/null || true

# Build the NestJS API
RUN cd apps/api && bun run build

# ============================================
# Stage 3: Production image
# ============================================
FROM node:20-alpine AS production

RUN apk add --no-cache dumb-init

WORKDIR /app

ENV NODE_ENV=production

# Copy built output and necessary runtime files
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/apps/api/package.json ./package.json

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs

USER nestjs

EXPOSE 3000

# Use dumb-init for proper signal handling
CMD ["dumb-init", "node", "dist/main.js"]
