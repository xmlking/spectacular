import { sourceLanguageTag, availableLanguageTags } from '$i18n/runtime';
import type { AvailableLanguageTag } from '$i18n/runtime';

/**
 * Takes in a path with or without a language tag and returns the path with the given language tag.
 * @returns
 */
export function translatePath(path: string, lang: AvailableLanguageTag) {
	path = getPathWithoutLang(path);

	// Don't prefix the default language
	if (lang === sourceLanguageTag) return path;
	//Otherwise, prefix with the language tag
	else return `/${lang}${path}`;
}

/**
 * Returns the path without the language tag
 */
function getPathWithoutLang(path: string) {
	const [_, maybeLang, ...rest] = path.split('/');
	if (availableLanguageTags.includes(maybeLang as AvailableLanguageTag)) return `/${rest.join('/')}`;
	else return path;
}

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
