import type { Sveltin } from '$sveltin';

const menu: Array<Sveltin.MenuItem> = [
	{
		identifier: 'home',
		name: 'Home',
		url: '/',
		weight: 1
	},
	{
		identifier: 'contact',
		name: 'Contact',
		url: '/contact',
		weight: 2
	},
	{
		identifier: 'about',
		name: 'About',
		url: '/about',
		weight: 3
	}
];

export { menu };
