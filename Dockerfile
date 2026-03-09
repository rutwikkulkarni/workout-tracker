# Stage 1: Build frontend
FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++ && npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY vite.config.mjs index.html ./
COPY src/ ./src/
COPY static/ ./static/
RUN pnpm build

# Stage 2: Production
FROM node:22-alpine
WORKDIR /app
RUN apk add --no-cache python3 make g++ && npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile
COPY src/ ./src/
COPY --from=builder /app/public/ ./public/

# Create db directory with correct permissions
RUN mkdir -p /app/db

# Non-root user
RUN addgroup -S app && adduser -S app -G app
RUN chown -R app:app /app
USER app

EXPOSE 3000

ENV NODE_ENV=production
ENV DB_PATH=/app/db/workouts.db

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:3000/api/settings || exit 1

CMD ["node", "src/server.js"]
