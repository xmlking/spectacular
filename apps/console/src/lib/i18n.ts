import { createI18n } from '@inlang/paraglide-js-adapter-sveltekit';
import * as runtime from '$i18n/runtime.js';
import * as m from '$i18n/messages';

export const i18n = createI18n(runtime, {
	pathnames: {
		"/about": m.about_path,
	},
	exclude: ['/base/not-translated'],
	textDirection: {
		en: 'ltr',
		de: 'ltr'
	}
});
