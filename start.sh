#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/portal"

npm run dev &
DEV_PID=$!

npm run cms &
CMS_PID=$!

cleanup() {
  kill "$DEV_PID" "$CMS_PID" 2>/dev/null || true
}

trap cleanup EXIT INT TERM

wait
