import type { AvailableLanguageTag } from '$i18n/runtime';

export const LANG_DETAILS = {
	en: {
		name: 'English',
		label: 'En'
	},
	de: {
		name: 'German',
		label: 'De'
	}
} satisfies { [L in AvailableLanguageTag]: { name: string; label: string } };

export const LANG_PARAM = 'lang';
