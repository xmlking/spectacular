# UI Components

Shared [shadcn-svelte](https://www.shadcn-svelte.com/) components.

## Setup

add/update `shadcn` components

Run this command and select `shadcn` components you want to add/update

```shell
cd packages/ui
# first time only run `bun run sync` this will create `.svelte-kit` folder
bun run sync
# create all shadcn-svelte files.
# --base-color =  "gray" | "neutral" | "slate" | "stone" | "zinc"
bun dlx shadcn-svelte@next init  -o \
--base-color=neutral \
--css=src/styles/neutral.css \
--components-alias=@repo/ui/components \
--lib-alias=@repo/ui \
--utils-alias=@repo/ui/utils \
--hooks-alias=@repo/ui/hooks \
--ui-alias=@repo/ui/components/ui
```

## Update

To add/update shadcn-svelte components, run:

```shell
cd packages/ui
# to add/update specific component
bun run ui:add button # this is command is equal to `bun dlx shadcn-svelte@next add button`
# OR to add/update all components
bun run ui:add --all  # equal to `bun dlx shadcn-svelte@next add --all`
```
