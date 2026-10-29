#!/bin/sh
set -e

export PATH="/app/node_modules/.bin:$PATH"

echo "Running drizzle migrations..."
varlock run -- drizzle-kit migrate

# Refuse startup if the database journal differs from this project history.
varlock run -- node src/intranet/db/preflight.ts

exec varlock run -- node .output/server/index.mjs
