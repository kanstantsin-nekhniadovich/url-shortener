# Postgres / SQL Refresh Tickets for This Project

This learning track stays inside the current NestJS + Drizzle URL shortener instead of using isolated demo tables. The existing schema is intentionally small:

- `user`
- `url`

That is enough for CRUD, but not enough for meaningful practice with joins, aggregates, indexing, or performance analysis. The first tickets therefore extend the schema with traffic analytics tables and enough volume to make query plans interesting.

Work through the tickets in order. Tickets 1 and 2 create the schema and data required by the rest.

## Before you start

Project files you will touch most often:

- `src/db/schema.ts`
- `drizzle/*.sql`
- `src/scripts/migrate.ts`
- `src/user/user.repository.ts`
- `src/url/url.repository.ts`

Useful commands in this repository:

```bash
docker compose up -d postgres
npm run db:generate
npm run db:migrate
```

Useful connection options:

1. Run `psql` inside the container:

```bash
docker exec -it url-shortener-db psql -U <POSTGRES_USER> -d <POSTGRES_DB>
```

2. Run `psql` from macOS using a connection string from `.env`.

Important note for this repository: when the host in `POSTGRES_URL` is `postgres`, local Node scripts automatically normalize it to `localhost`, but `psql` on your host machine does not. If you connect from macOS directly, replace the hostname with `localhost`.

## Learning goals covered by this track

This set covers the topics you asked for and keeps them tied to real project behavior:

- joins
- indexes
- migrations
- performance analysis
- `HAVING` and aggregate functions
- `DROP`, `DELETE`, and `TRUNCATE`

## Suggested practice schema

Use these tables in the first ticket so later tasks have realistic data:

### `redirect_event`

Purpose: stores visits to shortened URLs.

Suggested columns:

- `id` bigint identity primary key
- `url_hash` varchar not null references `url(hash)`
- `visited_at` timestamp not null default now()
- `visitor_country` varchar(2) not null
- `referer_host` varchar null
- `device_type` varchar(16) not null
- `response_ms` integer not null

### `tag`

Purpose: labels URLs for reporting and many-to-many join practice.

Suggested columns:

- `name` varchar primary key
- `description` varchar null
- `created_at` timestamp not null default now()

### `url_tag`

Purpose: join table between URLs and tags.

Suggested columns:

- `url_hash` varchar not null references `url(hash)`
- `tag_name` varchar not null references `tag(name)`
- composite primary key: `url_hash`, `tag_name`

Why these tables:

- `redirect_event` gives you enough rows for `EXPLAIN ANALYZE`, aggregates, and index work.
- `tag` + `url_tag` gives you both one-to-many and many-to-many joins.
- all of them are natural extensions of a URL shortener domain.

## Ticket 1: Create Analytics Tables With Proper Migrations

### Goal

Practice schema design and the migration flow already used in this repository.

### Why this matters

Most real Postgres work starts with safe schema evolution. If you are rusty, this is the best way to refresh DDL, foreign keys, constraints, and migration habits.

### Scope

Add `redirect_event`, `tag`, and `url_tag` to `src/db/schema.ts`, generate a new Drizzle migration, inspect the SQL, then apply it.

### Steps

1. Add the three new tables to `src/db/schema.ts`.
2. Include foreign keys back to `url` and `tag`.
3. Add at least one useful constraint. A good example is a check that `response_ms > 0`.
4. Run `npm run db:generate`.
5. Read the generated SQL in `drizzle/` before applying it.
6. Run `npm run db:migrate`.
7. Inspect the tables in Postgres with commands like `\d redirect_event`.

### What to pay attention to

- Why a join table uses a composite primary key.
- When `ON DELETE CASCADE` is helpful and when it is dangerous.
- Why you should create a new migration instead of editing an already-applied one.

### Done when

- the three tables exist in Postgres
- the generated migration is committed
- you can explain every foreign key and constraint you added

### Stretch goal

Add one more data-quality rule, for example a check that `device_type` is one of `desktop`, `mobile`, or `bot`.

## Ticket 2: Seed Realistic Data for SQL Practice

### Goal

Create enough data to make joins, grouping, and performance work meaningful.

### Why this matters

Queries that look fine on 10 rows often behave very differently on 10,000 rows. You need both variety and volume.

### Scope

Seed data for existing and new tables. Make this re-runnable or clearly documented.

### Minimum target dataset

- 8 to 10 users
- 30 to 50 URLs
- 8 to 12 tags
- 2,000 to 10,000 redirect events

### Data design rules

- some users should own many URLs, others only one
- some URLs should have zero redirects
- some URLs should have multiple tags
- redirect events should span multiple days
- countries, referers, and device types should be varied

### Suggested implementation approach

