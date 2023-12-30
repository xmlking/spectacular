import type { FormattersInitializer } from 'typesafe-i18n'
import type { Locales, Formatters } from './i18n-types.js'
import { date } from 'typesafe-i18n/formatters'

export const initFormatters: FormattersInitializer<Locales, Formatters> = (locale: Locales) => {

	const formatters: Formatters = {
		// add your formatter functions here
		simpleDate: date(locale, { day: '2-digit', month: 'short', year: 'numeric' }),
	}

	return formatters
}
