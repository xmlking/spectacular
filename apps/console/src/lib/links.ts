// Navigation Sitemap
// `blockPreload: 'false'` means adding data-sveltekit-preload-data="false" to link.

enum Role {
	Me = 'me',
	Anonymous = 'anonymous',
	User = 'user',
	Supervisor = 'supervisor',
	Manager = 'manager'
}

export type List = Array<{ href: string; label: string; keywords: string; badge?: string; preload?: string; roles?: Role[] }>;
export type MenuNavLinks = Record<string, Array<{ title: string; list: List }>>;
export const menuNavLinks: MenuNavLinks = {
	'/policies': [
		{
			title: '',
			list: [{ href: '/dashboard', label: 'Dashboard', keywords: 'reports, graph' }]
		},
		{
			title: 'Policies',
			list: [
				{ href: '/policies', label: 'Policies', keywords: 'svelte, sirens, license, release', preload: 'false' },
				{ href: '/rules', label: 'Golden Rules', keywords: 'start, install, cli, tailwind, themes, stylesheets' }
			]
		},
		{
			title: 'Devices',
			list: [
				{ href: '/devices', label: 'Devices', keywords: 'start, setup, tutorial, guide' },
				{ href: '/pools', label: 'Pools', keywords: 'start, setup, tutorial, guide' }
			]
		},
		{
			title: 'Experiments',
			list: [
				{ href: '/customers', label: 'Customers', keywords: 'customers, users' },
				{ href: '/play', label: 'Play', keywords: 'play, users' }
			]
		}
	],
	'/flows': [
		{
			title: 'Visualization',
			list: [
				{ href: '/network', label: 'Network', keywords: 'body, scroll, scrollbar, hr, horizontal, rule, divider' },
				{ href: '/segments', label: 'Segments', keywords: 'body, scroll, scrollbar, hr, horizontal, rule, divider' }
			]
		}
	],
	'/reports': [
		{
			title: 'Reports',
			list: [
				{ href: '/reports', label: 'Access Reports', keywords: 'copy, contenteditable, html, input' },
				{ href: '/usage-reports', label: 'Usage Reports', keywords: 'usage' }
			]
		}
	],
	'/account': [
		{
			title: 'Settings',
			list: [
				{ href: '/profile', label: 'Profile', keywords: 'account, settings, profile' },
				{ href: '/feature-flags', label: 'Flags', keywords: 'account, settings, flags' }
			]
		},
		{
			title: 'Auth',
			list: [
				{ href: '/signup', label: 'Signup', keywords: 'signup, users' },
				{ href: '/signin', label: 'Signin', keywords: 'signin, login, users' }
			]
		},
		{
			title: 'Administration',
			list: [
				{ href: '/organizations', label: 'Organizations', keywords: 'account, organization', roles: [Role.Manager] },
				{ href: '/delegation', label: 'Delegations', keywords: 'account, delegation', roles: [Role.Manager] },
				{ href: '/users', label: 'Users', keywords: 'account, user, admin', roles: [Role.Manager] },
				{ href: '/groups', label: 'Groups', keywords: 'account, group, admin', roles: [Role.Manager] }
			]
		}
	]
};

// Build Inverted Index for fast lookup
type InvertedIndex = Record<string, string>;

const buildInvertedIndex = (menu: MenuNavLinks): InvertedIndex => {
	const invertedIndex: InvertedIndex = {};

	for (const topLevelKey in menu) {
		if (menu.hasOwnProperty(topLevelKey)) {
			const sections = menu[topLevelKey];
			sections.forEach((section) => {
				section.list.forEach((item) => {
					invertedIndex[item.href.split('/')[1]] = topLevelKey;
				});
			});
		}
	}
	return invertedIndex;
};
export const hrefToCategoryIndex = buildInvertedIndex(menuNavLinks);
