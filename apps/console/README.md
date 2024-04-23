# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Developing

### First Step

download latest `traefik.me` certs for _svelte_ dev server.

> NOTE: they will expire every 60 days

```shell
curl traefik.me/fullchain.pem -o infra/base/traefik/certs/traefik.me.crt
curl traefik.me/privkey.pem -o infra/base/traefik/certs/traefik.me.key
# make sure docker has read access to those files:
chmod ugo+r infra/base/traefik/.htpasswd
```

### Backend

#### Start backend services with Docker Compose

Start `default` profile services: `postgres`, `hasura`, `auth`, `console` and `traefik` for local development.

```sh
# get the certificates and start all default services in background
export COMPOSE_ENV_FILES=.env,.secrets,apps/console/.env,apps/console/.secrets
docker compose up update-certs-helper \
docker compose up -d \
docker compose logs -f
```

**Or**, utilize the **Makefile**.

```sh
# stat all services in background and show logs
make up # for first time use `make boot` then `make up`
# this will start all services with default profile + services with `optional` profile.
make up PROFILES=optional
# verify status/health of services
make ps
# shotdown all services
make down
# DANGER: run this if you want to reset database and other persistent volumes
make teardown
# verify if docker `compose` getting correctly resolved application config from .env and .secrests files
make check
```

If you want to run above tasks for **single** service only:

```shell
# this will start only hasura service
make up-hasura
# this will start only postgres service
make up-postgres
# this will show only hasura service
make logs-hasura
# this will stop only console service
make down-console
```

To also start optional services like `all` and/or `optional`, use `COMPOSE_PROFILES` or `make` task.

```shell
# to start default profile services and benthos,postgres services
COMPOSE_ENV_FILES=.env,.secrets COMPOSE_PROFILES=all,optional docker compose up
# (or)
make up PROFILES=all,optional
make up PROFILES=optional
```

To verify resolved `compose` config, use `COMPOSE_PROFILES` or `make` task.

```shell
COMPOSE_ENV_FILES=.env,.secrets COMPOSE_PROFILES=all,optional docker compose config
# (or)
make check PROFILES=all,optional
make check PROFILES=optional
```

#### Debug

```shell
# ssh to container (if needed to debug)
export COMPOSE_ENV_FILES=.env,.secrets,apps/console/.env,apps/console/.secrets
docker compose exec -it hasura /bin/bash
# debug: check for files in image
crane export ghcr.io/xmlking/spectacular/console:v0.1.3 - | tar -tvf - | grep -v zoneinfo
```

> login into **minio** with username: `STORAGE_ACCESS_KEY` password: `STORAGE_SECRET_KEY`

| Service   | URL                                               |
| --------- | ------------------------------------------------- |
| Postgres  | postgres://postgres:postgres@localhost:5432/local |
| Traefik   | https://traefik.traefik.me/dashboard/             |
| Hasura    | https://hasura.traefik.me                         |
| GraphQL   | https://graphql.traefik.me                        |
| Auth      | https://auth.traefik.me/healthz                   |
| Storage   | https://storage.traefik.me/healthz                |
| Minio     | https://minio.traefik.me                          |
| Mailpit   | https://mailhog.traefik.me                        |
| Dashboard | https://dashboard.traefik.me                      |
| Tailcall  | https://gateway.traefik.me                        |

#### (Or) Start backend services with nhost cli

```shell
# start all
nhost up
# check logs for example: auth service
nhost logs auth -f
# shutdown all
nhost down
# (optional) shutdown and reset volume
nhost down --volumes
#  (optional) nhost first time when started, will load seeds but you can force with `--apply-seeds`
nhost up --apply-seeds
```

| Service   | URL                                               |
| --------- | ------------------------------------------------- |
| Postgres  | postgres://postgres:postgres@localhost:5432/local |
| Hasura    | https://local.hasura.nhost.run                    |
| GraphQL   | https://local.graphql.nhost.run                   |
| Auth      | https://local.auth.nhost.run                      |
| Storage   | https://local.storage.nhost.run                   |
| Functions | https://local.functions.nhost.run/v1/echo         |
| Dashboard | https://local.dashboard.nhost.run                 |
| Mailhog   | https://local.mailhog.nhost.run                   |

#### Apply seeds

Optionally apply all seed files

> NOTE: make sure `HASURA_GRAPHQL_ENDPOINT`, `HASURA_GRAPHQL_ADMIN_SECRET` in root `.env` pointing to **local** hasura service.

```shell
# add `--insecure-skip-tls-verify` option if needed
hasura seed apply --database-name default
```

### Frontend

```bash
cd apps/console
turbo dev
# or run with `prod` profile and
# overload envelopment variables from `.env.prod`
NODE_ENV=prod turbo dev
```

Default demo user's **username:** `sumo@demo.com` **password:** `sumodemo123`

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

## TODO

- After user record created for first-time (i.e., after user login), have admins assign `organization` and `groups` via Web UI:
