# Vercel

![Vercel Monorepo](./images/monorepo.avif 'Title')

<p style="text-align: center;">The architecture of a monorepo deployed to Vercel</p>

## Setup

Follow [SvelteKit on Vercel](https://vercel.com/docs/frameworks/sveltekit)

1. Install SvelteKit's Vercel adapter plugin
2. Add the Vercel adapter to your Svelte config
3. Configure your SvelteKit deployment
4. Configuration options
5. Server-Side Rendering
6. Use Vercel environment variables with SvelteKit
   1. `VERCEL_COMMIT_REF`
7. [Incremental Static Regeneration (ISR)](https://vercel.com/docs/incremental-static-regeneration)
8. Web Analytics
9. Speed Insights
10. Draft Mode
11. Rewrites
    1. We do not recommend using vercel.json rewrites with SvelteKit.
12. Edge Middleware
    1. We recommend using SvelteKit's server hooks to modify responses.

## Build

**Incremental Static Regeneration (ISR)** is a modern web development strategy that allows developers to create and update static pages on-demand, after the initial build.

![Vercel Build Times](./images/vercel-build-times.avif 'Title')

![Vercel Request Times](./images/vercel-request-times.avif 'Title')

<p style="text-align: center;">The result of ISR, for the end-user, feels as fast as static-site generation, served on Vercel's Edge Network.</p>

## Deploy

If your team uses a `trunk-based` development workflow and you want to deploy using `tags` and `releases`,
this guide will walk you through the steps to automate deployments via tags instead of branches.

[Can you deploy based on tags/releases on Vercel?](https://vercel.com/guides/can-you-deploy-based-on-tags-releases-on-vercel)

## Environment Variables
Vercel provides a set of [System Environment Variables](https://vercel.com/docs/projects/environment-variables/system-environment-variables) that are automatically populated by the System, such as the URL of the Deployment or the name of the Git branch deployed. e.g.,: 
- VERCEL = 1
- VERCEL_ENV = `production`, `preview`, or `development`
- VERCEL_GIT_COMMIT_REF = `feature_branch`
> You can use then to detect build is targeted for **Vercel** deployment and use appropriate **SvelteKit Adaptors**

## Reference

- [SvelteKit on Vercel](https://vercel.com/docs/frameworks/sveltekit)
- [How can I use GitHub Actions with Vercel?](https://vercel.com/guides/how-can-i-use-github-actions-with-vercel)
- [Monorepos are changing how teams build software](https://vercel.com/blog/monorepos)
- Quick Tip: [Deploy only modified Vercel projects in a Turborepo monorepo](https://www.joostschuur.com/blog/quick-tip-deploy-only-modified-vercel-projects-in-a-turborepo-monorepo)
- [Intelligent ignored builds using Turborepo](https://vercel.com/changelog/intelligent-ignored-builds-using-turborepo)
- [New features for SvelteKit: Optimize your application with ease](https://vercel.com/blog/feature-complete-sveltekit)
