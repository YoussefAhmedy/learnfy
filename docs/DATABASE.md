# Database setup and recovery safety

Learnfy retains SQL Server as its production-capable provider and adds SQLite for explicit
local development/testing. All three existing APIs use **one** `YourApp.Data.AppDbContext`.
Provider-specific migration assemblies prevent incompatible identity/type definitions or
suppressed pending-model warnings. No API automatically modifies the schema at startup.

## Fresh development database

Prerequisites: SDK from `global.json`, Node 22 LTS, Python 3.

```bash
# Creates .env with a random key only if absent; never overwrites existing secrets.
./scripts/setup-development.sh --seed
./scripts/dev.sh
```

The seed is **development-only recovered sample metadata**, not real production offerings,
paid courses, enrollments, valid users or sent emails. Re-seeding a non-empty catalog is refused.
The three category names and ten courses come from preserved historical SQL. There is no
invented user count, cached category count, fake purchase, or sample account/password.
Use the registration endpoint to create a real account in your development database.

SQLite connection paths must be **absolute**: APIs have different project directories. The
setup script ensures they use the same file and signing configuration. Database, protection
keys, runtime logs and `.env` stay out of Git.

## Fresh SQL Server database

Provision SQL Server with an empty database or migration credentials allowed to create it.
Supply server-only environment variables through a secret manager:
`Database__Provider=SqlServer`, `ConnectionStrings__DefaultConnection`, and the strong JWT key
shared by the APIs. Then run:

```bash
dotnet run --project web/APIs/Learnfy.Database -- migrate
dotnet run --project web/APIs/Learnfy.Database -- status
```

The migration CLI refuses an existing database with unknown tables and no Learnfy migration
history. **It does not guess, drop tables, call EnsureCreated, erase data, or apply old SQL.**
Production seeding is refused. Existing-version migrations are applied explicitly once by an
operator/release job, never concurrently by three API startups. Back up first and use a
least-privileged runtime account after migration.

## Schema / invariants

- Users: unique normalized email and username; password hash only; reset **hash**, expiry,
  random security stamp and active/role fields. No reset secret is returned from an API.
- Categories: primary ID, unique name and active/order indexes. Courses refer to the unique
  name, reconciling the actual historic string-category schema with category relationships.
  Referenced category deletion is restricted; changing a category name needs an intentional
  migration/update of its course references, not a silent rename.
- Courses: single shared model, nullable rating/price, publication flag, stable query indexes.
  Price is stored as an integer in **hundredths**, round-trips exactly, and rejects negative or
  more-than-two-decimal values instead of truncating. No currency/payment semantics are inferred
  from legacy numeric prices. Commerce must introduce explicit currency before real charging.
- UserCourseRecommendations: user/course FKs and unique pair. Public ranking is deterministic
  rating/editorial selection; it is not AI or evidence of learning preferences.
- EmailOutboxMessages: encrypted credential-bearing body, expiry, attempt schedule, lease token,
  sent/provider-accepted time and redacted error code. Provider acceptance is not proof of inbox
  delivery. Keep persistent protection keys safe, shared across worker replicas, and backed up.

## Adopting a real legacy database (manual, required if one exists)

No actual legacy database is attached/configured here. Do not run the initial migration over it.

1. Take and verify an isolated backup; inventory its real schema, collation, counts and hashes.
2. Compare with current migrations; historical SQL is only design evidence, not deployable:
   `a089c73` auth ALTER/sample rows, `e63b21b` courses/recommendations, `66f99a8` categories.
3. Resolve duplicate email/username case collisions before creating normalized unique indexes.
   Reject invalid placeholder BCrypt hashes; require real password recovery for affected accounts.
4. Map historic `ID`/`Id`, `Password`/`PasswordHash`, string `Category`/`CategoryID` variants
   deliberately. Do not duplicate course tables or assume missing parent records exist.
5. Confirm original price units/currency and reject fractions beyond two decimals before conversion
   to integer hundredths. Never silently re-price live products or assume USD/EGP.
6. Backfill security stamps/active/publication fields; invalidate old raw reset credentials/tokens.
   Recompute category counts from rows; don't import the sample cached counts/triggers.
7. Import into a separately versioned fresh database, preserving authoritative business IDs where
   required and validating row counts, FKs, prices and uniqueness. Add mapping/import tooling only
   after the real schema is known. No destructive automatic adoption script is included.
8. Rehearse on a copy, verify API/authorization tests, then schedule cutover/rollback with backups.

## Changing the schema

```bash
dotnet tool restore
# Set provider and connection environment securely. Design-time generation does not require data.
Database__Provider=SqlServer dotnet ef migrations add MeaningfulName \
  --project web/APIs/Learnfy.Migrations.SqlServer --startup-project 'web/APIs/Authentication API'
Database__Provider=Sqlite dotnet ef migrations add MeaningfulName \
  --project web/APIs/Learnfy.Migrations.Sqlite --startup-project 'web/APIs/Authentication API'
```

Inspect both generated migrations and snapshots; validate apply/current-model/rollback on
**isolated disposable databases**. Do not delete or regenerate completed migration history.
Downgrades can delete data; production rollback requires a rehearsed restore/forward-fix plan,
not automatic `database update 0`. A relational test database is not proof of production cutover.
