# Svelte Starter Kit

Everything you need to build a Svelte project, powered
by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Tech Stack

- JS Framework [SvelteKit](https://kit.svelte.dev/)
- CSS: [Tailwind CSS](https://tailwindcss.com/)
- UI Components: tailwindcss based [Flowbite](https://flowbite.com/)/[flowbite-svelte](https://flowbite-svelte.com/), [skeleton](https://www.skeleton.dev/) and [DaisyUI](https://daisyui.com/)
- Unit/Component testing: [vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Svelte Testing Library](https://github.com/testing-library/svelte-testing-library)
- API Mocking: [Mock Service Worker](https://mswjs.io/)
- Code Coverage [c8](https://c8.io/)
- End-to-End Testing: [playwright](https://playwright.dev/)
- GraphQL: [Houdini](https://www.houdinigraphql.com/) & [Hasura](https://hasura.io/)
- Authentication: [Auth.js](https://authjs.dev/)
- PWA: [Vite PWA](https://vite-pwa-org.netlify.app/frameworks/sveltekit.html)

## Features

- [x] Responsive Design: [Container queries](https://www.smashingmagazine.com/2021/05/complete-guide-css-container-queries/)
- [ ] **Progressive Web Apps (PWAs):**
  - [x] Smart caching with Service Works
  - [ ] Re-engage customers with Push Notifications
  - [x] Push Application Updates
- [ ] Fonts and Image Optimization: edge caching, Lazy-loading images
- [ ] SEO optimization
- [x] **GraphQL:** [Houdini](https://www.houdinigraphql.com/) the disappearing GraphQL client for SvelteKit. and [nHost](https://nhost.io/) as BaaS
- [x] **Forms:** Form handling with [[superforms](https://superforms.vercel.app/), [source](https://github.com/ciscoheat/sveltekit-superforms)] and Validation with `zod`
- [ ] **Error Handling:**
  - [x] Strongly Typed Error Handling with [generic errors](./src/lib/errors#readme)
  - [x] _FormData_ preprocessing with [zodfd](./src/lib/zodfd#readme)
- [x] **Themes:** tailwindcss **DarkMode** switcher
- [x] **Deployment:** Docker build and deployment serverless / k8s runtimes.
- [x] **Tables:** [svelte-headless-table](https://svelte-headless-table.bryanmylee.com/docs/getting-started/overview#what-is-a-headless-ui-library)
- [ ] **Security:** Use [Auth.js](https://authjs.dev/) when [stable](https://vercel.com/blog/announcing-sveltekit-auth)
- [ ] [Vitebook](https://vitebook.dev/introduction/what-is-vitebook.html) or [Storybook 7](https://github.com/storybookjs/storybook/blob/next/code/frameworks/sveltekit/README.md)
- [ ] [GraphQL Yoga API](https://github.com/dotansimha/graphql-yoga/blob/main/examples/sveltekit/src/routes/api/graphql/%2Bserver.ts)
- [ ] Documentation micro site with [Astro](https://github.com/PuruVJ/neodrag/tree/main/docs)
- [ ] Build Tools
  - [ ] Use [Bob.Build](https://bob.build/) for Smart Builds, Build Cache etc and Bob's [github-actions](https://bob.build/docs/ci-recipes/github-actions/)
  - [ ] Use [earthly.dev](https://earthly.dev/) - Great for monorepos, Compatible with Every Language, Framework, and Build Tool
- [x] Use [sveltekit-og](https://github.com/etherCorps/sveltekit-og) for Open Graph Image Generation

## Experementing

- [ ] **tRPC-SvelteKit** [End-to-end typesafe APIs](https://icflorescu.github.io/trpc-sveltekit) SvelteKit.
- [ ] **Monorepo:** Convert to monorepo using [pnpm](https://pnpm.io/), [turborepo/turbopack](https://turbo.build/), [rome](https://rome.tools/) and [changesets](https://github.com/changesets/changesets). [Guide](https://nhost.io/blog/how-we-configured-pnpm-and-turborepo-for-our-monorepo) & Examples [[1](https://github.com/vercel/turbo/tree/main/examples/with-svelte), [2](https://github.com/oneezy/monorepo),[3](https://github.com/orefalo/sveltekit-monorepo)]
- [ ] **TAURI:** Use [tauri](https://tauri.app/) for multi-platform

## Setup

```shell
cd ~/Developer/Work/SPA
git clone https://github.com/xmlking/svelte-starter-kit.git
cd svelte-starter-kit && pnpm i
# playwright is required for end-to-end testing
pnpx playwright install
# (optional) add git-commit-hooks
cog install-hook --all
```

### Environment Variables

By default, the `dev` server (dev command) runs in `development` mode and the `build` command run in `production`
mode.  
This means when running `npm build`, it will load the env variables from `.env.production` if there is one:  
Use `.env.local` to override environment variables in `.env` (like API keys) for local development.

````shell
## Developing

Once you've cloned the project and installed dependencies with `pnpm i`, start a development server:

```shell
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev -- --open

# run in debug mode
pnpm dev:debug

# run with a custom inline config
# inline environment variables has higher precedence than ones loaded from .env and .env.local files
PUBLIC_GRAPHQL_ENDPOINT=api.mycompany.com:443 pnpm dev
````

## Maintenance

### Update

To update the packages to their latest versions in `package.json`

```shell
pnpm up --latest
pnpm audit --fix
```

## Testing

### Unit/Component Tests

```shell
pnpm test

pnpm test:ui
#Then, you can visit the Vitest UI at http://localhost:51204/__vitest__/.

# test coverage
pnpm test:coverage

# updating Snapshots
pnpx vitest -u

# test specific folder
pnpx vitest run src/lib/utils
(or)
./node_modules/.bin/vitest run src/lib/utils
```

### E2E Tests

```shell
pnpm test:e2e
```

## Building

To create a production version of your app:

```shell
pnpm build -r
# run build
node build
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

You can preview the production build with `pnpm preview`.

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
pnpm build:lib
cd package
pnpm publish
```
