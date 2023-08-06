# Database

PostgresSQL Database

## Environments

### Development

### Test

### Stage

### Prod

## Install

Install psql CLI for Mac

```shell
brew install libpq
# Finally, symlink psql (and other libpq tools) into /usr/local/bin:
brew link --force libpq
```

## Setup

For your self-hosted _production_ environment, you need to secure database.  
For local dev _postgres_ database running in docker compose, these steps are not needed.

SSH to **db host**

```shell
# if your database is running in docker
docker compose exec postgres /bin/bash
```

Connect to database with `psql` cli:

```shell
psql -U postgres -d postgres
# switch to postgresdb
postgresdb=# \c postgres
# list databases
postgresdb=# \l
# list relations
postgresdb-# \dt
# list users
postgresdb-# \du
# to change the postgres user's password:
postgresdb-# \password postgres
# quit
postgresdb-# \q
```

Create a PostgreSQL **user** and **schemas** for **Hasura**

```shell
psql -d postgres -U postgres
# switch to a database postgresdb:
postgresdb=# \c postgres
SELECT current_user;
```

Then run each of the following SQL statments

```sql
-- We will create a separate user and grant permissions on hasura-specific
-- schemas and information_schema and pg_catalog
-- These permissions/grants are required for Hasura to work properly.

-- create a separate user for hasura (if you don't already have one)
CREATE USER hasurauser WITH PASSWORD 'change_me';

-- create the schemas required by the hasura cloud system
CREATE SCHEMA IF NOT EXISTS hdb_catalog;
CREATE SCHEMA IF NOT EXISTS hdb_views;
CREATE SCHEMA IF NOT EXISTS hdb_pro_catalog;

-- make the user an owner of the hasura cloud system schemas
ALTER SCHEMA hdb_catalog OWNER TO hasurauser;
ALTER SCHEMA hdb_views OWNER TO hasurauser;
ALTER SCHEMA hdb_pro_catalog OWNER TO hasurauser;

-- grant select permissions on information_schema and pg_catalog
GRANT SELECT ON ALL TABLES IN SCHEMA information_schema TO hasurauser;
GRANT SELECT ON ALL TABLES IN SCHEMA pg_catalog TO hasurauser;

-- grant all privileges on all tables in the public schema (this is optional and can be customized)
GRANT USAGE ON SCHEMA public TO hasurauser;
GRANT ALL ON ALL TABLES IN SCHEMA public TO hasurauser;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO hasurauser;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO hasurauser;
GRANT CREATE ON SCHEMA public TO hasurauser;

GRANT SET ON PARAMETER rules.soft_deletion to hasurauser;
ALTER DATABASE postgres SET rules.soft_deletion TO on;

-- Similarly add these for other schemas as well, if you have any
-- GRANT USAGE ON SCHEMA <schema-name> TO hasurauser;
-- GRANT ALL ON ALL TABLES IN SCHEMA <schema-name> TO hasurauser;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA <schema-name> TO hasurauser;
-- GRANT ALL ON ALL FUNCTIONS IN SCHEMA <schema-name> TO hasurauser;
```

Create application specific schema objects

```sql
-- create application required extensions
CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;
COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';
CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA public;
COMMENT ON EXTENSION hstore IS 'data type for storing sets of (key, value) pairs';
CREATE EXTENSION IF NOT EXISTS ltree WITH SCHEMA public;
COMMENT ON EXTENSION ltree IS 'data type for storing hierarchical data path';
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';

SELECT * FROM pg_extension;
SELECT extname, extowner::regrole FROM pg_catalog.pg_extension;
```

you can connect to the database using the database connection string from remote computer:

```shell
psql postgresql://hasurauser:hasura_password@db_host:5432/postgres
```

## Usage

```sql
-- list schema in current database
select schema_name from information_schema.schemata;
```

You will have access to

```shell
/bin/vi /etc/pgbackrest.conf
cat  /var/lib/pgsql/14/data/pg_hba.conf

/bin/systemctl start postgresql*
/bin/systemctl stop postgresql*
/bin/systemctl restart postgresql*
/bin/systemctl reload postgresql*
/bin/systemctl status postgresql*
/bin/systemctl daemon-reload
```

## Reference
