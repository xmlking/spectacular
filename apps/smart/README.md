# Smart

Frontend to showcase `User-Interactive` AI Agents

## Developing

Once you've created a project and installed dependencies with `bun install`, start a development server:

```shell
turbo run smart#dev

# or start the server and open the app in a new browser tab
turbo run smart#dev -- --open
```

to add shadcn block:

```shell
bun shadcn-svelte@next add sidebar-07
```

## Building

To create a production version of your app:

```shell
turbo run smart#build
```

You can preview the production build with `turbo run smart#preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Reference

- [mastra](https://mastra.ai/) - The TypeScript Agent Framework
