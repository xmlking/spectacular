# Astro

**Astro** is an _all-in-one web framework_ for building _fast, content-focused_ websites.

## Setup

### Prerequisites

- **Node.js** - v20.6.0 or higher.
- **pnpm**
- Astro VSCode Extention - [astro-build.astro-vscode](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode)

### Create Project

```shell
# create a new project with pnpm
pnpm create astro@latest

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

TODO: add astro biome linting tools

## Start

```shell
pnpm run dev
```

## Upgrade

Anytime a new version of astro released, we can upgrade to latest version with:

```shell
cd apps/web
bunx @astrojs/upgrade
```

## Reference

- [Astro Launchpad](https://github.com/kyr0/astro-launchpad/tree/main) - Astro monorepo with vercel, turbo
- [Turbo Hybrid Astro on Vercel](https://github.com/kyr0/turbo-hybrid-astro-on-vercel/tree/main)
