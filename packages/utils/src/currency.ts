type TFormatterProps = {
	value: number;
	locale?: string;
	options?: Intl.NumberFormatOptions;
};

type TCurrencyTemplate = Record<string, Omit<TFormatterProps, 'value'>>;

/**
 * Currency templates to be used with `currencyFormat` function
 */
export const currencyTemplates = {
	USD: {
		locale: 'en-US',
		options: {
			style: 'currency',
			currency: 'USD'
		}
	},
	EUR: {
		locale: 'fr-FR',
		options: {
			style: 'currency',
			currency: 'EUR'
		}
	},
	BRL: {
		locale: 'pt-BR',
		options: {
			style: 'currency',
			currency: 'BRL'
		}
	},
	JPY: {
		locale: 'ja-JP',
		options: {
			style: 'currency',
			currency: 'JPY'
		}
	}
} satisfies TCurrencyTemplate;

type TCurrencyFormatterProps = {
	value: TFormatterProps['value'];
	options?: TFormatterProps['options'];
	preset?: keyof typeof currencyTemplates;
};

/**
 * Formats a number as a currency string using the provided options.
 * @param value - The number to format.
 * @param locale - The locale to use for formatting. Defaults to 'en-US'.
 * @param options - The formatting options to use.
 * @returns The formatted currency string.
 */
const formatter = ({ value, locale = 'en-US', options }: TFormatterProps) =>
	new Intl.NumberFormat(locale, options).format(value);

/**
 * Formats a currency value according to a preset or custom template.
 * @param props - The value and preset or custom template to use for formatting.
 * @returns The formatted currency value.
 */
export const currencyFormat = ({ value, preset, options }: TCurrencyFormatterProps) =>
	formatter({ value, ...(preset ? currencyTemplates[preset] : options) });
