# Learnfy continuation / recovery handoff

Updated: 2026-10-03 (Africa/Cairo). Working branch: `arena/01a0fdf3-learnfy`.

## Read this first

**Do not reset, clean, switch branches, overwrite useful work, or claim production completion.**
The current checkout is the evidence. The earlier Arena conversation and original master
prompt are not available here. Its described modernization is **not present in the recovered
filesystem or available Git refs**. Do not pretend it was recovered.

## Recovery checkpoint

- Initial HEAD: `72eebdd955172a170c6df76ce7e4466e3a001f88` (`Create UnityConfig.cs`, 2025-08-10).
- Initial tree: `5c45774ad5c784a597393cc36a7779d031222f63`.
- Initial working tree: clean, 263 tracked files; no untracked/ignored local implementation.
- Fetched complete history (initial clone was shallow): 121 commits across available refs.
- `main` / `origin/main`: `72eebdd`; `origin/Y.Ahmedy-IBSRA`: `d65351b` (2025-08-10).
- Other branch inspected, **not merged**: it removes repository layers, references missing
  `YourApp.Mappers`, retains missing dependencies/context, and is not a newer modernization.
- No tags, stashes, dangling/unreachable objects, existing PRs, TODO/handoff/master-plan files,
  CI files, Docker files, or current migrations were found.
- Full verified Git bundle (inside ignored recovery directory):
  `.recovery/learnfy-pre-continuation-20261003.bundle`. It contains all six initial
  refs and complete reachable history. Original commit/history remains in this branch.
- Audit detail: [RECOVERY_AUDIT.md](RECOVERY_AUDIT.md).
- Scope/status: [REQUIREMENTS.md](REQUIREMENTS.md). Themes come from the continuation request;
  exact original acceptance criteria cannot be reconstructed from the repository alone.

## Verified initial implementation

- Web: React 19 / TypeScript 5.8 / Vite 7 starter only; **not** a Learnfy product UI.
  `npm install --ignore-scripts`, `npm run build`, `npm run lint`, and production dependency
  audit passed. There was no web test suite or lockfile; install generated `web/package-lock.json`.
- Mobile: Flutter/Dart project with existing pink/purple Poppins theme, onboarding, signup,
  OTP presentation, Arabic landing, profile/settings. Preserve these designs/assets.
  No actual API clients/auth repository. OTP cubit waits then unconditionally emits success.
  Login, most main tabs, and the generated counter test are placeholders/incomplete.
- Auth API: ASP.NET Core project with controller/service/repository/mapper/context/model layers.
  BCrypt/JWT intent exists but required packages are absent. Reset flow calls nonexistent
  `AuthResponse.Data`, returns raw reset tokens, leaks email existence, and has no email sender.
- Course API: filtering/recommendation/service/repository work exists but does not build.
  Missing DbContext/User, absent EF/JWT dependencies, invalid root-level PackageReference,
  missing auth registrations, `Validaudience` typo. Personalized route accepts arbitrary user IDs
  without authentication. Sorting happens after pagination, so global ordering is wrong.
- Categories API: useful category service/repository/DTO/business rules, but mixes legacy
  .NET Framework Web API/EF6/Unity with .NET 8 host and EF Core `HasData`. No runtime DI.
- No actual payments, cart, orders, email delivery, notifications, AI, admin, analytics,
  deployments, observability, or production security evidence.
- Historical SQL was inspected at `a089c73`, `e63b21b`, and related commits. It contains partial
  ALTER scripts/sample data, invalid sample password hashes, and divergent course/category
  schemas, not deployable EF migrations. Do not run it blindly against existing databases.

## Validation and environment

Node 22.22.3/npm 10.9.8 and authenticated `git`/`gh` are available. No .NET SDK, Flutter/Dart,
Docker daemon/client, SQL Server/Postgres, or existing running services/databases were found.
Attempts to download .NET SDK/Flutter metadata directly from Microsoft/Google/NuGet domains
failed with TLS EOF in the sandbox. GitHub/npm work; tool-side web fetch works. Toolchain
installation/real backend/mobile validation must be resolved before marking them validated.
Do not use obsolete SDKs or suppress errors to get green checks.

## Continuation scope decision

The user chose **continue from this verified checkout** when asked about the missing prior
implementation. Use the requirement themes in this request; the original master prompt remains
unavailable, and exact original-prompt compliance cannot be certified. No rebuild from zero.

After the clarification boundary, the sandbox restored application files but reinitialized Git
metadata to the original shallow clone. The audit files and lockfile survived; the first local
checkpoint metadata did not. Full history was re-fetched and the bundle regenerated **inside
the checkout**. Persist checkpoint history remotely or in an in-checkout Git bundle; do not rely
on a sibling directory surviving a later recovery. No existing application work was lost.

## Current phase / next exact task

Phase 1 recovery complete; **Phase 2 stabilization checkpoint implemented, backend/mobile validation pending**.

### Added/fixed in this continuation

- Preserved three existing API service/repository layers. Shared `Learnfy.Data` now owns the
  recovered User/Course/Category/context; categories relate to courses by unique category name
  (historical schema intent), avoiding two conflicting course tables. Prices persist as exact
  integer cents; ratings use relational numeric conversion. Unique normalized identities,
  recommendation FK/uniqueness, and data constraints are configured.
