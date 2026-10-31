#!/usr/bin/env bash
# Production database actions, run from the "Sync production database" workflow.
#
#   ACTION=push           Apply prisma/schema.prisma with `prisma db push`
#   ACTION=seed-articles  Upsert articles and categories by title (prisma/seed/articles-cli.ts)
#
# DRY_RUN=true (default) only previews: the schema diff, or the article validation.
# Both actions take a backup before writing anything.

set -euo pipefail

: "${DATABASE_URL:?DATABASE_URL is not set}"
ACTION="${ACTION:-push}"
DRY_RUN="${DRY_RUN:-true}"
ACCEPT_DATA_LOSS="${ACCEPT_DATA_LOSS:-false}"
SEED_SOURCE="${SEED_SOURCE:-mock}"
SEED_FILE="${SEED_FILE:-}"
BACKUP_DIR="${BACKUP_DIR:-${RUNNER_TEMP:-/tmp}/db-backups}"

log() { echo "[prod-db] $*"; }

case "$ACTION" in
  push|seed-articles) ;;
  *) log "Unknown ACTION '${ACTION}'. Use push or seed-articles."; exit 1 ;;
esac

# Split the URL into parts. Tabs separate the fields, so passwords with spaces survive.
IFS=$'\t' read -r DB_USER DB_PASS DB_HOST DB_PORT DB_NAME < <(
  node -e '
    const u = new URL(process.env.DATABASE_URL);
    const d = decodeURIComponent;
    console.log([d(u.username), d(u.password), u.hostname, u.port || "3306", d(u.pathname.slice(1))].join("\t"));
  '
)

log "Action: ${ACTION} | DRY_RUN: ${DRY_RUN} | Target: ${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

# Seed source arguments, shared by the preview and the real run
SEED_ARGS=(--source "$SEED_SOURCE")
if [ -n "$SEED_FILE" ]; then
  SEED_ARGS+=(--file "$SEED_FILE")
fi

if [ "$ACTION" = "push" ]; then
  log "Schema changes db push would apply:"
  npx prisma migrate diff \
    --from-url "$DATABASE_URL" \
    --to-schema-datamodel prisma/schema.prisma \
    --script || true
else
  log "Validating articles from source '${SEED_SOURCE}' (no database writes):"
  npx tsx prisma/seed/articles-cli.ts "${SEED_ARGS[@]}" --dry-run
fi

if [ "$DRY_RUN" = "true" ]; then
  log "DRY_RUN=true: nothing written. Run again with DRY_RUN=false to apply."
  exit 0
fi

# Backup before any write. Passwords go through MYSQL_PWD, not the command line.
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}-$(date -u +%Y%m%dT%H%M%SZ).sql.gz"
log "Backing up to ${BACKUP_FILE}"
MYSQL_PWD="$DB_PASS" mysqldump \
  -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" \
  --single-transaction --routines --triggers \
  "$DB_NAME" | gzip > "$BACKUP_FILE"
if [ ! -s "$BACKUP_FILE" ]; then
  log "Backup is empty. Stopping."
  exit 1
fi

if [ "$ACTION" = "push" ]; then
  PUSH_ARGS=(--skip-generate)
  if [ "$ACCEPT_DATA_LOSS" = "true" ]; then
    PUSH_ARGS+=(--accept-data-loss)
  fi
  log "Running prisma db push"
  npx prisma db push "${PUSH_ARGS[@]}"

  # Verify: the database should now match the schema exactly
  set +e
  npx prisma migrate diff \
    --from-url "$DATABASE_URL" \
    --to-schema-datamodel prisma/schema.prisma \
    --exit-code > /dev/null
  VERIFY_EXIT=$?
  set -e
  if [ "$VERIFY_EXIT" -ne 0 ]; then
    log "Verification failed: the database still differs from the schema."
    exit 1
  fi
  log "Database now matches prisma/schema.prisma."
else
  log "Upserting articles from source '${SEED_SOURCE}'"
  npx tsx prisma/seed/articles-cli.ts "${SEED_ARGS[@]}"
fi

log "Done. Backup kept at ${BACKUP_FILE}"
