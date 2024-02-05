# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Developing

### First Step

Unpack `localhost.direct.zip`.

> HINT: password: `localhost`

```shell
unzip -P localhost infra/base/traefik/certs/localhost.direct.zip -d infra/base/traefik/certs/
```

### Backend

Start backend services:

```shell
# verify compose file
docker compose config # implicitly set `env-file` to `.env`
docker compose --env-file .env --env-file .secrets config  # explicitly set `env-file` to `.env` and `.secrets`
# start all services
docker compose --env-file .env --env-file .secrets up hasura

# open traefik dashboard 
open https://traefik.localhost.direct/dashboard/#/
open https://hasura.localhost.direct/console
open https://mailhog.localhost.direct/
open https://auth.localhost.direct/
# login into minio with username: STORAGE_ACCESS_KEY password: STORAGE_SECRET_KEY
open https://minio.localhost.direct/
open https://dashboard.localhost.direct/
open https://storage.localhost.direct/healthz
```
minio
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

Stop backend services:

```shell
docker compose down
# if you want to remove volumes and clear all data
docker compose down -v
```

```shell
# start all
nhost up
# shutdown all
nhsot down
nhost logs auth -f
```

| Service   | URL                                               |
| --------- | ------------------------------------------------- |
| Postgres  | postgres://postgres:postgres@localhost:5432/local |
| Hasura    | https://local.hasura.nhost.run                    |
| GraphQL   | https://local.graphql.nhost.run                   |
| Auth      | https://local.auth.nhost.run                      |
| Storage   | https://local.storage.nhost.run                   |
| Functions | https://local.functions.nhost.run                 |
| Dashboard | https://local.dashboard.nhost.run                 |
| Mailhog   | https://local.mailhog.nhost.run                   |

### Frontend

```bash
cd apps/console
turbo dev
# or run with `prod` profile and
# overload envelopment variables from `.env.prod`
NODE_ENV=prod turbo dev
```

## Building

To create a production version of your app:

```bash
cd apps/console
turbo build
```

You can preview the production build with `turbo preview`.
