# Developer Guide

## Requirements

### Node.js v20

_⚠️ Node.js v18 is also supported for the time being but support will be dropped in the near future_.

### [pnpm](https://pnpm.io/) package manager

The easiest way to install `pnpm` if it's not installed on your machine yet is to use `npm`:

```shell
$ brew install pnpm # via brew
$ npm install -g pnpm # OR via npm

# other global packages you will need
$ pnpm add -g turbo
$ pnpm add -g tsx
```

### [Nhost CLI](https://docs.nhost.io/cli)

- The CLI is primarily used for running local E2E tests and development
- Please refer to the [installation guide](https://docs.nhost.io/get-started/cli-workflow/install-cli) if you have not installed it yet

## File Structure

The repository is organized as a monorepo, with the following structure (only relevant folders are shown):

```
assets/            # Assets used in the README
docs/              # Developer Documentation
apps/
 web/              # Dashboard WebApp
 docs/             # Documentation website
 smart/            # AI experemental features
 offline/           # local-first/offline-first demo app
patches/           # pnpm patched dependencies
packages/          # Core packages
integrations/      # These are packages that rely on the core packages
```

## Get started

### Installation

First, clone this repository:

```shell
git clone https://github.com/xmlking/spectacular.git
```

Then, install the dependencies with `pnpm`:

```shell
cd spectacular
pnpm install
```

### Development

Although package references are correctly updated on the fly for TypeScript, example projects and the dashboard won't see the changes because they are depending on the build output. To fix this, you can run packages in development mode.

Running packages in development mode from the root folder is as simple as:

```shell
turbo run web#dev -- --open
```

Our packages are linked together using [PNPM's workspace](https://pnpm.io/workspaces) feature. Next.js and Vite automatically detect changes in the dependencies and rebuild everything, so the changes will be reflected in the examples and the dashboard.

## Edit Documentation

The easier way to contribute to our documentation is to go to the `apps/docs` folder and follow the [instructions to start local development](https://github.com/xmlking/spectacular/blob/main/apps/docs/README.md):

```shell
# not necessary if you've already done this step somewhere in the repository
turbo run docs#dev
```

## Run Test Suites

### Unit Tests

You can run the unit tests with the following command from the repository root:

```shell
turbo run console#test:unit
```

### E2E Tests

Each package that defines end-to-end tests embeds their own Spectacular configuration, that will be automatically when running the tests. As a result, you must make sure you are not running the Nhost CLI before running the tests.

You can run the e2e tests with the following command from the repository root:

```shell
turbo run console#test:integration
```

## Linting and Formatting

We uses [biome](https://biomejs.dev/) as a linter and formatter. To just check for errors, run

```shell
turbo run biome:check
```

To fix them, run

```shell
turbo run biome:fix
turbo run biome:fix:unsafe
```

both at the root of the monorepo. Not all errors can be fixed automatically.

There are a good number of errors in much of the older code, but please try not to introduce new ones.

## Changesets

If you've made changes to the packages, you must describe those changes so that they can be reflected in the next release.
We use [changesets](https://github.com/changesets/changesets) to support our versioning and release workflows. When you submit a pull request, a bot checks if changesets are present, and if not, it asks you to add them.

To create a changeset, run the following command from the repository root:

```shell
pnpm changeset
```

This command will guide you through the process of creating a changeset. It will create a file in the `.changeset` directory.

You can take a look at the changeset documentation: [How to add a changeset](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md).

### Selecting the Version

When you create a changeset, you will be asked to select the version of the package that you are bumping. The versioning scheme is as follows:

- **major**
  - For breaking changes (e.g: changing the function signature, etc.)
  - Should be avoided as much as possible as it will require users to update their code. Instead, consider supporting both the old and the new API simultaneously for a while.
  - For example: `v1.5.8` -> `v2.0.0`
- **minor**
  - For new features (e.g: adding a new page to the dashboard, etc.)
  - For example: `v1.5.8` -> `v1.6.0`
- **patch**
  - For bug fixes (e.g: fixing a typo, etc.)
  - For example: `v1.5.8` -> `v1.5.9`

### Writing Good Changesets

A concise summary that describes the changes should be added to each PR. This summary will be used as the changeset description.

The following structure is used for describing changes:

- **The type of the change**:

  - fix
  - feat
  - chore
  - docs

- **The scope of the change** (_broader scopes (e.g: dashboard, hasura-storage-js, etc.) are not recommended as GitHub Releases already contain which project is being bumped_):

  - projects
  - deployments
  - deps
  - etc.

- **A short summary of the changes that were made**

**Examples:**

- `fix(deployments): use correct timestamp for deployment details`
- `chore(deps): bump @types/react to v18.2.8`
- `feat(secrets): enable secrets`
- etc.

You can always take a look at examples of changesets in the [GitHub Releases section](https://github.com/xmlking/spectacular/releases).
