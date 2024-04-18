```shell
# clean exclude TODO & .env (remove `-n` , it used to try dry-run)
git clean -dfx -e TODO  -e .env.local  -e .env -e .env.prod -e .env.test -e .secrets -e .secrets.prod -e apps/playground/.env.test -e infra/base/traefik/certs -e compose.nhost.yml -e .idea -n
# update deps
pnpm up --latest -r
```
