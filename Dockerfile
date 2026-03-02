FROM node:22-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json .npmrc ./
RUN npm install --legacy-peer-deps

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG AUTHENTIK_CLIENT_ID
ARG AUTHENTIK_CLIENT_SECRET
ARG AUTH_SECRET
ARG AUTH_URL
ENV AUTHENTIK_CLIENT_ID=$AUTHENTIK_CLIENT_ID
ENV AUTHENTIK_CLIENT_SECRET=$AUTHENTIK_CLIENT_SECRET
ENV AUTH_SECRET=$AUTH_SECRET
ENV AUTH_URL=$AUTH_URL
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
