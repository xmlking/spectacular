# mailpit

SMTP Relay for Development time.

## Mailpit TLS Certs

Generate `certs` to enable **TLS** transport for **Mailpit**, so that **hasura-auth** can use it for sending email securely.

> [!NOTE]  
> we use `mailpit` for local development only. for prod env, we should use any 3rd party managed SMTP relays.

### Prerequisites

- [mkcert](https://github.com/FiloSottile/mkcert)

```shell
brew install mkcert
```

### Generate

`./create-certs.sh SAN [SAN...]` can be used for creating certificates.

```shell
cd infra/base/mailpit
./create-certs.sh mailpit
# go back to project root
cd ../../..
```
