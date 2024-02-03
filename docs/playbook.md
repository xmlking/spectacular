# Playbook

Show how this repo is setup via step-by-step guild

## Base

### Prerequisite

Install following CLI tools globally

- [tsx](https://github.com/esbuild-kit/tsx) to run _TypeScript_ & _ESM_ files from command-line. This is **NOT** React's [TSX/JSX](https://www.typescriptlang.org/docs/handbook/jsx.html)
- [hasura-cli](https://hasura.io/docs/latest/hasura-cli/install-hasura-cli/) as GitOps tool for Hasura
- [dotenv](https://dotenv.run/)
- [turbo](https://turbo.build/repo/docs)
- [vercel](https://vercel.com/docs/cli)

```shell
pnpm add -g tsx
pnpm add -g hasura-cli
pnpm add -g turbo
pnpm add -g @dotenv-run/cli
pnpm add -g vercel
```

### Chrome Plugins

Install Chrome Plugins

- Svelte [DevTools](https://chromewebstore.google.com/detail/svelte-devtools/kfidecgcdjjfpeckbblhmfkhmlgecoff?pli=1)
- [GraphQL Network Inspector](https://chromewebstore.google.com/detail/graphql-network-inspector/ndlbedplllcgconngcnfmkadhokfaaln?hl=en-GB)

### Create

```shell
# bun create svelte@latest spectacular && cd $_ && code .
pnpm create svelte@latest spectacular && cd $_ && code .
# select `yes` for TypeScript, ESLint, Prettier, Playwright and Vitest
```

Next steps:

1. git init && git add -A && git commit -m "chore(root): first commit" (optional)
2. pnpm run dev -- --open

In this Playbook, we will be using [svelte-add](https://github.com/svelte-add/svelte-add) to easily add and integrate 3rd party tools to this Svelte App.

### Workspace

[dotenv-run](https://github.com/chihab/dotenv-run) helps loading _nested_ `.env` files in monorepo.

```shell
# pnpm add  -D dotenv-cli -w
pnpm add -D @dotenv-run/cli  -w
```

### Testing

We will use [vitest](https://vitest.dev/) for Component (mocked) testing and
[Playwright](https://playwright.dev/) for E2E tests (nothing is mocked).  
Code coverage via [c8](https://github.com/bcoe/c8) or [istanbul](https://istanbul.js.org/).

[svelte-add-vitest](https://github.com/davipon/svelte-add-vitest) preset will add vitest to your SvelteKit project.

For examples checkout [Svelte Component Test Recipes](https://github.com/davipon/svelte-component-test-recipes)

```shell
# optional
pnpm i -O @vitest/ui
```

```shell
# install supported browsers
pnpx playwright install
```

### SEO

#### Meta Tags, OG

Svelte [Meta Tags](https://github.com/oekazuma/svelte-meta-tags) provides components designed to help you manage SEO for Svelte projects.

```shell
pnpm add -D svelte-meta-tags --filter "./apps/**"
```

#### Image Optimization

[Svelte Images](https://kit.svelte.dev/docs/images) A toolbox of import directives for Vite that can transform your image at compile-time.

```shell
pnpm add -D @sveltejs/enhanced-img --filter "./apps/**"
```

**Setup**

```ts
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';

export default defineConfig({
	plugins: [enhancedImages()]
});
```

**Usage**

```ts
import Image from 'example.jpg?w=400&h=300&format=webp';
```

#### Dynamic OpenGraph images

[docs](https://dev.to/theether0/dynamic-og-image-with-sveltekit-and-satori-4438), [examples](https://github.com/etherCorps/sveltekit-og/tree/main/examples)

```shell
pnpm add -D @ethercorps/sveltekit-og --filter "./apps/docs"
```

### Release

#### changesets

working with changesets in [turborepo](https://turbo.build/repo/docs/handbook/publishing-packages/versioning-and-publishing)

```shell
npx changeset init
pnpm add -D @changesets/changelog-github  -w
```

### Web Analytics

[Vercel Web Analytics](https://vercel.com/docs/frameworks/sveltekit#web-analytics)

```shell
pnpm add -D @vercel/analytics --filter "./apps/**"
```

In your SvelteKit project's main `+layout.svelte` file, add the following `<script>`:

src/routes/+layout.svelte

```html
<script>
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	inject({ mode: dev ? 'development' : 'production' });
</script>
```

### Styling

We will be using [TailwindCSS](https://tailwindcss.com/) for system-wide styling.  
Follow [SvelteKit integration](https://tailwindcss.com/docs/guides/sveltekit) guide  
Animation with [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate), usage [example](https://github.com/bautistaaa/typehero), [Demo](https://www.typehero.dev/)

Add and configure tailwindcss via [svelte-add](https://github.com/svelte-add/tailwindcss)

```shell
pnpx svelte-add@latest tailwindcss  --typography --daisyui
# NOTE: tailwindcss's forms plugin and daisyui wont work together
# also add other tailwind plugins and include them in `tailwind.config.cjs`
pnpm add --save-peer @tailwindcss/container-queries tailwindcss-animate tailwind-merge clsx --filter ./packages/tailwind-config
pnpm add --save-peer  flowbite-svelte flowbite-svelte-blocks flowbite-svelte-icons flowbite-typography --filter ./packages/tailwind-config
pnpm add -D @tailwindcss/container-queries tailwindcss-animate tailwind-merge --filter "./apps/**"
pnpm add -D flowbite-svelte flowbite-svelte-blocks flowbite-svelte-icons flowbite-typography --filter "./apps/**"
```

Install JetBrain's [postcss](https://plugins.jetbrains.com/plugin/8578-postcss) plugin  
Rename any files in your repo, with file extension `postcss` to `pcss`

#### cssnano

Also add `cssnano` plugin for `postcss` and include it in [postcss.config.cjs](../postcss.config.cjs) for production env.

```shell
pnpm add -D cssnano
```

#### PostCSS Preset Env

[PostCSS Preset Env](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env) lets you convert modern CSS into something most browsers can understand,
determining the polyfills you need based on your targeted browsers or runtime environments.

Read: [Use Future CSS Today](https://joyofcode.xyz/using-future-css-in-svelte) and Watch: [video](https://www.youtube.com/watch?v=eqwtoaP-0pk)

```shell
pnpm add -D postcss-preset-env
```

Add `postcssPresetEnv` plugin for `postcss` and include it in [postcss.config.cjs](../postcss.config.cjs).

### UI Components

We will be using [Flowbite](https://flowbite.com/) its [Svelte UI Components](https://flowbite-svelte.com/)  
Follow **flowbite-svelte** [getting-started](https://flowbite-svelte.com/pages/getting-started) guild, install and configure `tailwind.config.cjs`

We will be using [Flowbite icons](https://flowbite.com/icons/) via [flowbite-svelte-icons](https://github.com/themesberg/flowbite-svelte-icons) Icon Components.

Use [clsx](https://github.com/lukeed/clsx) in place of [classnames](https://github.com/JedWatson/classnames) utility lib for constructing _className_ strings conditionally.

Flowbite Svelte Blocks: [quickstart](https://flowbite-svelte-blocks.vercel.app/pages/quickstart)

```shell
# pnpm add -D flowbite flowbite-svelte tailwind-merge
# pnpm add -D flowbite-svelte-icons
pnpm add -D flowbite-svelte flowbite-svelte-blocks flowbite-svelte-icons
pnpm add -D clsx
```

Other optional UI Components

- [DaisyUI](https://daisyui.com/)
- [headlessUI](https://captaincodeman.github.io/svelte-headlessui)
- [skeleton](https://www.skeleton.dev/)

I will be using both **flowbite** and **daisyui** for UI Components

```shell
pnpm add -D daisyui
```

Then add daisyUI to your **tailwind.config.js** files:

```js
const config = {
  //...
  plugins: [typography,  ..., daisyui]
}
```

#### skeleton

```shell
pnpm add -D @skeletonlabs/skeleton
```

And follow **skeleton** specific sveltekit [changes](https://www.skeleton.dev/guides/frameworks/sveltekit)

#### shadcn-svelte

```
pnpm add -D tailwind-variants clsx tailwind-merge --filter "./apps/console3"
pnpm add -D mode-watcher --filter "./apps/web"
```

### UI Blocks

- [Kometa UI Kit](https://kitwind.io/products/kometa) (Free) [Blocks](https://kitwind.io/products/kometa/components)
- [Tailblocks](https://tailblocks.cc/) via [tailblocks github](https://github.com/mertJF/tailblocks)
- [Tailwind Components](https://tailwindcomponents.com/) (Free)
- Flowbite [Blocks](https://flowbite.com/blocks/) via [flowbite-svelte-blocks](https://github.com/shinokada/flowbite-svelte-blocks)
- [Konsta UI](https://konstaui.com/svelte) - is a free and open source mobile UI svelte components framework built with [Tailwind CSS](https://tailwindcss.com/).

### Tools

#### Prettier

Lets add [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)

`prettier-plugin-svelte` has conflict with `prettier-plugin-tailwindcss` which is included during _SvelteKit_ project creation.  
To work around this, `prettier-plugin-tailwindcss` **must** be loaded last, meaning Prettier auto-loading needs to be disabled. You can do this by setting the `pluginSearchDirs` option to `false` and then listing each of your Prettier plugins in the plugins array:

```shell
pnpm add -D prettier-plugin-tailwindcss
pnpm add -D prettier-plugin-packagejson -w 
```

```shell
// .prettierrc
{
  // ..
  "plugins": [
    "prettier-plugin-svelte",
    "prettier-plugin-organize-imports",
    "prettier-plugin-tailwindcss" // MUST come last
  ]
}
```

#### Docker

Added [Dockerfile](../Dockerfile) and GitHub [actions](../.github/workflows).

## Addons

### Recommended

1. Headless Table
   1. [Svelte Headless Table](https://svelte-headless-table.bryanmylee.com/#headless)
   2. [TanStack Table](https://tanstack.com/table/v8)
2. [A lightweight Svelte Action to make your elements draggable](https://github.com/PuruVJ/neodrag/tree/main/packages/svelte#readme)

```shell
# table library for Svelte
pnpm add -D svelte-headless-table  --filter "./apps/**"
#pnpm add -D @tanstack/svelte-table
# form library for Svelte
pnpm i -D sveltekit-superforms zod formsnap zod-form-data sveltekit-rate-limiter --filter "./apps/**"
# make any element draggable
pnpm add -D @neodrag/svelte --filter "./apps/**"
# to fetch, cache and update data
pnpm add -D @tanstack/svelte-query --filter "./apps/**"
```

### Optional

### view-transition

with [sveltekit-view-transition](https://github.com/paoloricciuti/sveltekit-view-transition/tree/main)

```shell
pnpm add -D sveltekit-view-transition@latest --filter "./apps/**"
```

#### Markdown CMS

```shell
pnpx svelte-add@latest mdsvex
```

#### Time Distance

[svelte-time-distance](https://github.com/joshnuss/svelte-time-distance) Display time distances in a human readable format.

```shell
pnpm add -D svelte-time-distance date-fns
```

#### Error Tracking

Sentry helps track errors in code.

```shell
pnpx sentry/wizard@latest -i sveltekit
```

#### GraphQL

**VS Code:** install `GraphQL.vscode-graphql` VS Code plugin

use [houdini](https://www.houdinigraphql.com/) as GraphQL Client. [example](https://github.com/hygraph/hygraph-examples/tree/master/with-houdini)

**houdini cli** [docs](https://www.houdinigraphql.com/api/cli)

Houdini Plugins

- [live-queries](https://grafbase.com/docs/realtime/live-queries#houdini)

```shell
pnpm add -D houdini graphql-ws

# pnpx houdini init
pnpx houdini@latest init --headers "x-hasura-admin-secret=<HASURA_GRAPHQL_ADMIN_SECRET>"

# To updated your local schema with latest from the graphql server, run:
# HINT: it will use `apiUrl` and `schemaPollHeaders` in `houdini.config.js`
cd apps/web
node_modules/.bin/houdini pull-schema
```

(Or) [URQL](https://formidable.com/open-source/urql/docs/basics/svelte/). [example](https://github.com/hygraph/hygraph-examples/tree/master/with-sveltekit-and-urql)

```shell
pnpm add -D @urql/svelte graphql
# TypeScript integration (optional)
# https://formidable.com/open-source/urql/docs/basics/typescript-integration/
pnpm add -D @graphql-codegen/cli @graphql-codegen/client-preset -w
```

#### OpenID Connect

Use [Auth.js](https://authjs.dev/) for Authentication

> TODO: try [jose](https://github.com/panva/jose) as alternative to jsonwebtoken ?

```shell
pnpm add  -D @auth/core @auth/sveltekit @auth/hasura-adapter --filter "./apps/web"
# for custom encode and decode JWT.
# pnpm add jsonwebtoken
# pnpm add -D @types/jsonwebtoken
# https://github.com/auth0/node-jsonwebtoken/issues/655
pnpm add jose

# Hasura Auth.js Adopter
pnpm add  -D next-auth-hasura-adapter
```

#### Cookies

Set/Get/Remove cookies in browser (for server-side svelte already provide utils)

#### Forms

Custom form elements

```shell
pnpm add -D svelte-select
```

#### i18n

We switched to inlang's [Paraglide JS](https://inlang.com/m/dxnzrydw/library-inlang-paraglideJsAdapterSvelteKit) for i18n

```shell
npx @inlang/paraglide-js init
npm i -D @inlang/paraglide-js-adapter-sveltekit
```

#### Progressive Web Apps (PWA)

check [example](https://github.com/vite-pwa/sveltekit/tree/main/examples/sveltekit-ts) for reference.

```shell
# pnpm add -D @vite-pwa/sveltekit
pnpm add -D @vite-pwa/sveltekit vite-plugin-pwa workbox-window
```

#### Enable https (optional)

**Step 1:** install `mkcert` and initialize RootCA

```shell
brew install mkcert
mkcert -install # sudo is needed
# this will create root CA cert into: `mkcert -CAROOT` output
mkcert -CAROOT
```

**Step 2:** Configure **vite** to start with **https**

```shell
pnpm add -D  vite-plugin-mkcert
```

Update `vite.config.ts`

```ts
# vite.config.ts

import mkcert from 'vite-plugin-mkcert';

const config: UserConfig = {
 server: {
  https: true
 },
 plugins: [
  mkcert(),
 ]
};

export default config;
```

When server started for the first time with `pnpm dev`, it will create `dev.key` and `dev.pem` in `~/.vite-plugin-mkcert/certs`

know issues: <https://github.com/sveltejs/kit/issues/4362>
