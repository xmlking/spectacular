# Astro

**Astro** is an *all-in-one web framework* for building *fast, content-focused* websites.

## Setup

### Prerequisites  

- **Node.js** - v20.6.0 or higher.
- **pnpm** 
- Astro VSCode Extention - 	[astro-build.astro-vscode](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode)

### Create Project

```shell
# create a new project with pnpm
pnpm create astro@latest

# 
# 
pnpm astro add svelte tailwind partytown
pnpm astro add starlight
```
#### Add optional integrations

See optional addable [integrations](https://docs.astro.build/en/guides/integrations-guide/svelte/) 
```shell
pnpm astro add svelte tailwind partytown
pnpm astro add starlight
```

#### Add linting tools

Add [eslint-plugin-astro](https://github.com/withastro/prettier-plugin-astro)

```shell
pnpm add -D prettier prettier-plugin-astro -w
# use
prettier --write . --plugin=prettier-plugin-astro
```

Add [eslint-plugin-astro](https://ota-meshi.github.io/eslint-plugin-astro/user-guide/)
```shell
pnpm add -D eslint-plugin-astro --filter "eslint-config-custom"
```

## Start

```shell
pnpm run dev
```


## Referencwe
- [Astro Launchpad](https://github.com/kyr0/astro-launchpad/tree/main) - Astro monorepo with vercel, turbo
- [Turbo Hybrid Astro on Vercel](https://github.com/kyr0/turbo-hybrid-astro-on-vercel/tree/main)
