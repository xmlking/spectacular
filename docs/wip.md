```shell
# clean exclude TODO & .env (remove `-n` , it used to try dry-run)
git clean -dfx -e TODO  -e .env.local  -e .env -e .secrets -n
# update deps
pnpm up --latest -r
```
