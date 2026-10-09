#!/bin/sh
set -e

export PATH="/app/node_modules/.bin:$PATH"

echo "Running drizzle migrations..."
varlock run -- drizzle-kit migrate

exec varlock run -- node .output/server/index.mjs
