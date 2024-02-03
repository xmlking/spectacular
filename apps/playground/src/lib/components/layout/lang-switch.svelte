<!--
	@component
	Switch for locales. Use in conjunction with AvailableLanguageTagTabs
-->
<script lang="ts">
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { availableLanguageTags, languageTag } from '$i18n/runtime';
	import { i18n } from '$lib/i18n';

	let locl: string = languageTag();
</script>

<!-- TODO: make it pretty-->
<RadioGroup>
	{#each availableLanguageTags as l}
		<RadioItem
			bind:group={locl}
			name="justify"
			value={l}
			on:click={() => goto(i18n.resolveRoute(i18n.route($page.url.pathname), l))}
			>{l}</RadioItem
		>
	{/each}
</RadioGroup>
