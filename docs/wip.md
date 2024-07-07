# WIP DOCS

```shell
# clean exclude TODO & .env (remove `-n` , it used to try dry-run)
git clean -dfx -e TODO  -e .env.local  -e .env -e .env.prod -e .env.test -e .secrets -e .secrets.prod -e .vercel \
-e apps/playground/.env.test -e infra/base/traefik/certs -e infra/base/mailpit/certs -e infra/helm -e compose.nhost.yml -e .idea -n
# update deps
pnpm up --latest -r
# convert docker-compose file to helm
mkdir -p infra/helm
export COMPOSE_PROFILES=all
export COMPOSE_ENV_FILES=.env,.secrets,apps/console/.env,apps/console/.secrets
docker compose config | kompose convert -c -f - -o ./infra/helm --volumes hostPath --profile all
# to run compose file in k8 directly
docker compose config | kompose up -c -f - --volumes hostPath --profile all
kubectl get deployment,svc,pods
docker compose config | kompose down -c -f - --volumes hostPath --profile all

## rename all files in a folder according to a specified naming convention
# https://github.com/Gadiguibou/stdrename
stdrename -kr .  
```
