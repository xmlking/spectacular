# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Developing

### First Step

download latest `traefik.me` certs for _svelte_ dev server.

> NOTE: they will expire every 60 days

```shell
curl traefik.me/fullchain.pem -o infra/base/traefik/certs/traefik.me.crt
curl traefik.me/privkey.pem -o infra/base/traefik/certs/traefik.me.key
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
| Mailpit   | https://mailpit.traefik.me                        |
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
| Functions | https://local.functions.nhost.run                 |
| Dashboard | https://local.dashboard.nhost.run                 |
| Mailhog   | https://local.mailhog.nhost.run                   |

#### Apply user schema

> this step only needed first time when database got initialized  
> got to `https://hasura.traefik.me/console/data/sql` and apply (un check: `This is a migration` )

```sql
ALTER TABLE ONLY public.user_org_groups
    ADD CONSTRAINT user_org_groups_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
```

TODO: After user record created for first-time (i.e., after user login), have admins assign `organization` and `groups` via Web UI:

```sql
INSERT INTO public.user_org_groups (id, user_id, groups, organization, created_at, created_by, updated_at, updated_by, deleted_at) VALUES ('271db270-6202-4c9a-82f8-7be326bf8be1', 'e9f249b0-5c86-446b-bb34-5cc24c1d398c', '{sig_admin,app_mgr}', 'chinthagunta', '2012-08-24 12:00:00+00', 'sumo@demo.com', '2024-03-13 06:47:14.718862+00','sumo@demo.com', NULL);
INSERT INTO public.user_org_groups (id, user_id, groups, organization, created_at, created_by, updated_at, updated_by, deleted_at) VALUES ('52b10e5f-77fb-4718-ac7e-a6960553dc50', 'e9f249b0-5c86-446b-bb34-5cc24c1d398c', '{aaa}', 'example', '2023-05-21 22:28:18.535229+00', 'sumo@demo.com', '2024-03-13 06:53:10.144137+00', 'sumo@demo.com', NULL);
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

## Deploy

[adapter-auto](https://kit.svelte.dev/docs/adapter-auto) now support **Zero-config deployments** to `Vercel`, `Azure Static Web Apps`, `Google Cloud Run` etc

```shell
gcloud run deploy --allow-unauthenticated
```
