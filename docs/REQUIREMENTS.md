# Requirements matrix

Updated 2026-10-03. The user approved continuing the verified checkout; the earlier master
prompt/artifacts remain unavailable. All themes in the continuation request remain active.
Statuses below reflect source AND actual validation, not dependency declarations. **This is a
safe recovery/core-stabilization checkpoint, not a completed production product.**

| Requirement | Status | Evidence now | Remaining work |
|---|---|---|---|
| Recover/preserve current work | COMPLETE | Full 121-commit original history, both original remote branches, original mobile assets/UI retained; bundles and checkpoints; no original tags/stashes existed | Keep future checkpoints/handoff current; absent Arena-only patch cannot be recovered from these refs |
| Original master prompt compliance | BLOCKED | No original prompt or modernization artifacts found; user chose current checkout | Exact unavailable acceptance criteria cannot be certified; retain all supplied themes |
| Architecture | PARTIAL | Three existing service/repository APIs repaired; one shared domain/context; nine projects build in real CI | Client integration, remaining business modules and contracts; no speculative rewrite |
| Web UI/UX | NOT STARTED | Vite starter retained; reliable transport/proxy/testing foundation | Actual Learnfy catalog/auth/account/workflow UI; reuse mobile branding instead of unrelated redesign |
| Mobile UI/UX | PARTIAL | Existing onboarding/signup/Arabic landing/profile design preserved; onboarding transition regression fixed | Wire real auth/catalog/profile APIs; finish login/tabs/errors/empty states/responsiveness |
| Auth API core | COMPLETE | CI register/login/hash/normalized uniqueness, me/logout, real HTTP statuses, reset one-use/revocation/UTF-8 policy and role-injection tests | Production credentials/security review and client/session UX are separate incomplete requirements |
| Authentication product workflow | PARTIAL | Real server implementation; mobile signup still presentation-only, web starter | Connect clients, profile editing, session-expiry UX; define refresh/device lifecycle deliberately |
| Authorization | PARTIAL | Verified JWT subject/stamp/active-user checks across APIs; no userId personalization bypass; Admin inactive-category guard | Policies/ownership on commerce/admin/AI/support; role change/audit workflows and additional isolation tests |
| Core catalog API | PARTIAL | Filtering/search/detail/ranking, stable global sorting/paging, publication and inactive-category privacy pass relational/API CI | Product authoring, currency, course content/consumption, entitlements and clients |
| Categories | PARTIAL | EF Core/ASP.NET port, actual counts/bounded popular-course projection, inactive access tests | Category-course/statistics endpoints and management; public name compatibility retained |
| Search | PARTIAL | Parameterized bounded filters/global sort/page tests pass | Client search UX, cancellation, representative-data/index performance |
| Recommendations | PARTIAL | Original rating/editorial formulas preserved; authenticated subject exclusion and deterministic ordering pass | Real preference/history models, client integration; not falsely described as AI |
| Cart | NOT STARTED | No implementation claimed | Persistent owner-scoped cart, authoritative pricing/currency, tests/UI |
| Checkout | NOT STARTED | No implementation claimed | Real server totals/session, retry/cancellation/error flows, tests/UI |
| Orders | NOT STARTED | No implementation claimed | Ownership, state transitions, audit records, entitlements/fulfillment |
| Payments | NOT STARTED | No mock success/provider endpoint added | Real configured provider, signed webhooks/server verification, event/order idempotency, refunds/failure tests |
| Email | PARTIAL | Real Resend HTTP integration, encrypted transactional outbox, lease/retry/idempotency/error handling; queue + acknowledgement/worker success/retry/no-fake-acceptance tests pass CI | Retention/dead-letter operations, verified sender/key/public URL/key persistence, actual provider/inbox delivery |
| Phone OTP | BLOCKED | Fake delay-success/unconditional navigation removed; default gateway explicitly unavailable; provider-only acknowledgement tests pass | Real authorized backend SMS integration and configuration; never embed provider credentials in Flutter |
| Notifications | NOT STARTED | No implementation claimed | Persistent scoped inbox/preferences/delivery/read flows |
| AI | NOT STARTED | No provider/prompts/tool permissions exist | Authorized bounded provider integration, data access, injection/output/cost/rate controls; credentials |
| Admin | NOT STARTED | Admin role/policy foundation only, no fake management UI | Authoring/management, bootstrap, audit logs, policies/tests |
| Analytics/support | NOT STARTED | No fabricated metrics/tickets | Define real metrics/support workflow, scoped API/UI/data access |
| Security | PARTIAL | Sample signing key removed; strong-key startup guard, BCrypt/hashed reset, safe statuses/DTOs, stamp revocation, throttling, exact CORS, headers/traces; vulnerable AutoMapper removed | Full threat/security review; trusted production proxies/TLS, remaining feature access controls, retention/secrets operations |
| Core schema/migrations | COMPLETE | Two actual generated/provider-specific migrations/snapshots inspected and committed; real SQLite AND SQL Server apply/reapply/current-model/rollback, exact money and unknown-table preservation pass CI | Commerce/content schemas remain future work; no production database deployment claimed |
| Legacy database adoption | BLOCKED | No real existing DB configured; CLI refuses unknown unversioned tables; historical SQL inspected and retained in history | Backup/inventory, duplicate/hash/FK/currency audit and explicit import plan for actual database |
| Development setup | COMPLETE | Guarded migrate/optional recovered sample seed, private random environment, shared absolute DB path, existing .env preservation; smoke-tested in CI | Native mobile base URL and all remaining clients; requires supported local toolchains |
| Testing | PARTIAL | 14 web tests, 20 backend/email/migration tests incl real SQL Server, 8 mobile product/OTP/validator tests pass | Broader security/provider/browser/accessibility/performance/commerce coverage; no tests disabled |
| Core build/type/lint | COMPLETE | Web type/lint/production build/audit, all nine .NET projects and Flutter analyze pass CI | Revalidate every further change; product-wide readiness not implied |
| Clean code | PARTIAL | Layers retained, duplicate models/query logic corrected, explicit public DTO mappings, stale generated/legacy/weather stubs removed from tracking after backup | Focused future feature/code review, not endless architectural refactoring |
| Accessibility | NEEDS VALIDATION | No completed product accessibility audit | Keyboard/forms/announcements/contrast/RTL/reduced-motion/browser tests |
| Performance | NEEDS VALIDATION | Bounded queries/page sizes/count projections/indexes; deterministic ordering | Real workloads, query plans, bundle/loading/responsive profiling |
| Docker | NOT STARTED | CI uses real SQL Server container, NOT application images | Non-root multi-stage API/web/migration images/compose; actual app image/startup validation |
| CI/CD | PARTIAL | Pinned actions, locked restores, real web/.NET/Flutter tests, SQL Server integration and dev setup smoke; Check API diagnostics | Containers, browser/security/accessibility gates, protected release/deploy process |
| Deployment | NOT STARTED | No deployment target/production app advertised | TLS/reverse proxy, trusted IPs, environment/migration/backup/rollback runbooks and actual target validation |
| Observability | PARTIAL | Safe ProblemDetails/trace IDs, health/readiness, redacted outbox failures and accessible CI reports | Metrics/tracing/error reporting/alerts and operational dashboards; no external service pretend-connected |
| Documentation | PARTIAL | Recovery audit, exact handoff, evidence matrix, honest API/root/database docs and runnable dev scripts | Product/provider/deployment documentation as remaining workflows are implemented |
| Final product QA | NOT STARTED | Explicitly no end-to-end finished-product claim | Complete all workflows, real error/loading/empty/console/route/accessibility/security checks |
| GitHub workflow | PARTIAL | All logical checkpoints pushed only to `arena/01a0fdf3-learnfy`; original main/other branch untouched | Final PR intentionally NOT opened: broad product requirements unfinished; do not publish as production-ready |
