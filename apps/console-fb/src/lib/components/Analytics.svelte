<!--
USAGEL: in your +layout.svelte:
Ref: https://joyofcode.xyz/sveltekit-google-analytics

<script lang="ts">
	import { dev } from '$app/environment';
	import { PUBLIC_GOOGLE_ANALYTICS_TARGET_ID } from '$env/static/public';
	import { Analytics } from '$lib/components';
</script>

{#if !dev && PUBLIC_GOOGLE_ANALYTICS_TARGET_ID}
	<Analytics gid={PUBLIC_GOOGLE_ANALYTICS_TARGET_ID} />
{/if}

<slot />
-->
<script lang="ts">
	import { page } from '$app/stores';

	export let gid: string;

	const src = `https://www.googletagmanager.com/gtag/js?id=${gid}`;

	$: {
		if (typeof gtag !== 'undefined') {
			// eslint-disable-next-line no-undef
			gtag('config', gid, {
				page_title: document.title,
				// FIXME: Error: Cannot subscribe to 'page' store on the server outside of a Svelte component, as it is bound to the current request via component context.
				page_path: $page.url.pathname
			});
		}
	}
</script>

<svelte:head>
	<script async {src}></script>
	<script data-gid={gid}>
		window.dataLayer = window.dataLayer || [];

		function gtag() {
			dataLayer.push(arguments);
		}

		gtag('js', new Date());
		gtag('config', document.currentScript.getAttribute('data-gid'), { send_page_view: false });
	</script>
</svelte:head>
