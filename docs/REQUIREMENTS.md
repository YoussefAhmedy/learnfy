# Requirements matrix

Updated 2026-10-03. Status is evidence-based, not based on the unavailable previous chat.
`COMPLETE` requires implementation **and validation**. External configuration is separate from
coding work. The continuation prompt supplies themes, not the missing master prompt's precise
scope/acceptance criteria; original-prompt compliance remains **BLOCKED** until recovered.

| Requirement | Status | Evidence at recovery | Remaining work |
|---|---|---|---|
| Preserve/recover implementation | COMPLETE | Full history fetched; both remote refs inspected; clean initial tree; verified bundle; recovery docs | Preserve future checkpoints; previous Arena-only artifacts cannot be recovered from current refs |
| Original master prompt compliance | BLOCKED | No matching modernization artifacts; user approved continuing verified checkout | Preserve all request themes; exact unavailable original acceptance criteria cannot be certified |
| Full-stack architecture | PARTIAL | React/Flutter plus three ASP.NET projects; service/repository layers | Repair builds, shared domain/context, DI, contracts, real client integration |
| Web UI/UX | NOT STARTED | `web/src/App.tsx` is Vite counter starter | Implement actual workflows consistently with existing Learnfy branding |
| Mobile UI/UX | PARTIAL | Onboarding/signup/OTP/landing/profile/settings with custom tokens/assets | Wire real APIs; finish routes/tabs, responsive/error/loading/empty states |
| Authentication | NEEDS VALIDATION | Existing layers repaired; real BCrypt/JWT, subject stamps, atomic hashed reset/outbox, me/logout and tests | Compile/integration validate, configure DB/JWT/email, finish clients/profile/session UX |
| Authorization | NEEDS VALIDATION | Verified-subject personalization, active-user/stamp checks, Admin inactive-category guard/policy | Execute isolation/revocation tests; enforce roles across remaining features |
| Courses/products | PARTIAL | Two incompatible Course models, catalog service/repository/DTOs | Reconcile schema, migrations, valid queries/detail status, authoring and course consumption |
| Categories | PARTIAL | Category service/repository rules and DTOs | Port incompatible legacy host integration; DI, migrations, inactive access checks |
| Search | PARTIAL | EF filter query, search endpoint | Validation, stable global sort-before-page, client integration, tests |
| Recommendations | PARTIAL | Rating/curated scoring, exclusion of stored recommendations | Secure user identity, accurate documented algorithm, real data, tests; not an AI feature |
| Cart | NOT STARTED | No implementation | Persistent ownership-scoped cart, authoritative pricing, tests/UI |
| Checkout | NOT STARTED | No implementation | Server totals, payment session, error/retry behavior, tests/UI |
| Orders | NOT STARTED | No implementation | Order state machine, audit records, ownership, fulfillment/entitlements |
| Payments | NOT STARTED | No provider integration | Real provider, signature verification, event/idempotency reconciliation, refund/failure paths |
| Email | NEEDS VALIDATION | Real Resend sender/encrypted transactional outbox/leased retries now implemented | Compile/test worker, configure verified sender/API key/public URL/persistent protection keys, validate real delivery |
| Notifications | NOT STARTED | Mobile image asset only | Persistent scoped inbox, delivery/read states, preferences |
| AI | NOT STARTED | No provider/prompts/tooling | Authorized bounded integration, provider configuration, injection/output/cost controls |
| Admin | NOT STARTED | No roles/admin endpoints/UI | Policies, product management, auditability, tests |
| Analytics/support | NOT STARTED | No implementation | Define real metrics and support flows; role-aware data access |
| Security | PARTIAL | BCrypt, EF parameterization, JWT validation intent | Remove sample key; input validation, throttling, headers/CORS, safe errors/reset, authorization, secret scans |
| Database/domain | PARTIAL | Auth EF Core and category EF6 models; missing course context | Single consistent schema strategy, relationships/indexes/constraints, versioned reversible migrations, relational tests |
| Testing | PARTIAL | 13 web transport tests pass; relational/API and mobile product/OTP tests added | Run backend/mobile tests; add migrations, browser/commerce/security/accessibility coverage |
| Web build/lint | COMPLETE | Baseline npm install, `npm run build` and `npm run lint` passed | Revalidate after changes; add explicit typecheck/test scripts |
| Backend validation | NEEDS VALIDATION | Source/build configuration repaired; API/relational regression tests and pinned CI added; local .NET SDK absent | Run real CI/compiler/tests, fix errors, validate migrations/SQL Server |
| Mobile validation | NEEDS VALIDATION | Fake OTP blocked, product tests replace counter; pinned Flutter 3.47.6 CI added; local SDK absent | Execute analyze/tests/build and fix real failures |
| Clean code | PARTIAL | Existing layers are useful; copy/paste registrations and divergent types | Focused fixes only; no speculative rewrite |
| Accessibility | NEEDS VALIDATION | No accessibility test or audit | Keyboard/forms/announcements/contrast/semantics/reduced motion/browser tests |
| Performance | NEEDS VALIDATION | Small starter bundle; no product workload | Bounded queries/pagination, client bundles/loading, representative data tests |
| Docker | NOT STARTED | No Dockerfile/compose | Multi-stage non-root images, real service/database startup/health, build validation |
| CI/CD | PARTIAL | Pinned web/backend/mobile validation workflow added | Execute checks, migration/container/security/integration gates, deployment/release protection |
| Deployment | NOT STARTED | No target/config | Environment validation, TLS/proxy, migration/release/backup/rollback runbooks |
| Observability | NOT STARTED | Default framework logging only | Structured safe logging, health/readiness, telemetry/error correlation/alerts |
| Documentation | PARTIAL | Minimal READMEs; API README overstates implementation | Correct docs, config/integration instructions and ongoing handoff |
| Product final QA | NOT STARTED | Core workflows absent/unvalidated | Full cross-client journey, real error paths, security/accessibility/deployment verification |
| Final branch/PR | NOT STARTED | Session branch exists; GitHub auth works; no PR | Only push/open final PR after readiness gates; do not publish unfinished work as final |