- Target .NET 10 LTS / SDK 10.0.401 / EF and ASP.NET 10.0.12, verified from official metadata.
  .NET 8 approaches end of support; old APIs did not build. No unsupported preview SDK.
- Removed AutoMapper 12 dependency because verified high-severity
  [GHSA-rvv3-g6hj-g44x](https://github.com/advisories/GHSA-rvv3-g6hj-g44x). Explicit allowlisted
  DTO mappings preserve existing shapes/scoring without a new licensed dependency.
- Repaired invalid project refs, missing context/DI, plural course routes, legacy EF6/Web API/
  Unity incompatibility, nullability and JWT audience typo. Replaced legacy host stubs with
  real ASP.NET Core registrations. Generated `obj`/user files untracked, not erased from history.
  Removed generated random weather endpoints; they are not Learnfy product functionality.
- Auth: BCrypt (12 rounds, 72 UTF-8 byte bound), validated inputs, normalized unique identities,
  real HTTP status codes, current-user/logout, 15-minute signed access tokens, security-stamp
  validation across APIs, atomic hashed one-use password reset and session invalidation.
- Email: real Resend HTTP integration, encrypted transactional outbox, leased bounded worker,
  idempotency header, bounded retries/failure codes. Missing config returns explicit 503 (never
  returns raw token/claims mail sent). Real provider/inbox delivery still needs external validation.
- Categories: real bounded SQL counts/top-five projections; public inactive details hidden;
  inactive listing requires Admin. Courses: common filters/count query, stable sort BEFORE paging,
  bounded query validation, verified-subject personalized endpoint (not caller userId).
- Common safe ProblemDetails/trace IDs, no-store/nosniff/referrer headers, exact CORS allowlist,
  throttling, liveness/readiness and development-only OpenAPI.
- Mobile: preserved theme/assets/layout; removed delay-based fake OTP and unconditional navigation,
  explicit unconfigured gateway, provider-only success, proper E.164/six-digit input, real resend
  action, no hard-coded phone, controller disposal. Phone verification **still requires a real
  backend SMS gateway**. Signup/login integration remains unfinished, not claimed complete.
- Web: supported ESLint 10, deterministic lockfile, type/lint/test/build scripts, Vitest,
  same-origin relative transport with honest errors/cancellation and 13 regression tests.
  Vite binds 0.0.0.0, accepts preview hosts and proxies APIs; no browser-facing localhost URLs.
  Product UI remains the original starter until core stabilization passes.
- Pinned-action CI for web, all .NET projects/relational API tests, Flutter analyze/tests.
  GitHub administrative permissions query is 403 (not needed for ordinary workflows); run-list
  API works. Remote checks/push availability still must be established.

### Validation so far

- Web `npm run validate`: PASS (typecheck, lint, 13 tests, production build).
- Web `npm audit --audit-level=high`: PASS, zero vulnerabilities (all dependencies).
- All six .csproj XML/project-reference checks: PASS; `git diff --check`: PASS.
- Backend source/tests and mobile fixes are **NOT YET COMPILED/EXECUTED**; local SDK/toolchain
  downloads remain blocked. A validation checkpoint push may trigger CI; that is NOT a final PR.
- No migrations have been generated/applied yet. Runtime must not use EnsureCreated or blindly
  apply historical SQL. Relational test database alone uses EnsureCreated for isolated tests.

### Resume immediately here

1. Run CI on the fixed session branch; inspect actual compiler/analyzer/test failures and fix
   them. Do not stack commerce/AI/new UI on an unvalidated core. No final PR yet.
2. Generate **separate SQL Server / SQLite migration assemblies** against the actual shared
   context; inspect and test upgrade/rollback, money conversion and constraints. Do not reuse
   SQL Server-only column definitions in SQLite or suppress pending-model-change warnings.
3. Add explicit dev initialization/recovered catalog opt-in; do not fake enrollments/production
   data. No real existing database is configured; legacy schema adoption must be documented.
4. Finish authentication clients/profile, then actual catalog UI preserving mobile branding;
   commerce/provider verification, notifications, AI, admin/support follow the requirement matrix.
5. Revalidate, update this handoff/matrix, and checkpoint after each safe unit.

## What should not be touched

- Repository root or `.git`; initial history/refs, existing remote branch, all historical assets.
- Mobile design system, onboarding/landing/profile components unless fixing a verified defect.
- Working repository/service separation; do not replace it with a different stack for convenience.
- No destructive Git commands, branch creation/switching, history rewriting, or secret commits.

## Missing configuration / requirements

- Original modernization prompt and any previous Arena-only patch/artifacts (not found in Git).
- Real database connection, schema adoption plan, strong JWT signing key and issuer/audience.
- Email provider, verified sender/public reset URL; SMS provider if phone OTP remains required.
- Payment provider and verified webhook secrets; AI provider credentials/cost limits.
- Deployment target/domain, production secret storage, monitoring/backup infrastructure.

These are not completed merely by adding example environment variables.