1. Insert users first.
2. Insert URLs linked to those users.
3. Insert tags.
4. Insert `url_tag` rows.
5. Insert `redirect_event` rows with `generate_series` so you do not hand-write thousands of records.

### SQL ideas to practice here

- `INSERT INTO ... VALUES`
- `INSERT INTO ... SELECT`
- `generate_series`
- random-ish distributions with `CASE`

### Hint

Use `generate_series(1, 5000)` and derive values from the generated number with modulo arithmetic. That is enough to create skewed but realistic traffic patterns.

### Done when

- later reporting tickets can run against the dataset without additional manual inserts
- you can rerun the seed process without guessing the order of inserts

### Stretch goal

Write the seed as a committed SQL file or a small script so you can rebuild the lab quickly.

## Ticket 3: Build a Join-Heavy URL Report

### Goal

Refresh `INNER JOIN`, `LEFT JOIN`, and many-to-many joins on a query that actually fits this app.

### Report to build

Return one row per URL with:

- URL hash
- original URL
- owner name
- owner email
- number of tags
- number of redirects
- latest redirect timestamp

### Why this matters

This query forces you to think about relationship shape:

- `user` to `url` is one-to-many
- `url` to `redirect_event` is one-to-many
- `url` to `tag` is many-to-many through `url_tag`

### Core learning point

If you join `redirect_event` and `url_tag` directly in one query, counts can be wrong because one URL row can multiply into many combinations. You need to notice and fix that.

### Good solution paths

- aggregate in subqueries first, then join the aggregated result
- or use `COUNT(DISTINCT ...)` carefully

### Requirements

1. URLs with zero redirects must still appear.
2. URLs with zero tags must still appear.
3. The final result should be ordered by redirect count descending.

### Done when

- the counts are correct for URLs that have both many tags and many redirects
- you can explain why `LEFT JOIN` is required for optional relationships

### Stretch goal

Add a tag list column using `array_agg(DISTINCT tag.name)`.

## Ticket 4: Write Aggregate Queries With `GROUP BY` and `HAVING`

### Goal

Practice summary queries and the difference between `WHERE` and `HAVING`.

### Queries to implement

1. Users who own at least 3 URLs.
2. URLs that received at least 100 redirects in the last 7 days.
3. Tags whose average response time is greater than a threshold you choose.
4. Daily redirect totals by country.

### What you should learn here

- `WHERE` filters rows before grouping
- `HAVING` filters groups after aggregation
- aggregate functions such as `COUNT`, `AVG`, `MIN`, `MAX`, and optionally `array_agg`

### Self-check questions

- Why is the date filter for the last 7 days a `WHERE` clause and not a `HAVING` clause?
- Why is “at least 100 redirects” a `HAVING` clause?
- What happens if you group by too many columns?

### Done when

- you have at least four working aggregate queries
- you can explain each `GROUP BY` column choice

### Stretch goal

Compare `COUNT(*)` and `COUNT(column_name)` on a query where some joined values are null.

## Ticket 5: Compare `DELETE`, `TRUNCATE`, and `DROP` Safely

### Goal

Refresh the differences between row removal, table clearing, and schema removal.

### Why this matters

Confusing these commands in production is expensive. The point is not just syntax, but understanding side effects, locking, foreign keys, and recovery options.

### Safe lab setup

Create a scratch table such as `staging_redirect_import` and populate it with a few rows. Do not use your main business tables for the first comparison.

### Exercises

1. Run `DELETE ... WHERE ... RETURNING *` and inspect which rows were removed.
2. Reinsert rows and run `TRUNCATE staging_redirect_import`.
3. Recreate the data and run `TRUNCATE ... RESTART IDENTITY` if you used an identity column.
4. Finally run `DROP TABLE staging_redirect_import` and recreate it.

### Questions to answer in your notes

- Which command removes rows but keeps table structure?
- Which command is usually fastest for clearing the whole table?
- Which command removes the table definition itself?
- How do foreign keys affect `TRUNCATE` and `DROP`?
- Which of these commands should almost always be wrapped in extra caution in application environments?

### Important Postgres notes

- `DELETE` is DML and can target specific rows.
- `TRUNCATE` is very fast for whole-table clearing but takes a stronger lock.
- `DROP` removes the schema object itself.
- In Postgres, `TRUNCATE` and `DROP` are transactional, but they are still dangerous because they affect table availability and dependencies.

### Done when

- you can explain when each command is appropriate
- you have personally observed the difference instead of only reading about it

### Stretch goal

Repeat the experiment inside an explicit transaction and roll it back.

## Ticket 6: Add Indexes Based on Real Query Shapes

### Goal

Practice choosing indexes from access patterns instead of adding them blindly.

### Candidate query patterns in this project

