#!/usr/bin/env bash
# Applies the Prisma schema to the database named in .env (DATABASE_URL).
#
# Usage:
#   bash scripts/migrate.sh          # auto: migrate deploy if migrations exist, else db push
#   bash scripts/migrate.sh --push   # force schema sync with db push (no migration history)
#
# db push refuses destructive changes unless you pass --accept-data-loss yourself,
# so it will not silently drop data.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

if [ ! -f .env ]; then
  echo "ERROR: .env is missing. DATABASE_URL is required."
  exit 1
fi

MODE="${1:-auto}"

has_migrations() {
  # A migration is a folder under prisma/migrations containing migration.sql
  find prisma/migrations -mindepth 2 -maxdepth 2 -name migration.sql 2>/dev/null | grep -q .
}

if [ "$MODE" = "--push" ]; then
  echo "==> prisma db push (forced)"
  npx prisma db push --skip-generate
elif has_migrations; then
  echo "==> prisma migrate deploy"
  npx prisma migrate deploy
else
  echo "WARNING: prisma/migrations has no migrations (it is git-ignored). Falling back to db push."
  echo "==> prisma db push"
  npx prisma db push --skip-generate
fi

echo "==> Database migration step complete"
