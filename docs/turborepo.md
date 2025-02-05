# Turborepo

A **monorepo** is a single repository containing multiple distinct projects, with well-defined relationships. learn more at [monorepo.tools](https://monorepo.tools/)

[Turborepo](https://turbo.build/repo/docs/handbook)enable managing deployable **apps** and associated [Sharing Code](https://turbo.build/repo/docs/handbook/sharing-code) in single git repo.  
Sharing Code cab be either [Internal Packages](https://turbo.build/repo/docs/handbook/sharing-code/internal-packages) or [External Packages](https://turbo.build/repo/docs/handbook/publishing-packages)

> _Internal packages_ are [packages](https://turbo.build/repo/docs/handbook/sharing-code) which are only intended to be used inside your monorepo. They're extremely useful for sharing code between apps in closed-source monorepos.  
> _External packages_ run their files through a **bundler** before putting them on a package registry.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- WebApps
  - `playground`: an **experimental** [svelte-kit](https://kit.svelte.dev/) web app to play with new ideas.
  - `docs`: a sample **documentation** web app build with astro's [starlight](https://starlight.astro.build/)
  - `web`: a sample **landing page** web app build with [astro](https://astro.build/)
  - `console`: a sample **dashboard** web app build with [svelte-kit](https://kit.svelte.dev/)
- Packages
  - `ui`: a stub Svelte component library shared by both `web` and `docs` applications
  - `biome-config`: shared `biome.jsonc` files
  - `typescript-config`: shared `tsconfig` files
  - `utils`: utility functions used throughout the monorepo

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking ✅
- [Biome](https://biomejs.dev/) for code linting, formatting, and fixing 🌿
- [DotEnv](https://dotenv.run/) for loading environment variables from `.env.[NODE_ENV]` files with _Monorepo_ support.
- [Changesets](https://github.com/changesets/changesets) for managing versioning, changelogs, and publishing 📝
- [Manypkg](https://github.com/Thinkmill/manypkg) is a linter for `package.json` files in Yarn, Bolt or pnpm monorepos.
  - `manypkg check` runs all of the [checks](https://github.com/Thinkmill/manypkg?tab=readme-ov-file#checks) against your monorepo, logs any errors and exits with a code.
  - `manypkg fix` runs all of the [checks](https://github.com/Thinkmill/manypkg?tab=readme-ov-file#checks) against your monorepo and fixes any of problems that can be fixed.

## Prerequisite

1. Turbo CLI, dotenv CLI and biome

```shell
pnpm add -g turbo@latest
pnpm add -g @dotenv-run/cli
pnpm add -g @biomejs/biome
# in repo root directory
pnpm add -D @changesets/cli @changesets/changelog-github  -w
```

2. VS Code monorepo plugin: [Monorepo Focus Workspace](https://marketplace.visualstudio.com/items?itemName=alberto-varela.monorepo-focus-workspace)

```shell
code --install-extension alberto-varela.monorepo-focus-workspace
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
pnpx turbo login
pnpx turbo link
# bunx turbo login
```

To disable Remote Caching, run `pnpx turbo unlink`

### Environment Variables

> Turbo is working on [first-class solution](https://turbo.build/repo/docs/handbook/dev#using-environment-variables) to load **dotEnv** files.  
> Meanwhile we recommend using a library called [dotenv-run](https://dotenv.run/) to solve this problem.

~~turbo automatically include environment variables from `.env` , `.secrets` as we set them at `globalDotEnv` in `turbo.json`~~

Add `dotenv-run` to your `package.json`

```json filename="package.json" highlight=3
{
  "scripts": {
    "dev": "dotenv-run -f ../../.env -f ../../.secrets -f .env -f .secrets -v -- vite dev",
    "build": "dotenv-run -f ../../.env -f ../../.secrets -f .env -f .secrets -v -- vite build",
    "preview": "dotenv-run -f ../../.env -f ../../.secrets -f .env -f .secrets -v -- vite preview"
  }
}
```

#### Verify App Environment Variables

```shell
cd apps/console
dotenv-run -f .env,.secrets -v '.*'
# Use unsecure mode to print values
dotenv-run -f .env,.secrets -v '.*' -u
# using printenv
dotenv-run -f .env,.secrets -v -- printenv
# using node script
dotenv-run -f ../../.env -f ../../.secrets -f .env -f .secrets -v -- node -e "console.log(process.env.PUBLIC_NHOST_SUBDOMAIN)"
```

### Guidelines

Guidelines for configuring `turbo.json`

1. Don't keep workspace specific tasks in root `turbo.json` e.g., `check` task only apply to `sveltekit` workspace, `preview` task don't apply to `packages` workspaces. Instead, move them to workspace's turbo.json file i.e., `/apps/web/turbo.json`
2. If you don't include a key in workspace specific tasks, the configuration is **inherited** from the extended `turbo.json`.
3. Use `dependsOn` to enforce order of execution

## Usage

> You can use `--dry / --dry-run` flag with any **turbo** commands, to preview what tasks will execute without really running them.
> Use `--log-order=stream` flag to opt-out from terminal UI.

### Run

```shell
turbo run web#dev
turbo run docs#dev
turbo --filter=console --log-order=stream dev
```

### Test

```shell
turbo --filter=@spectacular/utils test
```

### Build

```shell
turbo build --filter=console...
turbo build --filter=console... --summarize
turbo build --filter=console... --dry-run
turbo build --filter=console... --graph
```

### Maintenance

migrate command which both upgrades your repo to the specified version (latest by default) of turbo, and runs any codemods required.

```shell
pnpx @turbo/codemod migrate --force
```

### Docker Build

```shell
# for dockerfile
turbo prune --scope=playground --docker
```

## Guides

```shell
# List all tasks in the repository
turbo run
# List tasks in a specific package
turbo run --filter=console
# Using Automatic Package Scoping
cd packages/ui && turbo run
# List all packages in the repository
turbo ls
# List dependencies and tasks for the `web` package
turbo ls console
## List affected packages
turbo ls --affected
turbo build
turbo dev
turbo dev  --filter=console
turbo lint
turbo run lint test --affected
turbo run generate
turbo run generate  --dry-run
pnpx turbo login

turbo prune --scope=console --docker
```
