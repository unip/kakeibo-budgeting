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

FROM base AS runtime
WORKDIR /app
COPY --from=build /app/packages/api/dist ./api
COPY --from=build /app/packages/api/drizzle ./drizzle
COPY --from=build /app/packages/web/dist ./web
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages/api/package.json ./package.json
EXPOSE 3000
CMD ["node", "api/index.js"]
