# The Corner Factory - site template production image (pattern tc-website)
# Nitro node-server preset output in .output/
#
# Build-time env (Vite inlines VITE_* into the JS bundle):
#   ARG VITE_BASE_URL - required for correct canonical/OG URLs

FROM node:24-alpine AS deps
RUN corepack enable && corepack prepare pnpm@12.3.4 --activate
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
RUN pnpm install --ignore-scripts --frozen-lockfile

FROM node:24-alpine AS build
RUN corepack enable && corepack prepare pnpm@12.3.4 --activate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
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
