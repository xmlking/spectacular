```shell
# clean dry-run
git clean -dfX -n
# clean exclude
git clean -dfx -e TODO  -e .env.local -e .idea -n
# update deps
pnpm up --latest -r
```
