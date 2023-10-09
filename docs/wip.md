```shell
# clean dry-run
git clean -dfX -n
# clean exclude (remove `-n` , it used to try dry-run)
git clean -dfx -e TODO  -e .env.local -n
# update deps
pnpm up --latest -r
```
