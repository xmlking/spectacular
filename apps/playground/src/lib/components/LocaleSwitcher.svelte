<script lang="ts">
	import { RadioGroup , RadioItem} from '@skeletonlabs/skeleton';
	import { browser } from '$app/environment'
	import { invalidateAll } from '$app/navigation'
	import { page } from '$app/stores'
	import { setLocale, locale } from '$lib/i18n/i18n-svelte'
	import type { Locales } from '$lib/i18n/i18n-types'
	import { locales } from '$lib/i18n/i18n-util'
	import { loadLocaleAsync } from '$lib/i18n/i18n-util.async'

	let locl: string = $locale;

const switchLocale = async (newLocale: Locales) => {
		if (!newLocale || $locale === newLocale) return

		// load new dictionary from server
		await loadLocaleAsync(newLocale)

		// select locale
		setLocale(newLocale)


		// run the `load` function again
		invalidateAll()
	}

	// update `lang` attribute
	$: browser && document.querySelector('html')!.setAttribute('lang', $locale)


	// update locale when page store changes
	$: if (browser) {
		const lang = $page.params.lang as Locales
		switchLocale(lang)
	}
</script>

<!-- TODO: make it pretty-->
<RadioGroup>
	{#each locales as l}
		<RadioItem bind:group={locl} name="justify" value={l} on:click={() => switchLocale(l)}>{l}</RadioItem>
	{/each}
</RadioGroup>
