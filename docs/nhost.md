# Nhost

Nhost is an open source Firebase alternative with GraphQL, built with the following open source software:

- Database: [PostgreSQL](https://www.postgresql.org/)
- Instant GraphQL API: [Hasura](https://hasura.io/)
- Authentication: [Hasura Auth](https://github.com/nhost/hasura-auth/)
- Storage: [Hasura Storage](https://github.com/nhost/hasura-storage)
- Serverless Functions: Node.js (JavaScript and TypeScript)
- Nhost Run: run any containerized workloads

![Nhost architecture](https://raw.githubusercontent.com/nhost/nhost/main/assets/nhost-diagram.png)

## Nhost CLI

[nhost](https://docs.nhost.io/cli) cli is used to `setup/config/run` local nhost **BFF**

### Prerequisites

- [x] Docker

### Installation

> [!NOTE]
> You can check latest available `nhost cli` version at: [nhost releases](https://github.com/nhost/cli/)  
> If you follow nhost installation docs, default installation location is `/usr/local/bin`  

```shell
# Install the CLI in `/usr/local/bin` diretory:
curl -L https://raw.githubusercontent.com/nhost/cli/main/get.sh | bash
# update
nhost sw upgrade
# (or) if you install user's directory i.e., ~/bin/nhost
nhost sw upgrade
```

### Configuration

#### Environment Variables

- **NHOST_SUBDOMAIN** : `subdomain` in nhost cloud
- **NHOST_REGION** : `region` in nhost cloud. e.g, `us-west-2`
- **NHOST_LOCAL_SUBDOMAIN** : `subdomain` in local-dev or self-host environment
- **NHOST_PROJECT_NAME** : project name within nhost workspace

> `--subdomain` defaults to `$NHOST_SUBDOMAIN` envelopment variable, if not spplied on command line.  
> `--local-subdomain` defaults to `$NHOST_LOCAL_SUBDOMAIN` envelopment variable, if not spplied on command line.

```shell
# nhost login
# you can also login with your regular email/password credentials 
nhost login
# if you prefered, you can also login with PAT token generated from [nhost](https://app.nhost.io/).
nhost login --pat $PAT
# Configuring docker to use Nhost’s registry
nhost docker-credentials configure
# Shows an example config file
nhost config example
# validate configuration
nhost config validate
# Shows configuration after resolving secrets
nhost config show
nhost config show --subdomain local
# This command is mostly useful to verify configuration overlays.
nhost config show --subdomain swzucovdccjouwebopwb
# (DANGER) 
# Pull current versions of ./nhost/nhost.toml and ./secrets used in the cloud environment.
nhost config pull

```

#### Secrets Management

```shell
nhost secrets list --subdomain swzucovdccjouwebopwb
# (DANGER)
# nhost secrets create --subdomain swzucovdccjouwebopwb NHOST_WEBHOOK_SECRET "'ZAdx)h=Sy-YbsUfo:9ntz;3#;2p%A+L"
# nhost secrets update --subdomain swzucovdccjouwebopwb NHOST_WEBHOOK_SECRET "'ZAdx)h=Sy-YbsUfo:9ntz;3#;2p%A+L"
# nhost secrets delete --subdomain swzucovdccjouwebopwb NHOST_WEBHOOK_SECRET
```

### Start

Starting and Stoping local nhost stack

> [!NOTE]
> To set custom CA certs for all _nhost_ containers, set: `export NHOST_CA_CERTIFICATES=./nhost/ca-certificates.crt`

```shell
# start nhost services
nhost up
# or start with applying seed data
nhost up --apply-seeds
# or with company's custom CA certs
nhost up --apply-seeds --ca-certificates ./nhost/ca-certificates.crt
# or start nhost services bind with your device public IP. 
nhost --local-subdomain 192-168-1-108 up # or
NHOST_LOCAL_SUBDOMAIN=192-168-1-108 nhost up 
# start nhost services and one or more `Run` containers
nhost up --run-service run-console-local.toml
# shutdown nhost services
nhost down
# danger: delete docker volumes. Use it to reset postgres/hasura
nhost down --volumes
```

### nhost Run

nhost `Run` allow running custom containers along with standared nhost stack.
[Local development](https://docs.nhost.io/guides/run/local-development)

Tag and push images to nhost registry:

```shell
# set the SERVICE_ID
SERVICE_ID="2503b290-249c-42f5-b89e-fd9a98980e22"
docker tag ghcr.io/xmlking/spectacular/console:0.5.0 registry.us-west-2.nhost.run/$SERVICE_ID:0.5.0
docker push registry.us-west-2.nhost.run/$SERVICE_ID:0.5.0
```

```shell
# show config for given overlay
nhost run config-show --config run-console.toml --overlay-name console-local
# validate config for given overlay
nhost run config-validate --config run-console.toml --overlay-name console-local
# generate service specific .env for given overlay
nhost run env --config run-console.toml --overlay-name console-local > .env1
# run service locally with overlay config
# nhost up --run-service path/to/run-console.toml[:overlay_name]
nhost up --run-service run-console.toml:console-local
```

#### Deploy Run

Deploy to nhost cloud

```shell
# set the SERVICE_ID
SERVICE_ID="f27908df-3586-4d02-bb44-a762412d3912"
# registry.us-west-2.nhost.run/f27908df-3586-4d02-bb44-a762412d3912
nhost run config-deploy --config run-console.toml --service-id $SERVICE_ID
```

### Seeds

> [!NOTE]
> With the CLI, it is easy to extract data from an existing environment and generate a “seed” that can be shared and used to pre-populate any development environment as it initializes.

```shell
nhost dev hasura seed create some-initial-data \
    --endpoint https://local.hasura.local.nhost.run \
    --admin-secret nhost-admin-secret \
    --database-name default \
    --from-table animals
```

## Reference

1. [configuration-overlays](https://docs.nhost.io/guides/cli/configuration-overlays)
2. [nhost-cli commands](https://github.com/nhost/nhost.toml)
3. [nhost-cli docs](https://github.com/nhost/nhost.toml/tree/main/docs)
4. [nhost GitHub Actions](https://github.com/nhost-actions)
5. [CLI & CI Deployments](https://docs.nhost.io/guides/run/cli-deployments)
