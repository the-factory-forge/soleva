# The Corner Factory - site template production image (pattern tc-website)
# Nitro node-server preset output in .output/
#
# Build-time env (Vite inlines VITE_* into the JS bundle):
#   ARG VITE_BASE_URL - required for correct canonical/OG URLs

FROM node:24-alpine AS deps
RUN corepack enable && corepack prepare pnpm@11.20.0 --activate
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
RUN pnpm install --frozen-lockfile

FROM node:24-alpine AS build
RUN corepack enable && corepack prepare pnpm@11.20.0 --activate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time variables (passed by dockploy as build args)
ARG VITE_BASE_URL
ARG VITE_GA_MEASUREMENT_ID
ARG VITE_GOOGLE_ADS_ID
ENV VITE_BASE_URL=$VITE_BASE_URL \
    VITE_GA_MEASUREMENT_ID=$VITE_GA_MEASUREMENT_ID \
    VITE_GOOGLE_ADS_ID=$VITE_GOOGLE_ADS_ID

# pnpm 11 verify-deps-before-run spawns an internal install that inherits ENV, not CLI flags - this skips the root `prepare` lifecycle in the image (no git).
RUN pnpm_config_ignore_scripts=true pnpm build

FROM node:24-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
# Copy everything (pattern tc-website): the runtime needs node_modules
# (drizzle-kit), drizzle.config.ts and the drizzle/ migrations to run
# `drizzle-kit migrate` in docker-entrypoint.sh, plus .output to serve.
COPY --from=build /app .
RUN chmod +x docker-entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
