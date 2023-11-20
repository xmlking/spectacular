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
```
### Usage

#### Config

```shell
# Shows an example config file
nhost config example 
# alidate configuration
nhost config validate
# Shows configuration after resolving secrets
nhost config show 
nhost config show subdomain local
nhost config show subdomain bggkthwysdvphygfecpa
# Get cloud configuration
nhost config pull      
```

#### Run

```shell
nhost up
nhost up --apply-seeds
nhost down
# danger: delete docker volumes. Use it to reset postgres/hasura
nhost down --volumes
```

