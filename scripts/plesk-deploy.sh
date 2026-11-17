#!/usr/bin/env bash
# Plesk "Additional deployment actions" script. Runs on the server after each Git pull.
#
# Action command:   bash scripts/plesk-deploy.sh
# To also sync the database schema on this deploy:   DB_PUSH=1 bash scripts/plesk-deploy.sh
#
# Restart the Node.js app in Plesk after this finishes.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

if [ ! -f .env ]; then
  echo "ERROR: .env is missing in $(pwd). Create it before deploying."
  exit 1
fi

echo "==> Installing dependencies"
npm ci

echo "==> Generating Prisma client"
npx prisma generate

if [ "${DB_PUSH:-0}" = "1" ]; then
  echo "==> Syncing database schema (prisma db push)"
  npx prisma db push
fi

echo "==> Building Next.js app"
npm run build

echo "==> Build finished. Restart the Node.js app in Plesk."
