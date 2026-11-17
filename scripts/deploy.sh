#!/usr/bin/env bash
# Runs ON THE PLESK SERVER. Called by the GitHub Actions workflow on every push to main
# (see .github/workflows/deploy.yml), or manually over SSH.
#
# Steps: pull latest code -> npm ci -> prisma generate -> migrate DB -> next build -> restart.
#
# Optional env vars:
#   DEPLOY_BRANCH   branch to deploy            (default: main)
#   RUN_MIGRATIONS  1 = migrate DB, 0 = skip    (default: 1)
#   RESTART_CMD     command that restarts the app (e.g. "pm2 restart fast-reading-app")
#
# Note:
# .env is NOT in git. It must already exist in the app folder on the server.
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BRANCH="${DEPLOY_BRANCH:-develop17.11.2026}"
RUN_MIGRATIONS="${RUN_MIGRATIONS:-1}"
RESTART_CMD="${RESTART_CMD:-}"

cd "$APP_DIR"

if [ ! -f .env ]; then
  echo "ERROR: .env is missing in $APP_DIR. Create it on the server before deploying."
  exit 1
fi

if [ ! -d .git ]; then
  echo "ERROR: $APP_DIR is not a git clone. Set up the Plesk Git repository first."
  exit 1
fi

echo "==> Updating code to origin/$BRANCH"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
# Discards tracked local changes on the server. Ignored files (.env, node_modules) are kept.
git reset --hard "origin/$BRANCH"

echo "==> Installing dependencies"
npm ci

echo "==> Generating Prisma client"
npx prisma generate

if [ "$RUN_MIGRATIONS" = "1" ]; then
  echo "==> Migrating database"
  bash scripts/migrate.sh
else
  echo "==> Skipping database migration (RUN_MIGRATIONS=$RUN_MIGRATIONS)"
fi

echo "==> Building Next.js app"
npm run build

echo "==> Restarting app"
if [ -n "$RESTART_CMD" ]; then
  eval "$RESTART_CMD"
elif command -v pm2 >/dev/null 2>&1 && pm2 describe fast-reading-app >/dev/null 2>&1; then
  pm2 restart fast-reading-app
else
  echo "WARNING: no restart configured. Set RESTART_CMD, or restart the Node.js app in Plesk."
fi

echo "==> Deploy finished at $(date)"
