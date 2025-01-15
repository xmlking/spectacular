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

> [!NOTE]
> To set custom CA certs for all _nhost_ containers, set: `export NHOST_CA_CERTIFICATES=./nhost/ca-certificates.crt`

```sh
# start nhost services
nhost up
# or start with applying seed data
nhost up --apply-seeds
# or with company's custom CA certs
nhost up --apply-seeds --ca-certificates ./nhost/ca-certificates.crt
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

#### Advanced setup

to start services with your public **IP** on laptop:

1. Update `NHOST_LOCAL_SUBDOMAIN` to match your **IP**
2. Update `run-console-ip.toml` file to match your **IP**
3. Then run following steps

```shell
nhost down --volumes
NHOST_LOCAL_SUBDOMAIN=192-168-60-32 nhost up --apply-seeds
NHOST_LOCAL_SUBDOMAIN=192-168-60-32 nhost up --run-service run-console-ip.toml
```

### Frontend

```bash
turbo run console#dev
# or run with `production` profile and
# overload envelopment variables from `.env.production` and `.secrets.production`
turbo run console#dev:production
```

Default demo user's **username:** `sumo@demo.com` **password:** `sumodemo123`

## Generate

Generate `i18n` types, `schema.graphql` etc...

```shell
turbo run console#generate
# or for production, run:
turbo run console#generate:production
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
