// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

type Locales = import('$lib/i18n/i18n-types').Locales;
type TranslationFunctions = import('$lib/i18n/i18n-types').TranslationFun;
type NhostClient = import('@nhost/nhost-js').NhostClient;

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			locale: Locales;
			LL: TranslationFunctions;
			nhost: NhostClient;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// App version from package.json
	declare const __APP_VERSION__: string;
	// Git commit tag or hash
	declare const __GIT_TAG__: string;
	// Date of last commit
	declare const __GIT_DATE__: string;
}

export {};
