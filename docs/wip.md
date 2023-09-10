```shell
# clean dry-run
git clean -dfX -n
# clean exclude
git clean -dfx -e TODO  -e .idea  -e .env.local -n
# update deps
pnpm up --latest -r
```
