# Turborepo

[Turborepo](https://turbo.build/repo/docs/handbook)enable managing deployable **apps** and associated [Sharing Code](https://turbo.build/repo/docs/handbook/sharing-code) in single git repo.  
Sharing Code cab be either [Internal Packages](https://turbo.build/repo/docs/handbook/sharing-code/internal-packages) or [External Packages](https://turbo.build/repo/docs/handbook/publishing-packages)

> _Internal packages_ are [packages](https://turbo.build/repo/docs/handbook/sharing-code) which are only intended to be used inside your monorepo. They're extremely useful for sharing code between apps in closed-source monorepos.  
> _External packages_ run their files through a **bundler** before putting them on a package registry.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- WebApps
  - `playground`: an experimental [svelte-kit](https://kit.svelte.dev/) web app to play with new ideas.
  - `docs`: a sample documentation [svelte-kit](https://kit.svelte.dev/) web app
  - `web`: a sample [svelte-kit](https://kit.svelte.dev/) web app
- Packages
  - `ui`: a stub Svelte component library shared by both `web` and `docs` applications
  - `eslint-config-custom`: `eslint` configurations (includes `eslint-plugin-svelte` and `eslint-config-prettier`)
  - `tailwind-config`: shared `tailwindcss` configurations (includes etc...)
  - `helpers`: utility functions used throughout the monorepo

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Prerequisite

```shell
# pnpm add -g turbo@latest
pnpm add -g turbo@latest
```

## Setup

### Create sveltekit turborepo

to create a new sveltekit turborepo, Run the following command:

```sh
pnpx create-turbo@latest -e with-svelte
# bunx create-turbo@latest -e with-svelte
```

### Setup Remote Caching for Turborepo on Vercel

```shell
npx turbo login
npx turbo link
# bunx turbo login
```

## Usage

### Environment

### App Environment Variables

> Turbo is working on [first-class solution](https://turbo.build/repo/docs/handbook/dev#using-environment-variables) to load **dotEnv** files.  
> Meanwhile we recommend using a library called [dotenv-run](https://github.com/chihab/dotenv-run) to solve this problem.

~~turbo automatically include environment variables from `.env` , `.secrets` as we set them at `globalDotEnv` in `turbo.json`~~

### Run

```shell
turbo dev --filter=playground
turbo dev --filter=web
turbo dev --filter=docs
```

### Test

```shell
turbo test --filter=helpers
```

### Build

```shell
turbo build --filter=playground...
turbo build --filter=playground... --summarize
turbo build --filter=playground... --dry
turbo build --filter=playground... --graph
```

### Maintenance

migrate command which both upgrades your repo to the specified version (latest by default) of turbo, and runs any codemods required.

```shell
pnpx  @turbo/codemod migrate
```

### Docker Build

```shell
# for dockerfile
turbo prune --scope=playground --docker
```

## Guides

```shell
turbo build
turbo dev
turbo dev  --filter=playground
turbo lint
turbo run generate
pnpx turbo login

turbo prune --scope=playground --docker
```
