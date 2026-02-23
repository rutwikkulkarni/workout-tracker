FROM node:22-alpine

WORKDIR /app

# Install build tools for better-sqlite3 native compilation
RUN apk add --no-cache python3 make g++

COPY package.json ./
RUN npm install --production

COPY src/ ./src/
COPY public/ ./public/

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
