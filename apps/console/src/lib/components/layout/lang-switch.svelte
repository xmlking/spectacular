<!--
	@component
	Switch for locales. Use in conjunction with AvailableLanguageTagTabs
-->
<script lang="ts">
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { availableLanguageTags, sourceLanguageTag } from '$i18n/runtime';
	import { translatePath } from '$lib/i18n/i18n';

	let locl: string = sourceLanguageTag;
</script>

<!-- TODO: make it pretty-->
<RadioGroup>
	{#each availableLanguageTags as l}
		<RadioItem
			bind:group={locl}
			name="justify"
			value={l}
			on:click={() => goto(translatePath($page.url.pathname, l))}>{l}</RadioItem
		>
	{/each}
</RadioGroup>
