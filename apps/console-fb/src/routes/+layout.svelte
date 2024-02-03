<script lang="ts">
	// import { dev } from '$app/environment';
	// import { Analytics } from '$lib/components';
	// import envPub from '$lib/variables/variables';
	import '../app.pcss';
	import { setupViewTransition } from 'sveltekit-view-transition';
	import { onMount } from 'svelte';
	import { pwaInfo } from 'virtual:pwa-info';
	import { inject } from '@vercel/analytics';
	import { Toasts } from '$lib/components/toast';
	import { dev } from '$app/environment';

	// Init Vercel Analytics
	inject({ mode: dev ? 'development' : 'production' });

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
				}
			});
		}
	});

	$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : '';
</script>

<svelte:head>
	<!-- eslint-disable svelte/no-at-html-tags  -->
	{@html webManifest}
</svelte:head>

<!-- {#if !dev && envPub.PUBLIC_GOOGLE_ANALYTICS_TARGET_ID}
	<Analytics gid={envPub.PUBLIC_GOOGLE_ANALYTICS_TARGET_ID} />
{/if} -->

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
