<script lang="ts">
	import { browser } from '$app/environment'
	import { invalidateAll } from '$app/navigation'
	import { page } from '$app/stores'
	import { setLocale, locale } from '$lib/i18n/i18n-svelte'
	import type { Locales } from '$lib/i18n/i18n-types'
	import { locales } from '$lib/i18n/i18n-util'
	import { loadLocaleAsync } from '$lib/i18n/i18n-util.async'

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
<ul>
	{#each locales as l}
		<li>
			<button class:active={l === $locale} on:click={() => switchLocale(l)}> {l} </button>
		</li>
	{/each}
</ul>

