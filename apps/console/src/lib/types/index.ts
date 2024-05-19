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

export enum Roles {
	Me = 'me',
	Anonymous = 'anonymous',
	User = 'user',
	Supervisor = 'supervisor',
	Manager = 'manager'
}

export type Link = {
	href: string;
	label: string;
	keywords: string;
	badge?: string;
	preload?: string;
	roles?: Roles[];
};

export type List = Array<Link>;
export type MenuNavLinks = Record<string, Array<{ title: string; list: List }>>;

/**
 * Toast flash message
 * Use with `sveltekit-flash-message` and skeleton `Toast`
 */
