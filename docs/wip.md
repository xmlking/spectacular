# WIP DOCS

```shell
# clean exclude TODO & .env (remove `-n` , it used to try dry-run)
git clean -dfx -e .env -e .env.production  -e .secrets -e .secrets.production \
-e .vercel -e apps/console/.vercel -e apps/console/config/certs -e TODO -e .idea -n
# update deps
pnpm up --latest -r
# convert docker-compose file to helm
mkdir -p infra/helm
export COMPOSE_PROFILES=all
export COMPOSE_ENV_FILES=.env,.secrets
docker compose config | kompose convert -c -f - -o ./infra/helm --volumes hostPath --profile all
# to run compose file in k8 directly
docker compose config | kompose up -c -f - --volumes hostPath --profile all
kubectl get deployment,svc,pods
docker compose config | kompose down -c -f - --volumes hostPath --profile all

## rename all files in a folder according to a specified naming convention
# https://github.com/Gadiguibou/stdrename
stdrename -kr .  
```
