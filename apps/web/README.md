# Spectacular Web

Demo app build with `tailwind`, `flowbite`, `graphql`, `houdini`, `superforms`

## Developing

Once you've cloned the project and installed dependencies with `pnpm i`, start a development server:

```shell
pnpm run dev --filter=./apps/web

# or start the server and open the app in a new browser tab
pnpm run dev --filter=./apps/web -- --open

# run in debug mode
pnpm run dev:debug --filter=./apps/web

# run with a custom inline config
# inline environment variables has higher precedence than ones loaded from .env and .env.local files
PUBLIC_GRAPHQL_ENDPOINT=api.mycompany.com:443 pnpm run dev
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
pnpm run format --filter=web
pnpm run lint --filter=web
```

## Testing

### Unit/Component Tests

```shell
pnpm run test --filter=web

pnpm run test:ui --filter=web
#Then, you can visit the Vitest UI at http://localhost:51204/__vitest__/.

# test coverage
pnpm run test:coverage --filter=web

# updating Snapshots
pnpx vitest -u --filter=web

# test specific folder
pnpx vitest apps/web/src/lib/utils
(or)
./node_modules/.bin/vitest run apps/web/src/lib/utils
```

### E2E Tests

```shell
pnpm run test:e2e --filter=web
```

## Building

To create a production version of your app:

```shell
pnpm run build
# run build
pnpm run build  --filter=web...
pnpm run build  --filter=web... --dry
pnpm run build --filter=web... --graph
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

You can preview the production build with `pnpm run preview`.

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
pnpm run build --filter=lib...
cd package
pnpm publish
```
