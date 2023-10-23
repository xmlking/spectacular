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
turbo dev --filter=playground

# or start the server and open the app in a new browser tab
turbo dev --filter=playground -- --open
```

Generate `i18n` types.

```shell
turbo i18n --filter=playground
```

## Building

To create a production version of your app:

```shell
turbo build --filter=playground...
turbo build --filter=playground... --summarize
turbo build --filter=playground... --dry
turbo build --filter=playground... --graph
```

You can preview the production build with `turbo preview --filter=playground`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
