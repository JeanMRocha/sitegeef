# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Create .env.local for build
RUN echo "NEXT_PUBLIC_SITE_URL=https://geef.com.br" > .env.local && \
    echo "NEXT_PUBLIC_SUPABASE_URL=https://nycgpokqlmrfzegjlrwa.supabase.co" >> .env.local && \
    echo "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_jDq5SX_k4spHMCCPVvlsrQ_-ZZybt8e" >> .env.local && \
    echo "SUPABASE_SERVICE_ROLE_KEY=default-for-build" >> .env.local

# Build Next.js application
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Install dumb-init and curl for healthcheck
RUN apk add --no-cache dumb-init curl

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3500
ENV HOSTNAME=0.0.0.0

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3500/ || exit 1

# Use dumb-init to properly handle signals
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "server.js"]
