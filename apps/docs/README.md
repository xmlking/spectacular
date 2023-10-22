# Docs

A static portfolio site built with SvelteKit + Skeleton UI + MDsveX.

## 🎉 Try it now!

### Local

```shell
npx degit xmlking/spectacular my-app && cd my-app # create a new project in my-app
pnpm i # if u don't have pnpm installed, run: npm i -g pnpm
turbo dev --filter=docs # if u don't have turbo installed, run: pnpm add -g turbo
```

### Remote

[Spectacular on Vercel](https://spectacular-docs.vercel.app/)

## ✨ Features

- [x] The starter creates and caches responsive images using the `vite-imagetools` plugin.
- [x] Out of the box **Atom feed** (WebSub), **Sitemap** support with caching.
- [ ] Speed up content creation with [sveltin](https://docs.sveltin.io/) CLI.
- [ ] [Progressive Web App (PWA)](https://rodneylab.com/sveltekit-pwa/)
  - [x] Web app manifest
  - [ ] logos (for favicons) assets
  - [x] ServiceWorker
  - [ ] SEO - `Og:image` and HTML meta tags for social unfurls
- [ ] **Security**
  - [ ] [X-Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options), [X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options), [X-XSS-Protection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection)
  - [ ] [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP): [SvelteKit](https://kit.svelte.dev/docs/configuration#csp)
- [ ] Present `themes`, `light/dark` modes and `view animations` with [Skeleton UI](https://www.skeleton.dev/), [TailwindCSS](https://tailwindcss.com/)
- [ ] [GitHub Issues as CMS](https://github.com/sw-yx/swyxkit/issues/10) - with comments displayed via [utterances](https://utteranc.es/) (lazy loaded)
  - [ ] Blog content pulled from the `GitHub Issues API`
  - [ ] `Comment` and `Reaction` system from GitHub Issues, rendered with `Utterances`
- [ ] **Comment Components**: `Webmentions`, `Giscus`, `Utterances`... you can use more than one.
- [ ] **Content Options**
  - [ ] Layouts - Content authors can choose the layouts aviable.
  - [ ] Table of Content
  - [ ] [Twitter/YouTube Embeds](https://swyxkit.netlify.app/supporting-youtube-and-twitter-embeds) - made [fast](https://swyxkit.netlify.app/faster-youtube-embeds)
  - [ ] [Mermaid](https://github.com/mermaid-js/mermaid) - Generate diagrams from markdown-like text.
  - [ ] Blog index search with [fuzzy and highlights matches](https://swyxkit.netlify.app/ufuzzy-search)
  - [ ] Error page (404, rate-limit exceeded errors)
- [ ] Newsletter signup box - defaulted to [Buttondown.email](https://buttondown.email/) but easy to customize to whatever
- [ ] **Developer Experience**
  - [ ] ESLint + Prettier
  - [ ] Pre-rendering (SSG), [Incremental Static Regeneration (ISR)](https://www.educative.io/answers/ssr-vs-csr-vs-isr-vs-ssg)
  - [ ] Nightly lockfile upgrades
  - [ ] Storybook
  - [ ] Configuration vis `.env`

## 📦️ Tech Stack

### Vite Plugins

- [VitePWA](https://github.com/antfu/vite-plugin-pwa) - Zero-config PWA for Vite.
- [Purge Tailwind CSS](https://github.com/AdrianGonz97/vite-plugin-tailwind-purgecss) -Thoroughly purges excess TailwindCSS using [PurgeCSS](https://purgecss.com/)
- [vite-imagetools](https://github.com/JonasKruckenberg/imagetools/tree/main/packages/vite) Image tools to Resize Images, Output modern formats, Easy Srcset generation.

### TailwindCSS Plugins

- [SkeletonUI](https://www.skeleton.dev/) - The UI toolkit for Svelte and Tailwind.
- [Tailwind CSS Typography](https://github.com/tailwindlabs/tailwindcss-typography) - Beautiful typographic defaults for HTML you don't control.

### Markdown preprocessor & remark/rehype Plugins

- [MDsveX](https://mdsvex.pngwn.io/docs/) A markdown preprocessor for [Svelte](https://svelte.dev/) components.
- [Shiki Twoslash](https://github.com/shikijs/twoslash) - A beautiful Syntax Highlighter.
- [rehype-slug](https://github.com/rehypejs/rehype-slug) - rehype plugin to add ids to headings.
- [rehype-autolink-headings](https://github.com/rehypejs/rehype-autolink-headings) - rehype plugin to add links from headings back to themselves.
- [remark-emoji](https://github.com/rhysd/remark-emoji) - remark plugin to replace `:emoji:` to real UTF-8 emojis in text.
- [remark-reading-time](https://github.com/mattjennings/remark-reading-time#readme) - remark plugin to add estimated reading time
- [remark-github](https://github.com/remarkjs/remark-github#remark-github) - remark plugin to link references to commits, issues, and users, in the same way that GitHub does

## ⚡️ Usage

### Developing

Start a development server:

```shell
turbo dev --filter=docs
```

### Building

Create a production version of ur blog:

```shell
turbo build --filter=docs...
```

You can preview the built app with `turbo prevew --filter=docs`

## References

- [sveltekit-blog-mdx](https://github.com/rodneylab/sveltekit-blog-mdx) - SvelteKit MDX starter blog with MDsveX
- [Urara Starter](https://urara-docs.netlify.app/) - Sweet, Powerful, IndieWeb-Compatible SvelteKit Blog Starter.
  - [urara-demo](https://urara-demo.netlify.app), [kwaa-demo](https://kwaa.dev/)
- [Sveltin](https://sveltin.io/) - The Smartest Way to Create SvelteKit powered static websites
- [SwyxKit](https://github.com/swyxio/swyxkit) - A lightly opinionated starter for SvelteKit blogs Starter
- [jouwdan.com](https://jouwdan.com/), [source](https://github.com/jouwdan/jouwdan.com)
