<script lang="ts">
import { page } from '$app/stores';

export let title = 'spectacular';
export let description = 'SvelteKit starter template';

const getImg = () => {
  const [part0, part1, part2] = $page.url.pathname.split('/');
  if (part1 && part2) {
    return `${$page.url.origin}/api/og/kit-${part1}-${part2}.png`;
  } else if (part1) {
    return `${$page.url.origin}/api/og/kit-${part1}.png`;
  }
  return `${$page.url.origin}/api/og/kit.png`;
};
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={$page.url.href} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={getImg()} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content={$page.url.origin} />

  <!-- Open Graph : Twitter-->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={getImg()} />
  <meta property="twitter:domain" content={$page.url.origin} />
  <meta property="twitter:url" content={$page.url.href} />
</svelte:head>
