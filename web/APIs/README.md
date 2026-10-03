# Learnfy API suite

The original authentication/course/category service and repository layers are retained and
repaired on .NET 10. `Learnfy.Data` owns their shared relational model. See root README and
`docs/DATABASE.md` for configuration and migration commands. Do not run the historical SQL
or use generated `obj` metadata as evidence of a successful build.

## Implemented routes

Auth (`5204`):
- `POST /api/auth/register` → 201, validated unique identity and BCrypt hash; never accepts role
- `POST /api/auth/login` → 200 / 401, short-lived signed token and allowlisted user DTO
- `GET /api/auth/me` → authenticated current user
- `POST /api/auth/logout` → revoke all current user's access tokens via security stamp
- `POST /api/auth/forgot-password` → uniform 202 if configured; explicit 503 if mail unavailable
- `POST /api/auth/reset-password` → atomic one-use hashed token, password/session invalidation

Courses (`5174`):
- `GET /api/courses`, `/api/courses/search`, `/api/courses/recommendations`
- `GET /api/courses/trending?count=10` (top-rated, not claimed as behavioral popularity)
- `GET /api/courses/{id}` → 200 / 404
- `GET /api/courses/recommendations/personalized` → verified token subject only; no userId route

Filters: `SearchTerm`, `Category`, `Instructor`, `MinPrice`, `MaxPrice`, `MinRating`, `Page`,
`PageSize` (1–100), `SortBy` (rating/price/name/newest/recommended), `SortOrder` (asc/desc).
Sorting is global and deterministic before pagination; inactive categories/unpublished courses
are not exposed. Ranking preserves the original rating/editorial formula; it is **not AI**.

Categories (`5058`):
- `GET /api/categories`, `/api/categories/popular?count=5`
- `GET /api/categories/{id}`, `/api/categories/by-name/{name}` (legacy `{name}` alias retained) → active public details
- `includeInactive=true` requires Admin; course counts are computed from published rows

Every service: `/health/live`, `/health/ready`; development-only `/openapi/v1.json`.
Errors use proper HTTP statuses and safe ProblemDetails with trace IDs. CORS uses exact origins
(or same-origin proxy by default). JWT revocation/active-user checks also run in catalog APIs.
Rate limiting, request validation and secure response headers are implemented, not inferred
from a dependency declaration.

## Not implemented / not production-certified

No cart/orders/payment/fulfillment/AI/admin authoring/notification endpoints are claimed here.
Category-course/statistics endpoints described in the initial README remain a tracked gap;
course filtering is available through `/api/courses?Category=...`. Password recovery provider
acceptance is not proof of inbox delivery. See `docs/REQUIREMENTS.md` for the full remaining scope.
