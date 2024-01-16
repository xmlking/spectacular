export type Project = {
	id: string;
	name: string;
	image?: string;
	description: string;
	by?: string;
	href?: string;
};

/**
 * Side Nav Links
 */
export type Link = {
	href: string;
	label: string;
	keywords: string;
	badge?: string;
};

type List = Array<{ href: string; label: string; keywords: string; badge?: string }>;
export type NavLinks = Record<string, Array<{ title: string; list: List }>>;

/**
 * Toast flash message
 * Use with `sveltekit-flash-message` and skeleton `Toast`
 */
