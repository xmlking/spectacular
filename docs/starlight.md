# Starlight

[Starlight](https://starlight.astro.build/) is a documentation website framework for [Astro](https://astro.build/).

## Setup

### Prerequisites  

- **Node.js** - v20.6.0 or higher.
- **pnpm** 
- Astro VSCode Extention - 	[astro-build.astro-vscode](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode)

### Create Project

```shell
# create a new project with pnpm
pnpm create astro@latest
pnpm astro add starlight

# create a new project with an official example
pnpm create astro@latest --template starlight/tailwind

 


pnpm astro add svelte tailwind partytown
https://docs.astro.build/en/guides/integrations-guide/svelte/
```

Add other tools `Prettier` `ESLint `
```shell
pnpm add -D prettier prettier-plugin-astro -w
# use
prettier --write . --plugin=prettier-plugin-astro
```
## Start

```shell
pnpm run dev
```
