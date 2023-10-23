import type { Handle, RequestEvent } from '@sveltejs/kit';
import { initAcceptLanguageHeaderDetector } from 'typesafe-i18n/detectors';
import { detectLocale, i18n } from '$lib/i18n/i18n-util';
import { Logger } from '$lib/utils';
import { loadAllLocales } from '$lib/i18n/i18n-util.sync';

export const log = new Logger('middleware:detect-locale');

loadAllLocales();
const L = i18n();

export const handleDetectLocale = (async ({ event, resolve }) => {
	const locale = getPreferredLocale(event);
	const LL = L[locale];

	// bind locale and translation functions to current request
	event.locals.locale = locale;
	event.locals.LL = LL;

	log.info({ locale });

	// replace html lang attribute with correct language
	return resolve(event, { transformPageChunk: ({ html }) => html.replace('%lang%', locale) });
}) satisfies Handle;

const getPreferredLocale = ({ request }: RequestEvent) => {
	// detect the preferred language the user has configured in his browser
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
	const acceptLanguageDetector = initAcceptLanguageHeaderDetector(request);

	return detectLocale(acceptLanguageDetector);
};
