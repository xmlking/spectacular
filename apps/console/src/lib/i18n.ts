import { createI18n } from '@inlang/paraglide-js-adapter-sveltekit';
import * as runtime from '$i18n/runtime.js';

export const i18n = createI18n(runtime, {
	pathnames: {
		'/about': {
			en: '/about',
			de: '/uber-uns'
		}
	},
	exclude: ['/base/not-translated'],
	textDirection: {
		en: 'ltr',
		de: 'ltr'
	},
	seo: {
		noAlternateLinks: false
	}
});
