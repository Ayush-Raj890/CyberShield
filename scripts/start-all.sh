#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLIENT_DIR="$ROOT_DIR/client"
SERVER_DIR="$ROOT_DIR/server"
AI_DIR="$ROOT_DIR/ai-service"

printf 'Starting CyberShield services...\n\n'

if [[ ! -d "$SERVER_DIR/node_modules" ]]; then
  printf '[1/3] Installing server dependencies...\n'
  (cd "$SERVER_DIR" && npm install)
fi

if [[ ! -d "$CLIENT_DIR/node_modules" ]]; then
  printf '[2/3] Installing client dependencies...\n'
  (cd "$CLIENT_DIR" && npm install)
fi

if [[ ! -d "$AI_DIR/.venv" ]]; then
  printf '[3/3] AI virtual environment missing. Create it with:\n'
  printf '  cd ai-service && python -m venv .venv\n'
  exit 1
fi

printf '[3/3] Starting server, client, and AI service in background...\n'

( cd "$SERVER_DIR" && npm run dev ) > /tmp/cybershield-server.log 2>&1 &
SERVER_PID=$!

( cd "$CLIENT_DIR" && npm run dev ) > /tmp/cybershield-client.log 2>&1 &
CLIENT_PID=$!

(
  cd "$AI_DIR"
  source .venv/bin/activate
  uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
) > /tmp/cybershield-ai.log 2>&1 &
AI_PID=$!

printf '\nLaunched. Logs:\n'
printf '  Server: %s\n' '/tmp/cybershield-server.log'
printf '  Client: %s\n' '/tmp/cybershield-client.log'
printf '  AI:     %s\n' '/tmp/cybershield-ai.log'
printf '\nPIDs: server=%s client=%s ai=%s\n' "$SERVER_PID" "$CLIENT_PID" "$AI_PID"
