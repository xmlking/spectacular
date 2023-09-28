export const padTo2Digits = (num: number): string => num.toString().padStart(2, '0');

export const formatDate = (date: Date): string =>
	[padTo2Digits(date.getDate()), padTo2Digits(date.getMonth() + 1), date.getFullYear()].join('/');

export const dayInMonthFromDate = (dateStr: string): number => {
	const dt = new Date(dateStr);
	return dt.getDate();
};

export const monthShortFromDate = (dateStr: string): string => {
	const dt = new Date(dateStr);
	return dt.toLocaleString('default', { month: 'short' });
};
