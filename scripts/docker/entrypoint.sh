#!/usr/bin/env bash
set -euo pipefail

DB_HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-1433}"
DB_WAIT_TIMEOUT="${DB_WAIT_TIMEOUT:-120}"

echo "Waiting for SQL Server at ${DB_HOST}:${DB_PORT}..."
for ((i = 1; i <= DB_WAIT_TIMEOUT; i++)); do
  if (echo >"/dev/tcp/${DB_HOST}/${DB_PORT}") >/dev/null 2>&1; then
    echo "SQL Server is reachable."
    exec dotnet NeoWeb.dll "$@"
  fi

  if (( i == DB_WAIT_TIMEOUT )); then
    echo "Timed out waiting for SQL Server after ${DB_WAIT_TIMEOUT}s."
    exit 1
  fi

  sleep 1
done
