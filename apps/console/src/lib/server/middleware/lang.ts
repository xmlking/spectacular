import type { Handle } from '@sveltejs/kit';
import { Logger } from '@spectacular/utils';
import { getTextDirection } from '$lib/i18n';
import { sourceLanguageTag, setLanguageTag } from '$i18n/runtime';
import type { AvailableLanguageTag } from '$i18n/runtime';
import { getEventLang } from '$lib/i18n/event';

/*
We set the `lang` and `dir` attributes on the `<html>` element using a hook.
the `app.html` file contains placeholders for these attributes, which we just find and replace.
*/
export const log = new Logger('server:middleware:detect-lang');

export const lang = (async ({ event, resolve }) => {
	const lang: AvailableLanguageTag = (event.params.lang as AvailableLanguageTag) ?? sourceLanguageTag;
	const textDirection = getTextDirection(lang);

	event.locals.lang = getEventLang(event);
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
