# temp

```shell
kustomize cfg tree config/
# format all *.yaml and *.yml recursively traversing directories
kustomize cfg fmt config/
kustomize cfg count config/
# build
kustomize build config/overlays/default
# fix
kustomize edit fix
```
