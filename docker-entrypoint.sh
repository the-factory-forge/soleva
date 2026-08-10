#!/bin/sh
set -e

# Run Drizzle migrations when a database is configured (login/intranet feature).
# The database itself is created by the deploy platform (dockploy DB service);
# migrate only creates/updates the tables (idempotent - safe every boot).
# In showcase mode (no DATABASE_URL) the app runs without a database.
if [ -n "$DATABASE_URL" ]; then
  echo "Running drizzle migrations..."
  npx drizzle-kit migrate
fi

# Start the Nitro server
exec node .output/server/index.mjs
