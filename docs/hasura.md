# Hasura

GraphQL APIs with Hasura

![Hasura GraphQL Engine architecture](https://raw.githubusercontent.com/hasura/graphql-engine/master/assets/hasura-arch.svg)

## TODO

- [ ] Add **Authentication** and **Object Storage** for Hasura using [Hasura Backend Plus](https://nhost.github.io/hasura-backend-plus/) container

## hasura-cli

### Install

```shell
brew install hasura-cli
# (OR)
pnpm add -g hasura-cli
# (OR)
go install github.com/hasura/graphql-engine/cli/cmd/hasura@latest
```

### Usage

NOTE: You can pass `--endpoint <hasura-endpoint> --admin-secret <HASURA_GRAPHQL_ADMIN_SECRET> command-line args for all _Hasura CLI_ commands

```shell
# Create a directory to store migrations (with endpoint and admin secret configured):
# use `''` to escape if `admin-secret` has special characters
hasura init hasura --project nhost --endpoint https://swzucovdccjouwebopwb.hasura.us-west-2.nhost.run --admin-secret <HASURA_GRAPHQL_ADMIN_SECRET>

# from localhost
hasura init hasura --project nhost --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
# move nhost/config.yaml to project root and edit metadata_directory, migrations_directory, seeds_directory paths in it

hasura version

## open console
hasura console

# Create a new seed by exporting data from tables already present in the database:
# use `--insecure-skip-tls-verify` if needed
hasura seed create users --database-name default --from-table auth.users --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed create user_roles --database-name default --from-table auth.user_roles --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed create organizations --database-name default --from-table public.organizations --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed create memberships --database-name default --from-table public.memberships --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed create groups --database-name default --from-table public.groups --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed create user_groups --database-name default --from-table public.user_groups --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed create rules --database-name default --from-table rules --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed create policies --database-name default --from-table policies --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed create devices --database-name default --from-table devices --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed create pools --database-name default --from-table pools --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed create org_settings --database-name default --from-table org_settings --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed create user_settings --database-name default --from-table user_settings --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed create notifications --database-name default --from-table notifications --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed create user_notifications --database-name default --from-table user_notifications --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret

# Export data from multiple tables:
# hasura seed create policies_organization --database-name default --from-table policies --from-table organization
# Apply all seed file:
hasura seed apply --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
# (Or) Apply only a particular files:
hasura seed apply --file 001_users.sql --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed apply --file 002_user_roles.sql --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed apply --file 003_organizations.sql --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed apply --file 004_memberships.sql --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed apply --file 005_groups.sql --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed apply --file 006_user_groups.sql --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed apply --file 007_org_settings.sql --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed apply --file 008_user_settings.sql --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed apply --file 009_notifications.sql --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed apply --file 010_user_notifications.sql --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret

hasura seed apply --file 011_rules.sql --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed apply --file 012_policies.sql --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed apply --file 013_devices.sql --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed apply --file 014_pools.sql --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret

# To apply all the Migrations present in the `migrations/` directory and the Metadata present in the `metadata/` directory on a new, "fresh",
# instance of the Hasura Server at http://another-server-instance.hasura.app:
hasura deploy --endpoint https://swzucovdccjouwebopwb.hasura.us-west-2.nhost.run --admin-secret <HASURA_GRAPHQL_ADMIN_SECRET>
# To apply only apply metadata
hasura metadata apply --endpoint https://swzucovdccjouwebopwb.hasura.us-west-2.nhost.run --admin-secret <HASURA_GRAPHQL_ADMIN_SECRET>
# NOTE:
# if you get error: "permission denied to create extension \"hstore\"", Run `create extension hstore;` in hasura console
# if you get error: "must be owner of extension hstore", Run `alter role nhost_hasura with superuser;` in hasura console
# if you get error: "x509: certificate signed by unknown authority", add `--insecure-skip-tls-verify` flag to above command

# Check the status of Migrations
hasura migrate status --database-name default
# Apply the Metadata and Migrations:
hasura migrate apply --database-name default
# then apply seeds
# after applying seeds, then apply metadata
hasura metadata apply
hasura metadata reload
# Take pg_dump of schema and hasura metadata from server while specifying the schemas to include
hasura migrate create init --from-server --database-name default --schema public --project nhost --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura migrate create init --from-server --database-name default --schema auth --project nhost --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura migrate create init --from-server --database-name default --schema storage --project nhost --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
## rollback/rollup last migrate
# Apply last 1 down migrations:
hasura migrate apply --down 1 --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
# Apply last 1 up migrations:
hasura migrate apply --up 1 --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
# Apply only a particular `down` version
# this will reset tables in `public` schema and apply type data into `type` tables
hasura migrate apply --version 1686378049757 --type down --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura migrate apply --version 1686378049757 --type up --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
# Rollback all migrations:
hasura migrate apply --down all --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
# Check status of migrations
hasura migrate status --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
# Example to delete all migration versions
hasura migrate delete --all --database-name default --server --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
# Example to delete specific migration version
hasura migrate delete --version 1725260357999 --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret --server
# Marking Migrations as applied
hasura migrate apply --skip-execution --version 1684206403640 --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura migrate apply --skip-execution --version 1686378049757 --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura migrate apply --skip-execution --version 1725835313697 --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
# Apply all migrations
hasura migrate apply --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
# Export Hasura GraphQL Engine metadata from the database
hasura metadata export --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
# Show changes between server metadata and the exported metadata file:
hasura metadata diff --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
# Reload Hasura GraphQL Engine metadata on the database.
hasura metadata reload --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
# Show inconsistency
hasura metadata ic list --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
# Apply Hasura Metadata
hasura metadata apply --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
```

## Local Hasura

### Start local Hasura

```shell
docker compose up hasura
# shutdown
docker compose down
# shutdown , reset volume
docker compose down -v
```

### Apply Migrations and Metadata on another instance of the Hasura Server

To apply all the **Metadata** and **Migrations** present in the `nhost` directory to a new, "fresh" database (i.e., after `docker compose down -v`):

> In this case, I am applying metadata, migrations and seed data to local fresh hasura/postgres database started with `docker compose up hasura`

```shell
# only apply metadata
hasura metadata apply --endpoint https://local.hasura.local.nhost.run --admin-secret <HASURA_GRAPHQL_ADMIN_SECRET>
# apply metadata, DB migrations and seed data
hasura deploy --endpoint https://local.hasura.local.nhost.run --admin-secret <HASURA_GRAPHQL_ADMIN_SECRET>
# Apply all seed file:
hasura seed apply --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
# (Or) Apply only a particular files:
hasura seed apply --file 001_users.sql --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed apply --file 002_user_roles.sql --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed apply --file 003_organizations.sql --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed apply --file 004_memberships.sql --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed apply --file 005_groups.sql --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed apply --file 006_user_groups.sql --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed apply --file 007_settings.sql --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret

hasura seed apply --file 011_rules.sql --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed apply --file 012_policies.sql --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed apply --file 013_devices.sql --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura seed apply --file 014_pools.sql --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
```

Check the status

```shell
cd nhost
hasura metadata diff --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
hasura migrate status --database-name default --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
```

### Export Metadata

To export **Metadata** and **Migrations** from your local Hasura to `nhost/hasura` directory, for sharing with the team:

```shell
hasura metadata export --endpoint https://local.hasura.local.nhost.run --admin-secret hasura-admin-secret
```

### Reset Hasura Migrations and Metadata

> useful when you reset your cloud **Postgres** and **Hasura** metadata

#### Step 0: Reset metadata

```shell
hasura metadata clear --endpoint https://swzucovdccjouwebopwb.hasura.us-west-2.nhost.run --admin-secret <HASURA_GRAPHQL_ADMIN_SECRET>
```

#### Step 1: Reset the migration history on the server

```shell
# reset migrations on server only
hasura migrate delete --all --server --database-name default --endpoint https://swzucovdccjouwebopwb.hasura.us-west-2.nhost.run --admin-secret <HASURA_GRAPHQL_ADMIN_SECRET>
# Verify the status of the Migrations
hasura migrate status --database-name default --endpoint https://swzucovdccjouwebopwb.hasura.us-west-2.nhost.run --admin-secret <HASURA_GRAPHQL_ADMIN_SECRET>
```

#### Step 2: recreate public schema

> via hasura console SQL interface or via postgres CLI

```sql
-- SET ROLE postgres;
-- DROP SCHEMA storage CASCADE;
-- DROP SCHEMA auth CASCADE;
-- DROP SCHEMA graphite CASCADE;
-- apply storage and auth schemas manually
SET ROLE postgres;
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

Only If needed

```sql
SET ROLE postgres;
GRANT ALL ON SCHEMA auth TO nhost_auth_admin;
GRANT ALL PRIVILEGES ON SCHEMA auth TO nhost_auth_admin;
GRANT USAGE ON SCHEMA auth TO nhost_hasura;
ALTER DEFAULT PRIVILEGES FOR ROLE nhost_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO nhost_hasura;
```

#### Step 3

Start `hasura-auth` and `hasura-storage` services so that associated database tables are created in `auth` and `storage` DB scheam.

#### Step 4: reinitialize metadata and migrations for public schema

```shell
# apply metadata, DB migrations
hasura deploy --with-seeds --endpoint https://swzucovdccjouwebopwb.hasura.us-west-2.nhost.run --admin-secret <HASURA_GRAPHQL_ADMIN_SECRET>
# (optionally) Apply all seed file:
hasura seed apply --database-name default --endpoint https://swzucovdccjouwebopwb.hasura.us-west-2.nhost.run --admin-secret <HASURA_GRAPHQL_ADMIN_SECRET>
# (Or) Apply only a particular files:
hasura seed apply --file 001_organizations.sql --database-name default --endpoint https://swzucovdccjouwebopwb.hasura.us-west-2.nhost.run --admin-secret <HASURA_GRAPHQL_ADMIN_SECRET>
hasura seed apply --file 002_users.sql --database-name default --endpoint https://swzucovdccjouwebopwb.hasura.us-west-2.nhost.run --admin-secret <HASURA_GRAPHQL_ADMIN_SECRET>
hasura seed apply --file 011_devices.sql --database-name default --endpoint https://swzucovdccjouwebopwb.hasura.us-west-2.nhost.run --admin-secret <HASURA_GRAPHQL_ADMIN_SECRET>
hasura seed apply --file 012_rules.sql --database-name default --endpoint https://swzucovdccjouwebopwb.hasura.us-west-2.nhost.run --admin-secret <HASURA_GRAPHQL_ADMIN_SECRET>
hasura seed apply --file 013_pools.sql --database-name default --endpoint https://swzucovdccjouwebopwb.hasura.us-west-2.nhost.run --admin-secret <HASURA_GRAPHQL_ADMIN_SECRET>
hasura seed apply --file 014_policies.sql --database-name default --endpoint https://swzucovdccjouwebopwb.hasura.us-west-2.nhost.run --admin-secret <HASURA_GRAPHQL_ADMIN_SECRET>
```

## Configuration

## Gotchas

### Allow List

![Allow List](./images/allow-list.png)

- **In development instances:** During development or in dev instances, disable the Allow List (default setting) to enable complete access to the GraphQL schema.
 Add/remove operations in the [Allow List](https://hasura.io/docs/latest/security/allow-list/) and then export the Metadata for version-control (so you can apply it to other instances).
- **In CI/CD instances:** Enable the Allow List for testing.
- **In production instances:** Enabling the Allow List is highly recommended when running the GraphQL Engine in production. i.e., `HASURA_GRAPHQL_ENABLE_ALLOWLIST: 'true'`

Use plugin [@graphql-codegen/hasura-allow-list](https://npmjs.com/package/@graphql-codegen/hasura-allow-list) that automates the creation of the "AllowList" based on the GraphQL Queries found in your front-end code.

> [Role-based Allow List](https://hasura.io/docs/latest/security/allow-list/#role-based-allow-list) only available on **Hasura Cloud** or **Hasura Enterprise Edition**

## Reference

- Sample metadata <https://github.com/hasura/template-gallery/tree/main/postgres>-
- Hasura and AuthJS [intigration](https://hasura.io/learn/graphql/hasura-authentication/integrations/nextjs-auth/)
- [Hasura Backend Plus](https://nhost.github.io/hasura-backend-plus/)
- [GraphQL Security in Production with Automated Allow Lists](https://hasura.io/blog/graphql-security-in-production-with-hasura-automated-allow-lists/)
- Hasura [Production Checklist](https://hasura.io/docs/latest/deployment/production-checklist/)
- Hasura [Roles & Session Variables](https://hasura.io/docs/latest/auth/authorization/roles-variables/)
- Hasura [Manage Migrations](https://hasura.io/docs/latest/migrations-metadata-seeds/manage-migrations/)
- [Reset Hasura Migrations and Metadata](https://hasura.io/docs/latest/migrations-metadata-seeds/resetting-migrations-metadata/)
- [Auto-Apply Migrations and Metadata](https://hasura.io/docs/latest/migrations-metadata-seeds/auto-apply-migrations/)
