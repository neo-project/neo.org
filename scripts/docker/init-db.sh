#!/usr/bin/env bash
set -euo pipefail

DB_HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-1433}"
DB_USER="${DB_USER:-sa}"
DB_PASSWORD="${DB_PASSWORD:-NeoStrongPassw0rd@}"
DB_NAME="${DB_NAME:-NeoWeb}"
DB_WAIT_TIMEOUT="${DB_WAIT_TIMEOUT:-180}"

echo "Waiting for SQL authentication on ${DB_HOST}:${DB_PORT}..."
for ((i = 1; i <= DB_WAIT_TIMEOUT; i++)); do
  if /opt/mssql-tools/bin/sqlcmd -S "${DB_HOST},${DB_PORT}" -U "${DB_USER}" -P "${DB_PASSWORD}" -Q "SELECT 1" >/dev/null 2>&1; then
    echo "SQL login is ready."
    break
  fi

  if (( i == DB_WAIT_TIMEOUT )); then
    echo "Timed out waiting for SQL login after ${DB_WAIT_TIMEOUT}s."
    exit 1
  fi

  sleep 1
done

echo "Ensuring database [${DB_NAME}] exists..."
/opt/mssql-tools/bin/sqlcmd -S "${DB_HOST},${DB_PORT}" -U "${DB_USER}" -P "${DB_PASSWORD}" -Q "IF DB_ID(N'${DB_NAME}') IS NULL CREATE DATABASE [${DB_NAME}];"
echo "Database [${DB_NAME}] is ready."
