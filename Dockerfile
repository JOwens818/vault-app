# Install dependencies only when needed
FROM node:16 AS deps
WORKDIR /app
COPY package.json package-lock.json ./ 
USER root
RUN npm install
USER 1001

# Builder
FROM node:16 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
USER root
RUN npm run build
USER 1001

# Runner
FROM node:16 AS runner
WORKDIR /app
ENV NODE_ENV cirrus
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=1001:0 /app/.next/standalone ./
COPY --from=builder --chown=1001:0 /app/.next/static ./.next/static

USER root
RUN apt-get update -q -y && apt-get upgrade -q -y
EXPOSE 3030
ENV PORT 3030

USER 1001
CMD ["node", "server.js"]