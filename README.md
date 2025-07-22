# Spectacular

**Spectacular** is a full-stack [Turborepo](https://turbo.build/repo/docs/handbook) template project with _SvelteKit_ meta-framework all working in harmony and sharing packages.

## Tech Stack

- Monorepo: [Turborepo](https://turbo.build/repo/docs/handbook)
- JS Framework: [SvelteKit](https://kit.svelte.dev/)
- CSS: [Tailwind CSS](https://tailwindcss.com/)
- UI Components: tailwindcss based [SkeletonUI](https://www.skeleton.dev/), [Shadcn](https://www.shadcn-svelte.com/) and [Flowbite](https://flowbite-svelte.com/)
- Unit/Component testing: [vitest](https://vitest.dev/)
  - [Sveltest](https://sveltest.dev/) , [Repo](https://github.com/spences10/sveltest), [Migrating](https://scottspence.com/posts/migrating-from-testing-library-svelte-to-vitest-browser-svelte)
  - [Testing Library](https://testing-library.com/)
  - [Svelte Testing Library](https://github.com/testing-library/svelte-testing-library)
- API Mocking: [Mock Service Worker](https://mswjs.io/)
- Code Coverage [c8](https://c8.io/)
- End-to-End Testing: [playwright](https://playwright.dev/)
- GraphQL: [Houdini](https://www.houdinigraphql.com/) & [Hasura](https://hasura.io/)
- Authentication: [Auth.js](https://authjs.dev/),  [nhost-auth](https://nhost.io/product/auth)
- PWA: [Vite PWA](https://vite-pwa-org.netlify.app/frameworks/sveltekit.html)
- Linter/Formatter: [Biome](https://biomejs.dev/) and [Ultracite](https://github.com/haydenbleasel/ultracite) linting configuration.

## Features

- [x] Responsive Design: [Container queries](https://www.smashingmagazine.com/2021/05/complete-guide-css-container-queries/)
- [ ] **Progressive Web Apps (PWAs):**
  - [x] Smart caching with Service Works
  - [ ] Re-engage customers with Push Notifications
  - [x] Push Application Updates
  - [ ] Offline app with [pglite](https://github.com/electric-sql/pglite)
- [ ] Fonts and Image Optimization: edge caching, Lazy-loading images
- [x] **SEO Ready**
  - [x] **Meta Tags** and **Json-LD** with [svelte-meta-tags](https://github.com/oekazuma/svelte-meta-tags#readme)
  - [ ] Dynamic **OpenGraph** images with [sveltekit-og](https://github.com/etherCorps/sveltekit-og#create-svelte)
  - [x] Image Optimization with [sveltejs/enhanced-img](https://kit.svelte.dev/docs/images)
- [x] **GraphQL:** [Houdini](https://www.houdinigraphql.com/) the disappearing GraphQL client for SvelteKit. and [nHost](https://nhost.io/) as BaaS
  - [ ] [Elevated Permissions](https://nhost.io/blog/elevated-permissions)
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
- [x] **Internationalization(i18n)** with [inlang](https://inlang.com/c/libraries) `Paraglide JS Adapter SvelteKit`
- [ ] **User Notifications**: - multi-tenant, communication preferences. [Design](https://www.linkedin.com/pulse/design-notification-system-omar-ismail/)

## Experementing

- [ ] Implement Changesets [(link)](https://github.com/changesets/changesets) with [turborepo](https://turbo.build/repo/docs/handbook/publishing-packages/versioning-and-publishing)
- [ ] **TAURI:** Use [Tauri](https://tauri.app/) with [Skeleton](https://www.skeleton.dev/docs/tauri) for multi-platform.
- [x] Charts with [Unovis](https://unovis.dev/). Explore [Gallery](https://unovis.dev/gallery)
- [x] [Feature Flags](https://flags-sdk.dev/) with [Vercel Feature Flags](https://vercel.com/docs/workflow-collaboration/feature-flags) and [Vercel Toolbar](https://vercel.com/docs/workflow-collaboration/vercel-toolbar)

## Setup

```shell
cd ~/Developer/Work/SPA
git clone https://github.com/xmlking/spectacular.git
cd spectacular && bun install
# (optional) playwright is required for end-to-end testing
bun x playwright install
# (optional) add git-commit-hooks
cog install-hook --all
```

### Environment Variables

By default, the `dev` server (dev command) runs in `development` mode and the `build` command run in `production`
mode.  
This means when running `turbo build`, it will load the env variables from `.env.production` if there is one:  
Use `.env.local` to override environment variables in `.env` (secrets like API keys) for local development.

## Developing

Once you've cloned the project and installed dependencies with `bun i`, start a development server:

### Start local Hasura

```sh
# stat all services in background and show logs
make up # for first time use `make boot` then `make up`
# this will start all services with default profile + services with `all` profile.
make up PROFILES=all
# verify status/health of services
make ps
# shotdown all services
make down
# DANGER: run this if you want to reset database and other persistent volumes
make teardown
# verify if docker `compose` getting correctly resolved application config from .env and .secrests files
make check
make check PROFILES=all,optional
# ssch to a container to debug
#make exec-<target>
make exec-hasura
make exec-auth
```

### Start apps/console

```shell
turbo run console#dev

# or use `--log-order=stream` to disable TUI
turbo --filter=console --log-order=stream dev

# or start the server and open the app in a new browser tab
turbo run console#dev  -- --open 

# run in debug mode
turbo run console#dev:debug

# run with a custom inline config
# inline environment variables has higher precedence than ones loaded from .env and .env.local files
PUBLIC_NHOST_GRAPHQL_URL=api.mycompany.com:443 turbo dev
```

## Maintenance

### Update

To update the packages to their latest versions in `package.json`

```shell
bun update --latest
bun update --check
```

### Format

```shell
# format all packages
turbo run format
# format root
turbo run format:root
```

### Lint

```shell
# lint all packages
turbo run lint
# lint root
turbo run lint:root
```

## Testing

### Unit/Component Tests

```shell
turbo test

turbo test:ui
#Then, you can visit the Vitest UI at http://localhost:51204/__vitest__/.

# test coverage
turbo test:coverage

# updating Snapshots
bunx vitest -u

# test specific folder
bunx vitest apps/web/src/lib/utils
(or)
bun node_modules/.bin/vitest run apps/web/src/lib/utils
```

### E2E Tests

```shell
turbo test:e2e
```

## Building

To create a production version of your app:

```shell
turbo build
# run build
turbo run console#dev:build
turbo --filter=console... build
turbo --filter=console... --dry build
turbo --filter=console... --graph build
```

Run from the local build directory:

```shell
NODE_ENV=production \
PUBLIC_NHOST_GRAPHQL_URL=api.mycompany.com:443 \
node build

# (optional) pass ORIGIN when using `adapter-node` build
HOST=127.0.0.1 \
PORT=4000 \
ORIGIN=https://my.site \
node build
```

You can preview the production build with `turbo run console#preview`.

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
turbo build --filter=lib...
cd package
bun publish
```
