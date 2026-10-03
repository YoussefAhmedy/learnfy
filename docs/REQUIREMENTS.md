# Requirements matrix

Updated 2026-10-03. Status is evidence-based, not based on the unavailable previous chat.
`COMPLETE` requires implementation **and validation**. External configuration is separate from
coding work. The continuation prompt supplies themes, not the missing master prompt's precise
scope/acceptance criteria; original-prompt compliance remains **BLOCKED** until recovered.

| Requirement | Status | Evidence at recovery | Remaining work |
|---|---|---|---|
| Preserve/recover implementation | COMPLETE | Full history fetched; both remote refs inspected; clean initial tree; verified bundle; recovery docs | Preserve future checkpoints; previous Arena-only artifacts cannot be recovered from current refs |
| Original master prompt compliance | BLOCKED | No prompt/handoff/progress file or matching modernization commit | Obtain unavailable original requirements/artifacts; do not invent compliance |
| Full-stack architecture | PARTIAL | React/Flutter plus three ASP.NET projects; service/repository layers | Repair builds, shared domain/context, DI, contracts, real client integration |
| Web UI/UX | NOT STARTED | `web/src/App.tsx` is Vite counter starter | Implement actual workflows consistently with existing Learnfy branding |
| Mobile UI/UX | PARTIAL | Onboarding/signup/OTP/landing/profile/settings with custom tokens/assets | Wire real APIs; finish routes/tabs, responsive/error/loading/empty states |
| Authentication | PARTIAL | Auth service/repository/controller, BCrypt/JWT code | Missing deps/config, request validation, safe recovery/email, session/token lifecycle, integration tests |
| Authorization | PARTIAL | JWT middleware intent; personalized recommendations accepts any userId | Authenticated subject isolation, roles/policies, deny-by-default tests |
| Courses/products | PARTIAL | Two incompatible Course models, catalog service/repository/DTOs | Reconcile schema, migrations, valid queries/detail status, authoring and course consumption |
| Categories | PARTIAL | Category service/repository rules and DTOs | Port incompatible legacy host integration; DI, migrations, inactive access checks |
| Search | PARTIAL | EF filter query, search endpoint | Validation, stable global sort-before-page, client integration, tests |
| Recommendations | PARTIAL | Rating/curated scoring, exclusion of stored recommendations | Secure user identity, accurate documented algorithm, real data, tests; not an AI feature |
| Cart | NOT STARTED | No implementation | Persistent ownership-scoped cart, authoritative pricing, tests/UI |
| Checkout | NOT STARTED | No implementation | Server totals, payment session, error/retry behavior, tests/UI |
| Orders | NOT STARTED | No implementation | Order state machine, audit records, ownership, fulfillment/entitlements |
| Payments | NOT STARTED | No provider integration | Real provider, signature verification, event/idempotency reconciliation, refund/failure paths |
| Email | NOT STARTED | Auth service comment only | Real provider/templates/outbox retries, delivery/failure visibility, safe reset links |
| Notifications | NOT STARTED | Mobile image asset only | Persistent scoped inbox, delivery/read states, preferences |
| AI | NOT STARTED | No provider/prompts/tooling | Authorized bounded integration, provider configuration, injection/output/cost controls |
| Admin | NOT STARTED | No roles/admin endpoints/UI | Policies, product management, auditability, tests |
| Analytics/support | NOT STARTED | No implementation | Define real metrics and support flows; role-aware data access |
| Security | PARTIAL | BCrypt, EF parameterization, JWT validation intent | Remove sample key; input validation, throttling, headers/CORS, safe errors/reset, authorization, secret scans |
| Database/domain | PARTIAL | Auth EF Core and category EF6 models; missing course context | Single consistent schema strategy, relationships/indexes/constraints, versioned reversible migrations, relational tests |
| Testing | PARTIAL | Mobile stale counter test; no backend/web tests | Replace outdated test with product tests; unit/API/relational/browser/security coverage |
| Web build/lint | COMPLETE | Baseline npm install, `npm run build` and `npm run lint` passed | Revalidate after changes; add explicit typecheck/test scripts |
| Backend validation | BLOCKED | Source defects verified; .NET SDK absent | Obtain supported SDK/package access, restore/build/test all APIs |
| Mobile validation | BLOCKED | Flutter/Dart absent; stale test inspected | Obtain supported SDK, analyze/test/build |
| Clean code | PARTIAL | Existing layers are useful; copy/paste registrations and divergent types | Focused fixes only; no speculative rewrite |
| Accessibility | NEEDS VALIDATION | No accessibility test or audit | Keyboard/forms/announcements/contrast/semantics/reduced motion/browser tests |
| Performance | NEEDS VALIDATION | Small starter bundle; no product workload | Bounded queries/pagination, client bundles/loading, representative data tests |
| Docker | NOT STARTED | No Dockerfile/compose | Multi-stage non-root images, real service/database startup/health, build validation |
| CI/CD | NOT STARTED | No workflows | Deterministic installs, all builds/tests/security checks, protected deployment process |
| Deployment | NOT STARTED | No target/config | Environment validation, TLS/proxy, migration/release/backup/rollback runbooks |
| Observability | NOT STARTED | Default framework logging only | Structured safe logging, health/readiness, telemetry/error correlation/alerts |
| Documentation | PARTIAL | Minimal READMEs; API README overstates implementation | Correct docs, config/integration instructions and ongoing handoff |
| Product final QA | NOT STARTED | Core workflows absent/unvalidated | Full cross-client journey, real error paths, security/accessibility/deployment verification |
| Final branch/PR | NOT STARTED | Session branch exists; GitHub auth works; no PR | Only push/open final PR after readiness gates; do not publish unfinished work as final |
