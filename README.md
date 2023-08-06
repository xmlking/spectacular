# Spectacular

This is a spectacular full-stack [Turborepo](https://turbo.build/repo/docs/handbook) template project with multiple meta-frameworks all working in harmony and sharing packages.

## Using this example

Run the following command:

```sh
npx create-turbo@latest -e with-svelte
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- WebApps
  - `docs`: a sample documentation [svelte-kit](https://kit.svelte.dev/) web app
  - `web`: a sample [svelte-kit](https://kit.svelte.dev/) web app
- Packages
  - `ui`: a stub Svelte component library shared by both `web` and `docs` applications
  - `eslint-config-custom`: `eslint` configurations (includes `eslint-plugin-svelte` and `eslint-config-prettier`)
  - `tailwind-config`: shared `tailwindcss` configurations (includes etc...)
  - `helpers`: utility functions used throughout the monorepo

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
