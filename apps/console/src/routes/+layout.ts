import { Logger } from '@spectacular/utils';
import type { Locales } from '$lib/i18n/i18n-types';
import { loadLocaleAsync } from '$lib/i18n/i18n-util.async';
import { i18nObject } from '$lib/i18n/i18n-util.js';
import type { LayoutLoad } from './$types';

const log = new Logger('client:layout');

export const load = (async ({ data: { vercelEnv, locale, user } }) => {
	// load dictionary into memory
	await loadLocaleAsync(locale);
	// if you need to output a localized string in a `load` function,
	// you always need to create a new `i18nObject` instance in each `load` function
	// to not run into shared server state issues
	const LL = i18nObject(locale);

	log.info(LL.log({ fileName: '+layout.ts' }));

	// pass locale to the "rendering context"
	return { vercelEnv, locale, user };
}) satisfies LayoutLoad<{ locale: Locales }>;
