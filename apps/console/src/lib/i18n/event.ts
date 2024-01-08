import type { LoadEvent, Redirect, RequestEvent } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { sourceLanguageTag } from '$i18n/runtime';
import { LANG_PARAM } from './constants';
import { localize } from './link';
import { isAvailableLang } from './validation';

export function createEventRedirect(event: RequestEvent) {
	/**
	 * Pre-localized redirect helper.
	 *
	 * @see {@link redirect}
	 */
	return (status: Redirect['status'], location: URL | string, message?: App.PageData['flash']) => {
		if (!message) {
			return redirect(status, localize(location, event.locals.lang));
		}
		return redirect(status, localize(location, event.locals.lang), message, event);
	};
}

export function createEventLocalize(event: RequestEvent) {
	/**
	 * Event-locale-aware location localizer. (also known by some as Loccolocaloca)
	 *
	 * @see {@link localize}
	 */
	return (location: Parameters<typeof localize>[0]) => {
		return localize(location, event.locals.lang);
	};
}

export function getEventLang<E extends RequestEvent | LoadEvent>(event: E) {
	const param = event.params[LANG_PARAM];
	if (param && isAvailableLang(param)) {
		return param;
	}
	return sourceLanguageTag;
}
