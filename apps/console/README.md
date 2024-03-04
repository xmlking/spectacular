# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Developing

### First Step

download latest `traefik.me` certs. NOTE: they will expire every 60 days

```shell
curl traefik.me/fullchain.pem -o infra/base/traefik/certs/traefik.me.crt
curl traefik.me/privkey.pem -o infra/base/traefik/certs/traefik.me.key
```

### Backend

#### Start backend services with Docker Compose

Start `default` profile services: `postgres`, `hasura`, `auth` and `console`  for local development.

```sh
# get the certificates and start all default services
docker compose up update-certs-helper \
COMPOSE_ENV_FILES=.env,.secrets,apps/console/.env,apps/console/.secrets docker compose up -d \
COMPOSE_ENV_FILES=.env,.secrets,apps/console/.env,apps/console/.secrets docker compose logs -f

# Or, utilize the Makefile.
# stat all services in background and show logs
make up # for first time use `make boot` then `make up`
# verify status/health of services
make ps
# shotdown all services
make down
# DANGER: run this if you want to reset database and other persistent volumes
make teardown
# verify if docker `compose` getting correctly resolved application config from .env and .secrests files
make check
```

```shell
# ssh to container (if needed to debug)
COMPOSE_ENV_FILES=.env,.secrets,apps/console/.env,apps/console/.secrets docker compose exec -it hasura /bin/bash
# debug: check for files in image
crane export ghcr.io/xmlking/spectacular/console:v0.1.3 - | tar -tvf - | grep -v zoneinfo
```

> login into **minio** with username: `STORAGE_ACCESS_KEY` password: `STORAGE_SECRET_KEY`

| Service   | URL                                               |
| --------- | ------------------------------------------------- |
| Postgres  | postgres://postgres:postgres@localhost:5432/local |
| Traefik   | https://traefik.traefik.me/dashboard/#/           |
| Hasura    | https://hasura.traefik.me                         |
| Auth      | https://auth.traefik.me/healthz                   |
| Storage   | https://storage.traefik.me/healthz                |
| minio     | https://minio.traefik.me                          |
| Functions | https://functions.traefik.me                      |
| Dashboard | https://dashboard.traefik.me                      |
| Mailpit   | https://mailpit.traefik.me                        |

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
| Functions | https://local.functions.nhost.run                 |
| Dashboard | https://local.dashboard.nhost.run                 |
| Mailhog   | https://local.mailhog.nhost.run                   |

#### Apply user schema
> this step only needed first time when database got initialized  
got to `https://hasura.traefik.me/console/data/sql` and apply

```sql
ALTER TABLE ONLY public.user_org_groups
    ADD CONSTRAINT user_org_groups_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
```

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
