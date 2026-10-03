#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
[[ -f .env ]] || { echo 'Run scripts/setup-development.sh first.' >&2; exit 1; }
set -a
# shellcheck source=/dev/null
source .env
set +a
pids=()
cleanup() { if ((${#pids[@]})); then kill "${pids[@]}" 2>/dev/null || true; fi; }
trap cleanup EXIT
trap 'exit 130' INT TERM
dotnet run --project 'web/APIs/Authentication API/IBSRA.csproj' & pids+=("$!")
dotnet run --project 'web/APIs/Course Recommendations API/IBSRA&2.csproj' & pids+=("$!")
dotnet run --project 'web/APIs/Categories API/IBSRA&3.csproj' & pids+=("$!")
npm run dev --prefix web & pids+=("$!")
# An unexpected child exit must not leave a misleading half-working stack running.
wait -n "${pids[@]}"
