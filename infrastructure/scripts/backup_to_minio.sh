#!/usr/bin/env bash
set -Eeuo pipefail

DB_HOST="haproxy"
DB_PORT="5000"
DB_NAME="postgres"
DB_USER="postgres"
export PGPASSWORD="${PGPASSWORD:?PGPASSWORD is required}"

TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_FILE="/tmp/${DB_NAME}_${TIMESTAMP}.dump"
export BACKUP_FILE

echo "Starting PostgreSQL backup..."

pg_dump \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  -Fc \
  -f "$BACKUP_FILE"

echo "Backup created. Size:"
ls -lh "$BACKUP_FILE"

python3 /app/upload_backup.py

rm -f "$BACKUP_FILE"
unset PGPASSWORD
echo "Backup completed successfully."
