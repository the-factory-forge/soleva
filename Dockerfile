# The Corner Factory - site template production image (pattern tc-website)
# Nitro node-server preset output in .output/
#
# Build-time env (Vite inlines VITE_* into the JS bundle):
#   ARG VITE_BASE_URL - required for correct canonical/OG URLs

FROM node:24-alpine AS deps
RUN corepack enable && corepack prepare pnpm@12.16.1 --activate
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY docker/runtime/package.json ./docker/runtime/
RUN pnpm install --ignore-scripts --frozen-lockfile

FROM deps AS build
COPY . .

# Build-time variables (passed by dockploy as build args)
ARG VITE_BASE_URL
ARG VITE_GA_MEASUREMENT_ID
ARG VITE_GOOGLE_ADS_ID
ARG VITE_ADS_CONVERSION_LABEL
ARG VITE_ADS_PHONE_LABEL
ARG VITE_ADS_MAIL_LABEL
ENV VITE_BASE_URL=$VITE_BASE_URL \
    VITE_GA_MEASUREMENT_ID=$VITE_GA_MEASUREMENT_ID \
    VITE_GOOGLE_ADS_ID=$VITE_GOOGLE_ADS_ID \
    VITE_ADS_CONVERSION_LABEL=$VITE_ADS_CONVERSION_LABEL \
    VITE_ADS_PHONE_LABEL=$VITE_ADS_PHONE_LABEL \
    VITE_ADS_MAIL_LABEL=$VITE_ADS_MAIL_LABEL

# Build-only placeholders; deployment supplies real credentials.
RUN DATABASE_URL=postgresql://build:build@localhost:5432/build \
    BETTER_AUTH_SECRET=build-only-placeholder-not-for-runtime-123 \
    pnpm_config_ignore_scripts=true pnpm build

FROM deps AS runtime-tools
RUN pnpm --filter ./docker/runtime --prod deploy --ignore-scripts /runtime-tools

FROM node:24-alpine AS runtime
ENV NODE_ENV=production \
    PATH="/app/node_modules/.bin:$PATH"
WORKDIR /app
COPY --from=runtime-tools /runtime-tools/node_modules ./node_modules
COPY package.json .env.schema drizzle.config.ts ./
COPY drizzle ./drizzle
COPY src/intranet/db/preflight.ts ./src/intranet/db/
COPY src/intranet/components/forge/utils/database-migrations.ts ./src/intranet/components/forge/utils/
COPY --chmod=755 docker-entrypoint.sh ./
COPY --from=build /app/.output ./.output
EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
