# Learnfy

An educational platform with React/TypeScript web, Flutter mobile, and the existing modular
ASP.NET APIs for authentication, course discovery and categories.

## Continuation status

This is an in-place recovery, **not a rebuild**. Available history and mobile UI/assets are
preserved. The earlier Arena modernization was not present in the recovered refs; the user
approved continuing the verified checkout. Core builds/auth/catalog/security are stabilized;
the full product and commerce/AI/admin workflows are **not declared complete**.

- [Exact handoff / next task](docs/CONTINUATION.md)
- [Evidence-based requirements matrix](docs/REQUIREMENTS.md)
- [Recovery audit](docs/RECOVERY_AUDIT.md)
- [Database setup / legacy adoption safety](docs/DATABASE.md)
- [Validation workflow](.github/workflows/ci.yml)

## Toolchains

Node 22 LTS (`.nvmrc`), .NET 10 LTS SDK pinned in `global.json`, Flutter 3.47.6.
Web/npm, .NET and Flutter dependencies are locked. CI checks all clients and APIs; test reports
also publish to GitHub Checks because some sandboxes cannot download Actions logs/artifacts.

## Develop

```bash
./scripts/setup-development.sh --seed # optional, explicit sample catalog; preserves existing .env
./scripts/dev.sh
```

Web: port 5173; auth: 5204; courses: 5174; categories: 5058. All bind to `0.0.0.0`.
Browser code uses relative `/api/*`; Vite proxies internally and accepts Arena preview hosts.
Backend URL overrides in `web/.env.example` are server-side, never public `VITE_*` secrets.
Production needs a reverse proxy/TLS, shared database and explicit migration process.

## Validate

```bash
npm ci --prefix web
npm run validate --prefix web
npm audit --prefix web --audit-level=high
dotnet restore Learnfy.sln --locked-mode
dotnet build Learnfy.sln --configuration Release --no-restore
# SQLite-only on machines without SQL Server (CI always runs ALL tests).
dotnet test Learnfy.sln --configuration Release --no-build --filter 'Category!=SqlServer'
# With a SQL Server service configured: export LEARNFY_TEST_SQLSERVER securely, then run without a filter.
cd mobile && flutter pub get --enforce-lockfile && flutter analyze && flutter test
```

The sandbox lacks local .NET/Flutter and blocks their downloads; real backend/mobile checks
run in GitHub Actions, not fabricated locally. See the handoff for exact run IDs/results.

## Configuration and honest service failures

`.env.example` contains server-only configuration names, not credentials. Use a real secret
manager and never commit `.env`. Strong JWT key/issuer/audience must match across APIs.

Password recovery uses a real Resend sender and encrypted transactional outbox. Missing API
key/verified sender/public URL is reported as HTTP 503; no raw token or fake 'sent' response.
Production must persist/restrict Data Protection keys and verify provider/inbox delivery.
Phone OTP is **unconfigured and fails closed** until a server-side SMS integration is supplied.
Commerce, notifications, AI, admin, deployment and remaining UI are tracked openly in the matrix.
