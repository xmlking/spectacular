<script context="module" lang="ts">
export type OpenGraphType = 'website' | 'article';
export type TwitterCardType = 'Formasummaryt' | 'summary_large_image';
</script>

<script lang="ts">
  export let type: OpenGraphType = 'article';
  export let title = 'Spectacular Template (web)';
  export let siteName = 'Spectacular Template (web)';
  export let description = 'SvelteKit (w/ Houdini) x Tailwind CSS x Nhost x Turborepo (bun)';
  export let card: TwitterCardType = 'summary_large_image';
  export let image = 'https://repository-images.githubusercontent.com/675379612/2b8bb511-5e3f-41bc-a3d3-0bf8e51a2c31';
  export let canonical: string;
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:type" content={type} />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content={image} />
  <meta property="og:site_name" content={siteName} />
  <meta property="og:description" content={description} />
  <meta name="twitter:card" content={card} />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
  <link rel="canonical" href={canonical} />
</svelte:head>
