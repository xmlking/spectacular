# Internationalization

We are using [typesafe-i18n](https://github.com/ivanhofer/typesafe-i18n) a type-safe and lightweight internationalization library with SvelteKit projects

This example demonstrates a [typesafe-i18n](https://github.com/ivanhofer/typesafe-i18n) integration with SvelteKit: [typesafe-i18n-demo-sveltekit](https://github.com/ivanhofer/typesafe-i18n-demo-sveltekit/)

Optionally, we can use [sveltekit-localize-url](https://github.com/rinart73/sveltekit-localize-url/tree/main) to Localize URLs.

## Implemention

Configure typesafe-i18n for an existing Svelte project:

Please refer: [adapter-svelte](https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/adapter-svelte#sveltekit) docs

> Make sure you adopt `app.d.ts` for full TypeScript type inference.

```ts
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			locale: Locales;
			LL: TranslationFunctions;
		}
		// interface PageData {}
		// interface Platform {}
	}
}
```

## Usage

Add all localization strings to `lib/i18n/en/index.ts` , `lib/i18n/de/index.ts` ...

when you are running dev server with `turbo dev ...` , `typesafe-i18n` watch changes to above files and contiguously generate types.

In **Svelte** files use `LL` store.

```svelte
<script lang="ts">
  import LL from '$i18n/i18n-svelte';
</script>
<h2 class="text-2xl my2">{$LL.Tags()}</h2>
<form>
      <input
        bind:value={input}
        on:input={debounce}
        placeholder={$LL.FilterTags()}
      />
</form>
```

## Reference

- Alternative library [Paraglide.js](https://inlang.com/g/2fg8ng94/guide-nilsjacobsen-buildAGlobalSvelteApp)
