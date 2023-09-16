# Spectacular Web

Demo app build with `tailwind`, `flowbite`, `graphql`, `houdini`, `superforms`

## Developing

Once you've cloned the project and installed dependencies with `bun i`, start a development server:

```shell
bun dev --filter=./apps/web

# or start the server and open the app in a new browser tab
bun dev --filter=./apps/web -- --open

# run in debug mode
bun dev:debug --filter=./apps/web

# run with a custom inline config
# inline environment variables has higher precedence than ones loaded from .env and .env.local files
PUBLIC_GRAPHQL_ENDPOINT=api.mycompany.com:443 bun dev
```

## Maintenance

### Update

To update the packages to their latest versions in `package.json`

```shell
bun up --latest -r
bun audit --fix
```

## Testing

### Unit/Component Tests

```shell
bun test

bun test:ui
#Then, you can visit the Vitest UI at http://localhost:51204/__vitest__/.

# test coverage
bun test:coverage

# updating Snapshots
bunx vitest -u

# test specific folder
bunx vitest apps/web/src/lib/utils
(or)
./node_modules/.bin/vitest run apps/web/src/lib/utils
```

### E2E Tests

```shell
bun test:e2e
```

## Building

To create a production version of your app:

```shell
bun build
# run build
bun build  --filter=playground...
bun build  --filter=playground... --dry
bun build --filter=playground... --graph
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

You can preview the production build with `bun preview`.

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
bun build --filter=lib...
cd package
bun publish
```
