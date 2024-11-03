<script lang="ts">
	import type { AvailableLanguageTag } from '$i18n/runtime';
	import { i18n } from '$lib/i18n';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
  import * as m from '$i18n/messages';

	function switchToLanguage(newLanguage: AvailableLanguageTag) {
		const canonicalPath = i18n.route($page.url.pathname);
		const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		goto(localisedPath);
	}
</script>

<h1>{m.hello_world({ name: 'SvelteKit User' })}</h1>
<div>
	<button onclick={() => switchToLanguage('en')}>en</button>
	<button onclick={() => switchToLanguage('es')}>es</button>
	<button onclick={() => switchToLanguage('de')}>de</button>
</div>
