# Stage 1: Builder - compile everything
FROM node:20-alpine AS builder
WORKDIR /app

# Install only build dependencies needed
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install all deps (including dev for Prisma generation)
RUN npm ci --legacy-peer-deps

# Copy source
COPY . .

# Generate Prisma client and build
RUN npm run build

# Stage 2: Production deps only
FROM node:20-alpine AS prod-deps
WORKDIR /app

COPY package*.json ./

# Install only production dependencies (skip better-sqlite3 and other dev tools)
RUN npm ci --omit=dev --legacy-peer-deps

# Stage 3: Runtime (final image)
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy everything with correct permissions (before user switch)
COPY --chown=node:node package.json ./

COPY --chown=node:node --from=builder /app/.next ./.next
COPY --chown=node:node --from=builder /app/next.config.ts ./
COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/prisma ./prisma

# Copy production node_modules 
COPY --chown=node:node --from=prod-deps /app/node_modules ./node_modules

# Use node user (built-in, has uid 1000)
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

CMD ["npm", "start"]
