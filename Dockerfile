FROM node:20-alpine AS base
RUN corepack enable pnpm

FROM base AS build
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json packages/shared/
COPY packages/api/package.json packages/api/
COPY packages/web/package.json packages/web/
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm --filter @kakeibo/web build
RUN pnpm --filter @kakeibo/api build

# Production image
FROM base AS runtime
WORKDIR /app

# Copy package files for production install
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json packages/shared/
COPY packages/api/package.json packages/api/

# Install production dependencies only (including drizzle-kit for migrations)
RUN pnpm install --frozen-lockfile

# Copy built artifacts
COPY --from=build /app/packages/api/dist ./packages/api/dist
COPY --from=build /app/packages/api/drizzle ./packages/api/drizzle
COPY --from=build /app/packages/api/drizzle.config.ts ./packages/api/drizzle.config.ts
COPY --from=build /app/packages/web/dist ./packages/web/dist
COPY --from=build /app/packages/shared/src ./packages/shared/src
COPY --from=build /app/packages/api/src ./packages/api/src
COPY --from=build /app/packages/api/seed.sh ./packages/api/seed.sh

# Set working directory to api package for execution
WORKDIR /app/packages/api

RUN chmod +x seed.sh

EXPOSE 3000
CMD ["sh", "-c", "npx drizzle-kit migrate --config=drizzle.config.ts && node dist/index.js"]
