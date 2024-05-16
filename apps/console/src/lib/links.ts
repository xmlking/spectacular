// Navigation Sitemap
// `blockPreload: 'false'` means adding data-sveltekit-preload-data="false" to link.

export type List = Array<{ href: string; label: string; keywords: string; badge?: string, preload?: string }>;
export const menuNavLinks: Record<string, Array<{ title: string; list: List }>> = {
	'/policies': [
		{
			title: 'Policies',
			list: [
				{ href: '/dashboard/policies', label: 'Policies', keywords: 'svelte, sirens, license, release', preload: 'false' },
				{ href: '/dashboard/rules', label: 'Golden Rules', keywords: 'start, install, cli, tailwind, themes, stylesheets' },
				{ href: '/dashboard/agents', label: 'Agents', keywords: 'start, setup, tutorial, guide' }
			]
		},
		{
			title: 'Experiments',
			list: [
				{ href: '/dashboard/customers', label: 'Customers', keywords: 'customers, users' },
				{ href: '/dashboard/play', label: 'Play', keywords: 'play, users' },
				{ href: '/auth/signup', label: 'Signup', keywords: 'signup, users' },
				{ href: '/auth/signin', label: 'Signin', keywords: 'signin, login, users' }
			]
		}
	],
	'/flows': [
		{
			title: 'Visualization',
			list: [
				{ href: '/dashboard/network', label: 'Network', keywords: 'body, scroll, scrollbar, hr, horizontal, rule, divider' },
				{ href: '/dashboard/segments', label: 'Segments', keywords: 'body, scroll, scrollbar, hr, horizontal, rule, divider' }
			]
		},
		{
			title: 'Auth',
			list: [
				{ href: '/auth/signup', label: 'Signup', keywords: 'signup, users' },
				{ href: '/auth/signin', label: 'Signin', keywords: 'signin, login, users' }
			]
		}
	],
	'/reports': [
		{
			title: 'Reports',
			list: [
				{ href: '/dashboard', label: 'Stats', keywords: 'reports, graph' },
				{ href: '/dashboard/reports', label: 'Access Reports', keywords: 'copy, contenteditable, html, input' },
				{ href: '/dashboard/usage-reports', label: 'Usage Reports', keywords: 'usage' }
			]
		}
	],
	'/account': [
		{
			title: 'Settings',
			list: [
				{ href: '/dashboard/profile', label: 'Profile', keywords: 'account, settings, profile' },
				{ href: '/dashboard/feature-flags', label: 'Flags', keywords: 'account, settings, flags' }
			]
		},
		{
			title: 'Admin',
			list: [
				{ href: '/dashboard/organizations', label: 'Organizations', keywords: 'account, organization' },
				{ href: '/dashboard/delegation', label: 'Delegations', keywords: 'account, delegation' },
				{ href: '/dashboard/users', label: 'Users', keywords: 'account, user, admin' },
				{ href: '/dashboard/groups', label: 'Groups', keywords: 'account, group, admin' }
			]
		}
	]
};
