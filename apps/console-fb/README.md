# Spectacular Web

Demo app build with `tailwind`, `flowbite`, `graphql`, `houdini`, `superforms`

## Developing

Once you've cloned the project and installed dependencies with `pnpm i`, start a development server:

```shell
turbo --filter=console-fb dev

# or start the server and open the app in a new browser tab
turbo --filter=console-fb dev -- --open

# run in debug mode
turbo --filter=console-fb dev:debug

# run with a custom inline config
# inline environment variables has higher precedence than ones loaded from .env and .env.local files
PUBLIC_GRAPHQL_ENDPOINT=api.mycompany.com:443 turbo dev
```

## Generate

Generate `i18n` types, `schema.graphql` etc...

```shell
turbo run generate --filter=console-fb
# or from prod
NODE_ENV=prod turbo run generate --filter=console-fb
```

## Maintenance

### Update

To update the packages to their latest versions in `package.json`

```shell
# TODO: not at available for bun
pnpm up --latest -r
pnpm audit --fix
```

## Format

Format and lint code

```shell
turbo --filter=console-fb format
turbo --filter=console-fb lint
```

## Testing

### Unit/Component Tests

```shell
turbo --filter=console-fb test

turbo --filter=console-fb test:ui
#Then, you can visit the Vitest UI at http://localhost:51204/__vitest__/.

# test coverage
turbo  --filter=console-fb test:coverage

# updating Snapshots
pnpx  -u --filter=console-fb vitest

# test specific folder
pnpx vitest apps/console-fb/src/lib/utils
(or)
./node_modules/.bin/vitest run apps/console/src/lib/utils
```

### E2E Tests

```shell
turbo --filter=console-fb test:e2e
```

## Building

To create a production version of your app:

```shell
turbo build
# run build
turbo --filter=console-fb... build
turbo --filter=console-fb... --dry build
turbo --filter=console-fb... --graph build
```

Run from the local build directory:

```shell
NODE_ENV=production \
PUBLIC_GRAPHQL_ENDPOINT=api.mycompany.com:443 \
node build

# (optional) pass ORIGIN when using `adapter-node` build
HOST=127.0.0.1 \
PORT=4000 \
ORIGIN=https://my.site \
node build
```

You can preview the production build with `turbo preview --filter=console...`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target
> environment.

## Release

after checking-in all your changes, bump the VERSION and build the docker image.

```shell
# dry-run
cog bump --auto --dry-run
# this will bump version in package.json and create git tag and commit.
cog bump --auto
```

## Libs

To build and publish libs

```shell
turbo --filter=lib... build
cd package
pnpm publish
```
