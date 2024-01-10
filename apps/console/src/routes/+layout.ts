import { browser } from '$app/environment';
import { setLanguageTag } from '$i18n/runtime';
import { getEventLang } from '$lib/i18n/event';

export const load = async (event) => {
	const lang = getEventLang(event);
	if (browser) {
		setLanguageTag(lang);
	}
	return {
		lang,
		user: event.data.user
	};
};