- find all URLs for one user
- count or filter redirects for one URL
- fetch recent redirects for one URL ordered by time
- filter redirect events by time range

### Indexes to consider

- `url(user_id)`
- `redirect_event(url_hash)`
- `redirect_event(url_hash, visited_at DESC)`
- `redirect_event(visited_at)`
- optionally `url_tag(tag_name)`

### Important learning point

Do not just add every index from the list. Decide which are actually useful and which may be redundant. For example, a composite index may make a single-column index unnecessary for some queries.

### Steps

1. Write down which query each index is supposed to help.
2. Add the chosen indexes through a migration.
3. Apply the migration.
4. Rerun the target queries.

### What to think about

- index usefulness depends on filter and sort order
- indexes speed reads but make inserts and updates more expensive
- column order in composite indexes matters

### Done when

- each added index has a written reason
- you can point to at least one query plan that improved after indexing

### Stretch goal

Decide whether `redirect_event(url_hash)` is still needed after adding `redirect_event(url_hash, visited_at DESC)` and justify your answer.

## Ticket 7: Analyze Query Performance With `EXPLAIN ANALYZE`

### Goal

Refresh how to inspect query plans instead of guessing.

### Queries to analyze

- the report query from Ticket 3
- one aggregate query from Ticket 4
- one recent-redirect lookup that should benefit from a composite index

### Command shape

Use forms like:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT ...;
```

### What to look for

- `Seq Scan` versus `Index Scan` or `Bitmap Index Scan`
- estimated rows versus actual rows
- sort steps that could be avoided by indexing
- whether joins use hash join, merge join, or nested loop
- total execution time before and after indexing

### Learning checkpoint

After seeding lots of rows, statistics matter. If a plan looks surprising, run `ANALYZE` on the relevant table and compare again.

### Done when

- you captured at least one before/after plan comparison
- you can explain why the planner changed its choice

### Stretch goal

Write a short markdown table with query name, old plan summary, new plan summary, and conclusion.

## Ticket 8: Build a Daily Summary Table With a Backfill Query

### Goal

Combine migrations, aggregates, and data movement into one realistic analytics task.

### Feature to add

Create a `daily_url_stats` table that stores one row per URL per day.

Suggested columns:

- `day` date not null
- `url_hash` varchar not null references `url(hash)`
- `redirect_count` integer not null
- `avg_response_ms` numeric or integer not null
- `unique_country_count` integer not null
- composite primary key: `day`, `url_hash`

### Steps

1. Add the table through a migration.
2. Backfill it from `redirect_event` using `INSERT INTO ... SELECT`.
3. Join it back to `url` and `user` to build a “top URLs by day” query.

### Why this matters

This is a classic database pattern: raw event table for detail, summary table for faster reporting.

### What to learn

- aggregate backfills
- grouping by truncated dates
- summary-table design
- tradeoff between raw data flexibility and read performance

### Done when

- the summary table can be populated from historical data
- you can query “top URLs for a day” without scanning the entire event table each time

### Stretch goal

Use `ON CONFLICT DO UPDATE` so the backfill can be rerun safely.

## Ticket 9: Expose One Analytics Query Through the App

### Goal

Make the SQL work visible through the existing project structure instead of leaving it only in `psql`.

### Suggested feature

Add one repository method and one read endpoint for a report such as:

- top URLs in the last 7 days
- per-user URL summary
- daily traffic for one URL

### Good project touch points

- `src/url/url.repository.ts`
- `src/url/url.service.ts`
- `src/url/url.controller.ts`
- or the equivalent user-side files if your report is user-centric

### Why this matters

SQL knowledge sticks better when you connect it to application code, DTOs, and response shapes.

### Done when

- the query result is available through one HTTP endpoint
- the endpoint is backed by the SQL you developed in earlier tickets

### Stretch goal

Compare the raw SQL version and a Drizzle query-builder version, then write down which was easier to reason about.

## Recommended order of execution

1. Ticket 1
2. Ticket 2
3. Ticket 3
4. Ticket 4
5. Ticket 5
6. Ticket 6
7. Ticket 7
8. Ticket 8
9. Ticket 9

## What “good” looks like at the end

By the time you finish this track, you should be comfortable answering these questions without guessing:

- When do I need `LEFT JOIN` instead of `INNER JOIN`?
- Why did my counts explode after joining two one-to-many relationships?
- When should a filter go in `WHERE` versus `HAVING`?
- Which index shape supports this query pattern?
- How do I prove an index helped instead of assuming it did?
- When is `DELETE` safer than `TRUNCATE`, and when is `DROP` appropriate?
- How should schema changes move through this repository’s migration workflow?

If you want extra discipline, keep a short note for each ticket with:

- the SQL you wrote
- the mistakes you made
- what the planner did
- what you would change in a real production schema
