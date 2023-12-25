type TFormatterProps = {
	value: string | number | Date;
	locale?: string;
	options?: Intl.DateTimeFormatOptions;
};

type TDateTemplate = Record<string, Omit<TFormatterProps, 'value'>>;

/**
 * Date templates to be used with `dateFormat` function
 */
export const dateTemplates = {
	'YYYY-MM-DD': {
		locale: 'fr-CA',
		options: {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		}
	}
} satisfies TDateTemplate;

type TDateFormatterProps = {
	value: TFormatterProps['value'];
	options?: TFormatterProps['options'];
	preset?: keyof typeof dateTemplates;
};

/**
 * Formats a date using the Intl.DateTimeFormat API.
 * @param value - The date to format.
 * @param locale - The locale to use for formatting. Defaults to 'en-US'.
 * @param options - Additional options to pass to the Intl.DateTimeFormat constructor.
 * @returns The formatted date string.
 */
const formatter = ({ value, locale = 'en-US', options }: TFormatterProps) =>
	new Intl.DateTimeFormat(locale, options).format(new Date(value));

/**
 * Formats a date string based on a preset or custom template.
 * @param value - The date string to format.
 * @param preset - The preset template to use for formatting (optional).
 * @returns The formatted date string.
 */
export const dateFormat = ({ value, preset, options }: TDateFormatterProps) =>
	formatter({ value, ...(preset ? dateTemplates[preset] : options) });
