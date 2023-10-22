# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```shell
# create a new project in the current directory
pnpm create svelte@latest

# create a new project in my-app
pnpm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```shell
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```shell
pnpm run build
```

You can preview the production build with `pnpm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## References

- [The standard sync layer for local-first apps](https://electric-sql.com/)
- Creating an Offline-Ready SvelteKit Application Using SQLite (Part 1): [Setting up the Database](https://hartenfeller.dev/blog/sveltekit-offline-sqlite-1)
- [Svelte offline SQLite ](https://github.com/phartenfeller/sveltekit-1.0-sqlite-demo-app)
