<!--
    @component
    Adds alternate links to the head of the page for each available language.
    This is vital for SEO.
-->
<script lang="ts">
	import { page } from '$app/stores';
	import { sourceLanguageTag, availableLanguageTags } from '$i18n/runtime';
	import { translatePath } from '$lib/i18n';
</script>

<svelte:head>
	{#each availableLanguageTags as lang}
		<link rel="alternate" hreflang={lang} href={translatePath($page.url.pathname, lang)} />
	{/each}
	<link
		rel="alternate"
		hreflang="x-default"
		href={translatePath($page.url.pathname, sourceLanguageTag)}
	/>
</svelte:head>
