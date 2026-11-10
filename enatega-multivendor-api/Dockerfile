# syntax=docker/dockerfile:1.7
# ---------------------------------------------------------------------------
# Enatega API - production image
# ---------------------------------------------------------------------------
ARG NODE_VERSION=22.20.0

FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

FROM deps AS build
COPY tsconfig.json tsconfig.build.json ./
COPY scripts ./scripts
COPY src ./src
RUN npm run build

FROM deps AS prod-deps
RUN npm prune --omit=dev && npm cache clean --force

FROM node:${NODE_VERSION}-alpine AS runtime
ENV NODE_ENV=production \
    PORT=8001 \
    UPLOADS_DIR=/app/uploads
WORKDIR /app
RUN mkdir -p /app/uploads && chown node:node /app/uploads
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json ./
USER node
EXPOSE 8001
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8001)+'/health/live').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
# The server handles SIGTERM/SIGINT itself (graceful shutdown); run with `--init` to also reap zombies.
CMD ["node", "--enable-source-maps", "dist/index.js"]
