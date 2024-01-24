import type { Handle } from '@sveltejs/kit';
import { Logger } from '@spectacular/utils';
import { sourceLanguageTag, setLanguageTag } from '$i18n/runtime';
import type { AvailableLanguageTag } from '$i18n/runtime';
import { i18n } from '$lib/i18n';

/*
We set the `lang` and `dir` attributes on the `<html>` element using a hook.
the `app.html` file contains placeholders for these attributes, which we just find and replace.
*/
export const log = new Logger('server:middleware:detect-lang');

export const lang0 = (async ({ event, resolve }) => {
	const lang: AvailableLanguageTag = (event.params.lang as AvailableLanguageTag) ?? sourceLanguageTag;
	const textDirection = getTextDirection(lang);

	event.locals.lang = i18n.getLanguageFromUrl(event.url);

	setLanguageTag(() => event.locals.lang);

	log.debug({ lang, textDirection });

	const result = resolve(event, {
		transformPageChunk({ done, html }) {
			//Only do it at the very end of the rendering process
			if (done) {
				return html.replace('%lang%', lang).replace('%textDir%', textDirection);
			}
		}
	});
	return result;
}) satisfies Handle;

/**
 * Look up the text direction for a given locale.
 * You could use a Polyfill for `Intl.Locale.prototype.getTextInfo` instead.
 */
export function getTextDirection(locale: AvailableLanguageTag) {
	const directions: Record<AvailableLanguageTag, 'ltr' | 'rtl'> = {
		en: 'ltr',
		de: 'ltr'
	};

	return directions[locale];
}
