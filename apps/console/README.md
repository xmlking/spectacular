# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Developing

### First Step

1. download latest `traefik.me` certs for _svelte_ dev server.

    > NOTE: they will expire every 60 days

    ```shell
    curl traefik.me/fullchain.pem -o apps/console/config/certs/traefik.me.crt
    curl traefik.me/privkey.pem -o apps/console/config/certs/traefik.me.key
    ```

### Backend

Start backend services with [nhost cli](../../docs/nhost.md)

```sh
# start nhost services
nhost up
# or start with applying seed data
nhost up --apply-seeds
# or start nhost services bind with your device public IP. 
nhost --local-subdomain 192-168-1-108 up # or
NHOST_LOCAL_SUBDOMAIN=192-168-1-108 nhost up 
# start nhost services and one or more `Run` containers
nhost up --run-service ./nhost/console-webapp.toml:local
# shutdown nhost services
nhost down
# danger: delete docker volumes. Use it to reset postgres/hasura
nhost down --volumes
```

The following URLs will be available

| Service   | URL                                                 |
| --------- | --------------------------------------------------- |
| Postgres  | <postgres://postgres:postgres@localhost:5432/local> |
| Hasura    | <https://local.hasura.local.nhost.run/console/>     |
| GraphQL   | <https://local.hasura.local.nhost.run/v1/version>   |
| Auth      | <https://local.auth.local.nhost.run/v1/version>     |
| Storage   | <https://local.storage.local.nhost.run/v1/version>  |
| Mailhog   | <https://local.mailhog.local.nhost.run>             |
| Dashboard | <https://local.dashboard.local.nhost.run>           |
| Functions | <<https://local.functions.local.nhost.run>          |
| WebApp    | <<https://local.webapp.local.nhost.run>             |

### Frontend

```bash
turbo --filter=console dev
# or run with `production` profile and
# overload envelopment variables from `.env.production` and `.secrets.production`
turbo --filter=console dev:production
```

Default demo user's **username:** `sumo@demo.com` **password:** `sumodemo123`

## Generate

Generate `i18n` types, `schema.graphql` etc...

```shell
turbo --filter=console run generate 
# or for production, run:
turbo --filter=console run generate:production
```

## Building

To create a production version of your app:

```bash
cd apps/console
turbo build
```

You can preview the production build with `turbo preview`.

## Deploy

[adapter-auto](https://kit.svelte.dev/docs/adapter-auto) now support **Zero-config deployments** to `Vercel`, `Azure Static Web Apps`, `Google Cloud Run` etc

```shell
gcloud run deploy --allow-unauthenticated
```

To reset deleted (soft) `policies` and `rules`

```sql
UPDATE public.rules SET deleted_at = null WHERE deleted_at is not null;
UPDATE public.policies SET deleted_at = null WHERE deleted_at is not null;
```

## TODO

- After user record created for first-time (i.e., after user login), have admins assign `organization` and `groups` via Web UI:
- use [lcl.host](https://anchor.dev/docs/lcl-host/why-lcl)
