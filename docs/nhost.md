# Nhost

Nhost is an open source Firebase alternative with GraphQL, built with the following open source software:

- Database: [PostgreSQL](https://www.postgresql.org/)
- Instant GraphQL API: [Hasura](https://hasura.io/)
- Authentication: [Hasura Auth](https://github.com/nhost/hasura-auth/)
- Storage: [Hasura Storage](https://github.com/nhost/hasura-storage)
- Serverless Functions: Node.js (JavaScript and TypeScript)

![Nhost architecture](https://raw.githubusercontent.com/nhost/nhost/main/assets/nhost-diagram.png)

## Nhost CLI

[nhost](https://docs.nhost.io/cli) cli is used to `setup/config/run`` local nhost **BFF**

### Prerequisites

- [x] Docker

### Installation

```shell
# Install the CLI with:
sudo curl -L https://raw.githubusercontent.com/nhost/cli/main/get.sh | bash
# update
sudo nhost sw upgrade
# (or) if you install user's directory i.e., ~/bin/nhost
nhost sw upgrade
```

### Usage

#### Config

> `--subdomain` defaults to `$NHOST_SUBDOMAIN` envelopment variable, if not spplied on command line

```shell
# nhost login
nhost login
# Shows an example config file
nhost config example
# validate configuration
nhost config validate
# Shows configuration after resolving secrets
nhost config show
nhost config show --subdomain local
# This command is mostly useful to verify configuration overlays.
nhost config show --subdomain zyjloswljirxqtsdlnnf
# (DANGER) 
# Pull current versions of ./nhost/nhost.toml and ./secrets used in the cloud environment.
nhost config pull
# Configuring docker to use Nhost’s registry
nhost docker-credentials configure
```

Secrets management in cloud

```shell
nhost secrets list --subdomain zyjloswljirxqtsdlnnf
# (DANGER)
# nhost secrets create --subdomain zyjloswljirxqtsdlnnf NHOST_WEBHOOK_SECRET "'ZAdx)h=Sy-YbsUfo:9ntz;3#;2p%A+L"
# nhost secrets update --subdomain zyjloswljirxqtsdlnnf NHOST_WEBHOOK_SECRET "'ZAdx)h=Sy-YbsUfo:9ntz;3#;2p%A+L"
# nhost secrets delete --subdomain zyjloswljirxqtsdlnnf NHOST_WEBHOOK_SECRET
```

#### Run

```shell
nhost up
nhost up --apply-seeds
# You can also use the Nhost Dashboard:
nhost up --ui nhost
nhost down
# danger: delete docker volumes. Use it to reset postgres/hasura
nhost down --volumes
```

#### nhost Run

nhost `Run` allow running custom containers along with standared nhost stack.
[Local development](https://docs.nhost.io/guides/run/local-development)

```shell
# show config for given overlay
nhost run config-show --config nhost/nginx-service.toml --overlay-name local
# validate config for given overlay
nhost run config-validate --config nhost/nginx-service.toml --overlay-name local
# generate service specific .env for given overlay
nhost run env --config nhost/nginx-service.toml --overlay-name local > .env1
# run service locally
# nhost up --run-service path/to/run-service.toml[:overlay_name]
nhost up --run-service ./nhost/nginx-service.toml:local
nhost up --run-service ./nhost/console-webapp.toml:local
```

## Reference

1. [configuration-overlays](https://docs.nhost.io/guides/cli/configuration-overlays)
2. [nhost-cli commands](https://github.com/nhost/nhost.toml)
3. [nhost-cli docs](https://github.com/nhost/nhost.toml/tree/main/docs)
