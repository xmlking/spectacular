# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```shell
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```shell
turbo run --filter=@spectacular/smart-app dev

# or start the server and open the app in a new browser tab
turbo run --filter=@spectacular/smart-app dev -- --open
```

to add shadcn block:

```shell
pnpm shadcn-svelte@next add sidebar-07
```

## Building

To create a production version of your app:

```shell
turbo run --filter=@spectacular/smart-app build
```

You can preview the production build with `turbo run --filter=@spectacular/smart-app preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
