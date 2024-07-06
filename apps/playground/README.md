# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```shell
# create a new project in the current directory
pnpm create svelte@latest

# create a new project in my-app
pnpm create svelte@latest apps/my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```shell
turbo --filter=playground dev

# or start the server and open the app in a new browser tab
turbo --filter=playground dev -- --open
```

## Generate

Generate `i18n` types, `schema.graphql` etc...

```shell
turbo --filter=playground run generate
```

## Building

To create a production version of your app:

```shell
turbo  --filter=playground... build
turbo  --filter=playground... --summarize build
turbo  --filter=playground... --dry build
turbo  --filter=playground... --graph build
```

You can preview the production build with `turbo preview --filter=playground`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
