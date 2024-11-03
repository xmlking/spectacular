# UI Components

Shared [shadcn-svelte](https://www.shadcn-svelte.com/) components.

## Setup

add/update `shadcn` components

Run this command and select `shadcn` components you want to add/update

```shell
cd packages/ui
# first time only run `pnpm run sync` this will create `.svelte-kit` folder
pnpm run sync
# then run add/update commands
pnpm run ui:add button # this is command is equal to `pnpm dlx shadcn-svelte@next add button`
# or 
pnpm run ui:add --all  # equal to `pnpm dlx shadcn-svelte@next add --all`
# FIXME : https://github.com/huntabyte/shadcn-svelte/issues/1368
pnpm run ui:update button
# or 
pnpm run ui:update --all # equal to `pnpm dlx shadcn-svelte@next update --all`
```

## TODO

change `$ui/components` to internal `#ui/components` in `components.json` and remove alias in `tsconfig.json` add internal to `package.json`
