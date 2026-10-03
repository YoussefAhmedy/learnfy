# Client continuation checkpoint — 2026-10-03

## Recovery at resume

Current files matched all 287 tracked blobs at pushed `7514fd5`; no user file was replaced.
The sandbox had restored only file changes and initial shallow Git metadata. Full refs were
fetched; verified existing checkpoint index/HEAD were advanced with `read-tree`/`update-ref`
without altering working files. A complete pre-client bundle was saved in ignored `.recovery/`.
Latest existing CI `37093910230` is green. Work stays on `arena/01a0fdf3-learnfy`.

## Newly discovered work (preserve; do not blindly merge)

`origin/arena/01a10082-learnfy` at `717f902676bf9ed04bb3ee19dd1e1c1f4622a2e1`
was created after the previous recovery audit. It is based on original `72eebdd`, not our
stabilization. Its commit/history are preserved remotely and in the bundle.

- Useful: documented LearnSpring cream/charcoal/coral web direction, responsive catalog/card/
  navigation layouts, lesson/player/library/admin component prototypes and keyboard controls.
- Partial/unsafe: AppContext defaults to a fake logged-in user, seeded purchased courses/order,
  client-generated completed payments/certificates and localStorage entitlement authority.
- Express prototype accepts arbitrary userId as media entitlement, returns random stream tokens,
  completes orders and claims receipt delivery without payment/email providers. It does not
  implement the README's HMAC/idempotent/production claims. No backend/mobile/test validation.
- That branch retains broken original .NET and fake mobile OTP rather than our fixes. Its CI
  builds only the web; it is not evidence that business workflows are validated.

Do not import its server/mock context/business authority or overwrite current APIs/migrations/
CI/mobile fixes. Use visual/component work only where it can be safely connected to current
contracts. Preserve all other prototypes in the original remote history for later verified
learning/content/commerce phases; do not falsely advertise them as finished features.

## Current unit

Implement real authenticated web/mobile clients and catalog/profile workflows, reusing visual
work rather than rebuilding it. Add server profile updates with verified-subject ownership,
allowlisted fields and tests. Web tokens stay in memory; no localStorage role/entitlement trust.
Phone OTP remains explicitly unconfigured, not a prerequisite for real email/password login.

Validation, commits, exact progress and next unit must be recorded in CONTINUATION.md before
ending. The overall requirements matrix remains active; no final PR before product readiness.

### Web milestone

- LearnSpring visual/layout direction reused and connected to actual server DTOs. No static mock
  catalog/user/order/entitlement/AI or fabricated popularity counters imported.
- Real URL-based home/catalog/detail/login/register/recovery/account routes, server profile PATCH,
  runtime schema validation, in-memory expiring sessions and truthful failed logout/recovery.
- Accessible forms, navigation, no-stale-request loading/retry/empty states and reset-fragment
  cleanup (including StrictMode regression). Currency is not inferred from historic numeric prices;
  course page openly notes purchasing/content are not implemented yet.
- Web type/lint/build/audit and 47 tests pass locally; Vite preview runs on 0.0.0.0:5173.
  Local backend SDK still unavailable; actual API/DOM browser integration is to run in CI.
- Mobile real transport/repository/session/login/signup/recovery integration now in progress,
  preserves existing Poppins/pink theme; do not claim it analyzed/tested until CI confirms.
