import type { HTMLAnchorAttributes } from 'svelte/elements';
import type { Page } from '@sveltejs/kit';
import { derived } from 'svelte/store';
import { resolveRoute } from '$app/paths';
import { sourceLanguageTag } from '$i18n/runtime';
import type {AvailableLanguageTag} from '$i18n/runtime';
import { page } from '$app/stores';
import { LANG_PARAM } from './constants';

/**
 * Extract the localizable part of a given in-app url, i.e. the url parts after the origin.
 */
function getTail(url: URL) {
	const str = url.toString();
	return str.split(url.origin)[1];
}

/**
 * Create a localizer for un-localized in-app hrefs.
 */
export function localize<T extends string | URL>(location: T, lang: AvailableLanguageTag) {
	const str = typeof location === 'string' ? location : getTail(location);
	// This is where the locale segment persistence is determined.
	// As it is, the locale param is prepended whenever the href points to a non-default-locale.
	// This could be fine-tuned to, for example, account for user's preferences in localstorage / cookies / page.data.
	return resolveRoute(`/[[${LANG_PARAM}]]${str}`, {
		['lang']: lang === sourceLanguageTag ? '' : lang,
	});
}

/**
 * Remove the locale segment form the current route url.
 */
export const delangCurrentLocation = derived(page, ($page) => {
	let tail = $page.url.href.replace($page.url.origin, '');
	const p = $page.params[LANG_PARAM];
	if (p) {
		tail = tail.replace(`/${p}`, '');
	}
	return tail;
});

/**
 * Derived store to compose locale-specific url strings.
 */
export const langHref = derived(page, ($page) => {
	return <H extends string>(href: H, lang: AvailableLanguageTag = $page.data.lang) => {
		return localize(href, lang);
	};
});

/**
 * Extracted link deriving logic for use in custom builders (e.g.: loadableLink).
 */
export function deriveLink($page: Page) {
	return <H extends string>(
		/**
		 * Unlocalized href, i.e. path without root [locale] segment.
		 */
		href: H,
		/**
		 * Customizable locale, if should differ from current client's locale. Setting to false will
		 * prevent any automatic localization.
		 */
		lang: AvailableLanguageTag | false = $page.data.lang
	) => {
		const _href = lang ? localize(href, lang) : href;
		const [path, hash] = _href.split('#');
		const currentPage = $page.url.pathname === path || undefined;
		const currentHash = currentPage && '#' + hash === $page.url.hash;
		return {
			'href': _href,
			'hreflang': lang || undefined,
			'data-current': currentHash ? 'step' : currentPage ? 'page' : undefined,
			'aria-current': currentHash ? 'step' : currentPage ? 'page' : undefined,
			// Add more attributes if relevant.
		} satisfies Partial<HTMLAnchorAttributes>;
	};
}

/**
 * Internationalized link attributes builder. Also tracks if the href corresponds to the client's
 * current page.
 *
 * @example <a {...$link('/about')}>About</a>
 *
 * Becomes <a href="..." hreflang="..." data-current="..." .../>
 */
export const link = derived(page, deriveLink);

/**
 * Derived store to compose href string that switches locale while staying on the current page.
 */
export const langSwitch = derived([delangCurrentLocation, link], ([$delocalizedCurrent, $link]) => {
	return (lang: AvailableLanguageTag) => $link($delocalizedCurrent, lang);
});
