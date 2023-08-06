# Data Modeling

This document provide guidelines when creating tables in **PostgreSQL** database which is used by _Hasura_ to expose GraphQL APIs securely.

## Style guide

### Avoiding nullable columns

Use a `NOT NULL` constraint whenever possible to enforce having a value on every column.
`NULL` values can easily introduce errors when not handled correctly, and for many fields it makes sense to always have a value anyways.

For example, a "revision" text column can use NULL to represent no revision, or instead `""` (empty string).
On the other hand, it makes sense to represent a `"deleted_at"` timestamp field as`NULL`, meaning `"this row has not been deleted"`.

When NULL fields are necessary, remember to use 'Null\* types' in **Go** when querying this data. Otherwise row.Scan will error after encountering a NULL value.

```go
var s sql.NullString
// Column name can be NULL
err := db.QueryRow("SELECT name FROM foo WHERE id=?", id).Scan(&s)
...
if s.Valid {
   // use s.String
} else {
   // NULL value
}
```

### Recommended columns for all entity tables

> Exception is for `type tables` or `enum tables` which follow [Enum Tables](#enum-tables) specifications.

- **id** is database generated UUID primary key.
  - i.e. `id uuid DEFAULT gen_random_uuid() NOT NULL`
- **created_at** not null default `now()` set when a row is first inserted and never updated after that.
  - i.e., `created_at timestamp with time zone DEFAULT now() NOT NULL`
- **updated_at** not null default `now()` set when a row is first inserted and updated on every update.
- **deleted_at** set to a `not null` timestamp to indicate the row is deleted (called soft deleting). This is preferred over hard deleting data from our db (see discussion section below).
  - i.e. `deleted_at timestamp with time zone`
  - When querying the db, rows with a non-null `deleted_at` should be excluded.
- **created_by** not null text populated with active application user's email derived from OpenID Connect session token. Set when a row is first inserted and never updated after that.
  - i.e., `created_by character varying NOT NULL`
- **updated_by** not null text populated with active application user's email derived from OpenID Connect session token. Set when a row is first inserted and updated on every update.
- **display_name** not null text represent entity display name. Generally we add _unique constraint_ on this column along with `organization` column to avoid confusion to users.
  - i.e., `display_name character varying NOT NULL`
- **description** optical text discribing the above entity.
- **organization** not null text having foreign-key reference to `organization` enum table.

#### Optional columns

- **tags** Optional text array used to associate arbitrary categories to an entity. e.g., `public`, `confidential` etc.
  - **Tags** is like **Categories**, but more **arbitrary**.
  - i.e. `tags text[]`
- **annotations** Optional key/value pairs to associate arbitrary metadata to an entity. e.g., `env -> prod`, `size -> large`, `tire -> free` etc.
  - i.e. `annotations public.hstore`

The timestamps are useful for forensics if something goes wrong, they do not necessarily need to be used or exposed by our graphql APIs. There is no harm in exposing them though.

Example

```sql
CREATE TABLE "widgets" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	"updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
	"deleted_at" TIMESTAMP WITH TIME ZONE,
	"created_by" character varying NOT NULL,
	"updated_by" character varying NOT NULL,
	"display_name" character varying NOT NULL,
	"organization" character varying NOT NULL,
	"description" character varying,
	"tags" text[],
	"annotations" public.hstore
);
ALTER TABLE ONLY public.widgets
    ADD CONSTRAINT widgets_organization_fkey FOREIGN KEY (organization) REFERENCES public.organization(value);
```

> we use `camelCase` field names in GraphQL for corresponding `underscore` column names in database.

### Enum Tables

Enum type fields are restricted to a fixed set of allowed values.

hasura recommend Using foreign-key references to a single-column. check the hasura [documentation](https://hasura.io/docs/latest/schema/postgres/enums/)

#### Creating an enum compatible table

To represent an enum, we’re going to create an \_enum table, which for Hasura’s purposes is any table that meets the following restrictions:

1. The table must have a single-column primary key of type `text`. The values of this column are the legal values of the enum, and they must all be [valid GraphQL enum value names](https://graphql.github.io/graphql-spec/June2018/#EnumValue).
1. Optionally, the table may have a second column, also of type `text`, which will be used as a description of each value in the generated GraphQL schema.
1. The table must not contain any other columns.
1. The table must contain at least 1 row.
   **For example,** to create an enum that represents our user roles, we would create the following table:

```sql
CREATE TABLE user_role (
  value text PRIMARY KEY,
  comment text
);

INSERT INTO user_role (value, comment) VALUES
  ('user', 'Ordinary users'),
  ('moderator', 'Users with the privilege to ban users'),
  ('administrator', 'Users with the privilege to set users’ roles');
```

### Hard vs soft deletes

Definitions:

- A "hard" delete is when rows are deleted using `DELETE FROM table WHERE ...`
- A "soft" delete is when rows are deleted using `UPDATE table SET deleted_at = now() WHERE ...`
  Hard deletes are hard to recover from if something goes wrong (application bug, bad migration, manual query, etc.).
  This usually involves restoring from a backup and it is hard to target only the data affected by the bad delete.

Soft deletes are easier to recover from once you determine what happened.
You can simply find the affected rows and UPDATE table `SET deleted_at = null WHERE ....`

The decision we have made is to use `Soft Delete`

#### Setup TABLE for soft-delete

First of all, we should add a _global_ variable for controlling hard/soft deletion _(superuser access is necessary to do this)_:

```sql
ALTER DATABASE postgres SET rules.soft_deletion TO on;
--- to revert:
---ALTER DATABASE postgres RESET rules.soft_deletion;
```

If you don't have _superuser_ role, you can create _session_ variable:

> limitation is, you need to set _session_ variable for every reconnection.

> Error will be raised when you use a single quote instead a double quote around the session variable name. The syntax is:

```sql
SET SESSION "rules.soft_deletion" = 'on';
-- verify value
SELECT current_setting('rules.soft_deletion')  AS "The Value";
```

Next, create **RULE** to make soft instead of hard deletion

```sql
CREATE RULE policies_soft_deletion_rule AS
    ON DELETE TO policies
   WHERE current_setting('rules.soft_deletion'::text) = 'on'::text DO INSTEAD  UPDATE policies SET deleted_at = now()
  WHERE policies.id = old.id;
COMMENT ON RULE policies_soft_deletion_rule ON public.policies IS 'Make soft instead of hard deletion';
```

Finally, follow hasura [Setting up Soft Deletes for Data](https://hasura.io/docs/latest/schema/common-patterns/data-modeling/soft-deletes/) document to Set up appropriate `insert/update/delete` permissions.

**Testing**

```sql
SET rules.soft_deletion TO on;
SELECT current_setting('rules.soft_deletion');
DELETE FROM public.policies WHERE id = '49492040-72e7-4a81-9410-05a05c258420';
SELECT id, deleted_at FROM public.policies WHERE id = '49492040-72e7-4a81-9410-05a05c258420';

SET rules.soft_deletion TO off;
SELECT current_setting('rules.soft_deletion');
DELETE FROM public.policies WHERE id = '49492040-72e7-4a81-9410-05a05c258420';
SELECT id, deleted_at FROM public.policies WHERE id = '49492040-72e7-4a81-9410-05a05c258420';
```

### Indexes

PostgreSQL offers several tools for searching and pattern matching text.
The challenge is choosing which to use for a job. There’s:

- LIKE and ILIKE [SQL pattern matching](http://www.postgresql.org/docs/current/static/functions-matching.html#FUNCTIONS-LIKE);
- ~ and ~\* operators for [mostly-perl-compatible regular expressions;](http://www.postgresql.org/docs/current/static/functions-matching.html#FUNCTIONS-POSIX-REGEXP)
- [full text search](http://www.postgresql.org/docs/current/static/textsearch.html) with @@, to_tsvector and to_tsquery

> TODO
>
> Analyze cost of your common queries

```sql
EXPLAIN (ANALYZE ON, COSTS OFF, TIMING OFF) SELECT display_name FROM policies WHERE display_name LIKE 'freck%';
EXPLAIN (ANALYZE ON, COSTS OFF, TIMING OFF) SELECT display_name FROM policies WHERE display_name ~ '^freck.*';
EXPLAIN (ANALYZE ON, COSTS OFF, TIMING OFF) SELECT display_name FROM policies WHERE display_name ILIKE 'freck%';
```

> PostgreSQL will use an index only if it thinks it will be cheaper that way.
> An index on a `boolean` column, which can only take two possible values, will almost never be used, because it is cheaper to sequentially read the whole table than to use random I/O on the index and the table if a high percantage of the table has to be retrieved.

### Use foreign keys

If you have a column that references another column in the database, add a foreign key constraint.

There are reasons to not use foreign keys at scale, but we are not at scale and we can drop these in the future if they become a problem.

### Don't cascade deletes

Foreign key constraints should not cascade deletes for a few reasons:

1. We don't want to accidentally delete a lot of data (either from our application, or from a manual query in prod).
2. If we ever add new tables that depend on other tables via foreign key, it is not necessarily the case that cascading the delete is correct for the new table. Explicit application code is better here.
3. If we ever get to the point of sharding the db, we will probably need to drop all foreign key constraints so it would be great if we did not make our code depend on cascading delete behavior.

Instead of cascading deletes, applications should explicitly delete the rows that would otherwise get deleted if cascading deletes were enabled.

### Table names

Tables are plural (e.g. repositories, users, comments, etc.).

Join tables should be named based on the two tables being joined (e.g. foo_bar joins foo and bar).

### Validation

To the extent that certain fields require validation (e.g. username) we should perform that validation in client AND EITHER the database when possible, OR the graphql api.

This results in the best experience for the client, and protects us from corrupt data.

### Triggers

Because a trigger resides in the database and anyone who has the required privilege can use it, a trigger lets you write a set of SQL statements that multiple applications can use. It lets you avoid redundant code when multiple programs need to perform the same database operation.

Triggers are usually a good tool for:

- Computing derived column values automatically.
- Enforcing complex integrity constraints (e.g. when a faster CHECK constraint isn't powerful enough).
- Maintaining derived tables (e.g creating an audit trail of activity in the database).

Triggers are often not a good tool for:

- Implementing complex application logic.

Whatever you end up doing, ensure that the affected code paths are tested appropriately. For instance, if you created a trigger that populates a column, you should test that a record that is written can be read back with the affected column set to what you expect.

## Reference

- [Database Style guide](https://docs.sourcegraph.com/dev/background-information/postgresql)
- [Setting up Soft Deletes for Data](https://hasura.io/docs/latest/schema/common-patterns/data-modeling/soft-deletes/)
- [Soft deletion with PostgreSQL: but with logic on the database!](https://evilmartians.com/chronicles/soft-deletion-with-postgresql-but-with-logic-on-the-database)
- [Soft Deleting and Unique Constraint](https://halimsamy.com/sql-soft-deleting-and-unique-constraint)
- [Soft Deleting and Unique Constraint with Partially Index](https://blog.staynoob.cn/post/2019/05/when-soft-delete-meets-unique-index/)
