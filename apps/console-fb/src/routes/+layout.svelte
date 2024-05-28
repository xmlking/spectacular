<script lang="ts">
// import { dev } from '$app/environment';
// import { Analytics } from '$lib/components';
// import envPub from '$lib/variables/variables';
import '../app.pcss';
import { pwaAssetsHead } from 'virtual:pwa-assets/head';
import { pwaInfo } from 'virtual:pwa-info';
import { dev } from '$app/environment';
import { Toasts } from '$lib/components/toast';
import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
import { onMount } from 'svelte';
import { setupViewTransition } from 'sveltekit-view-transition';

// Init Vercel Analytics
inject({ mode: dev ? 'development' : 'production' });
injectSpeedInsights();

setupViewTransition();

onMount(async () => {
  if (pwaInfo) {
    const { registerSW } = await import('virtual:pwa-register');
    registerSW({
      immediate: true,
      onRegistered(r) {
        // uncomment following code if you want check for updates
        // r && setInterval(() => {
        //    console.log('Checking for sw update')
        //    r.update()
        // }, 20000 /* 20s for testing purposes */)
        console.log(`SW Registered: ${r}`);
      },
      onRegisterError(error) {
        console.log('SW registration error', error);
      },
    });
  }
});

$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : '';
</script>

<svelte:head>
  {#if pwaAssetsHead.themeColor}
    <meta name="theme-color" content={pwaAssetsHead.themeColor.content} />
  {/if}
  {#each pwaAssetsHead.links as link}
    <link {...link} />
  {/each}
  <!-- eslint-disable svelte/no-at-html-tags  -->
  {@html webManifest}
</svelte:head>

<Toasts placement="bottom-right" />

<slot />

{#await import('$lib/components/ReloadPrompt.svelte') then { default: ReloadPrompt }}
  <ReloadPrompt />
{/await}

<style lang="postcss">
/*** view-transition animations for ROOT ***/

/* Disable default crossfade. */
/* :root {
		view-transition-name: none;
	} */

/* Or, just modify the duration. */
/* :global(::view-transition-old(root)),
	:global(::view-transition-new(root)) {
		animation-duration: 500ms;
	} */

/* Or, slide from right */
:global(:root::view-transition-old(root)) {
  animation: 500ms ease-out both fade-out;
}
:global(:root::view-transition-new(root)) {
  animation: 500ms ease-out both slide-from-left;
}
</style>
