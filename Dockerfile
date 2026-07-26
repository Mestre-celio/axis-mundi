FROM node:20-alpine AS builder
WORKDIR /app

COPY backend/package.json backend/package-lock.json ./backend/
COPY backend/tsconfig.json ./backend/
COPY backend/src/ ./backend/src/

RUN cd backend && npm ci && npm run build

FROM node:20-alpine AS runner
WORKDIR /app

RUN addgroup --system axis && adduser --system --ingroup axis axis

ENV NODE_ENV=production
ENV PORT=3001

COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/package.json ./package.json

RUN npm prune --omit=dev

USER axis
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

STOPSIGNAL SIGTERM
CMD ["node", "dist/server.js"]
