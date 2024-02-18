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

#### Start backend services with Docker Compose

```shell
# verify compose file
docker compose config # implicitly set `env-file` to `.env`
docker compose --env-file .env --env-file .secrets config  # explicitly set `env-file` to `.env` and `.secrets`
# start all services
docker compose --env-file .env --env-file .secrets up

# open traefik dashboard
open https://traefik.localhost.direct/dashboard/#/
```

> login into **minio** with username: `STORAGE_ACCESS_KEY` password: `STORAGE_SECRET_KEY`

| Service   | URL                                               |
| --------- | ------------------------------------------------- |
| Postgres  | postgres://postgres:postgres@localhost:5432/local |
| Traefik   | https://traefik.localhost.direct/dashboard/#/     |
| Hasura    | https://hasura.localhost.direct                   |
| Auth      | https://auth.localhost.direct/healthz             |
| Storage   | https://storage.localhost.direct/healthz          |
| minio     | https://minio.localhost.direct                    |
| Functions | https://functions.localhost.direct                |
| Dashboard | https://dashboard.localhost.direct                |
| Mailpit   | https://mailpit.localhost.direct                  |

Stop backend services:

```shell
docker compose --env-file .env --env-file .secrets down
# if you want to remove volumes and clear all data
docker compose down -v
```

#### (Or) Start backend services with nhost cli

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
