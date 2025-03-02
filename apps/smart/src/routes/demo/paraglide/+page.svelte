<script lang="ts">
import { goto } from '$app/navigation';
import { page } from '$app/state';
import * as m from '$i18n/messages';
import type { Locale } from '$i18n/runtime';
import { setLocale, overwriteSetLocale } from '$i18n/runtime';
// import { resolveRoute } from '@inlang/paraglide-js/adapter-utils';

function switchToLanguage(newLanguage: Locale) {
  // const canonicalPath = i18n.route(page.url.pathname);
  // const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
  // goto(localisedPath);
  setLocale(newLanguage);
}
</script>

<h1>{m.hello_world({ name: 'SvelteKit User' })}</h1>
<div>
	<button onclick={() => switchToLanguage('en')}>en</button>
	<button onclick={() => switchToLanguage('es')}>es</button>
	<button onclick={() => switchToLanguage('de')}>de</button>
</div>
