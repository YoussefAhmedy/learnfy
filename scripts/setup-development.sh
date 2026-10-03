#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
command -v dotnet >/dev/null || { echo 'Install the .NET SDK specified in global.json first.' >&2; exit 1; }
if [[ ! -e .env ]]; then
  mkdir -p .data/keys
  chmod 700 .data .data/keys
  python3 - <<'PY'
from pathlib import Path
import secrets, shlex
root = Path.cwd()
values = {
 'ASPNETCORE_ENVIRONMENT': 'Development', 'Database__Provider': 'Sqlite',
 'ConnectionStrings__DefaultConnection': f'Data Source={root / ".data/learnfy-dev.db"};Foreign Keys=True',
 'Jwt__Key': secrets.token_urlsafe(48), 'Jwt__Issuer': 'learnfy', 'Jwt__Audience': 'learnfy-clients', 'Jwt__ExpiryMinutes': '15',
 'DataProtection__KeyDirectory': str(root / '.data/keys'),
}
p = root / '.env'
with p.open('x') as f:
 f.write('# Generated development-only environment; never commit this file.\n')
 for key, value in values.items(): f.write(f'{key}={shlex.quote(value)}\n')
p.chmod(0o600)
print('Created private development environment. No secrets printed.')
PY
else
  echo 'Existing .env preserved unchanged.'
fi
set -a
# shellcheck source=/dev/null
source .env
set +a
dotnet restore Learnfy.sln --locked-mode
dotnet run --project web/APIs/Learnfy.Database -- migrate
if [[ "${1:-}" == '--seed' ]]; then
  dotnet run --project web/APIs/Learnfy.Database -- seed-development
fi
npm ci --prefix web
echo 'Development database is versioned. Run scripts/dev.sh to start the existing services.'
