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

Phase 1 recovery audit is complete. Next: **Phase 2 stabilization**.

1. Preserve reproducible web install (lockfile, explicit check/test scripts) and add honest tests.
2. Resolve toolchain availability; run all three backend builds to capture baseline failures.
3. Fix existing API compilation/DI/configuration while preserving repository/service layers.
   Reconcile missing/shared database types deliberately; no blind branch merge or duplicate
   migrations. Add tests for fixes, auth isolation, pagination and error status handling.
4. Replace mobile's stale generated test with actual onboarding/validation tests; stop fake OTP
   success. Preserve UI and do not imply an SMS provider exists.
5. Record every validation result/blocker here; checkpoint before expanding business scope.

Later phases retain every requirement theme in the matrix. Do not open a final PR or label
unfinished/unvalidated functionality production-ready. If the session cannot finish everything,
end at a tested logical checkpoint with the next task written here.

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
