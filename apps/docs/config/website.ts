import { OpenGraphType, TwitterCardType } from '$lib/types';
import type { SEOWebSite, SEOWebPage, SEOMenuItem } from '$lib/types';

const website: SEOWebSite = {
	name: 'Spectacular',
	baseURL: 'https://spectacular-docs.vercel.app',
	language: 'en-GB',
	title: 'Spectacular',
	description: 'Example.com is your perfect fit.',
	favicon: 'favicon.png',
	logo: 'logo.png',
	copyright: '2023'.concat(' - ', 'Spectacular'),
	keywords: ['sveltekit, components, tests, docs'],
	contactEmail: '',
	socials: {
		linkedin: '',
		twitter: '',
		github: 'https://github.com/xmlking/spectacular',
		facebook: '',
		instagram: '',
		youtube: '',
		mastodon: ''
	},
	creator: {
		name: 'Sumanth Chinthagunta',
		email: 'github@example.com',
		url: 'https://yourwebgarder.com',
		jobTitle: 'webmaster',
		address: {
			city: 'City',
			state: 'CI',
			streetAddress: 'somewhere 101'
		}
	}
};
const homePage: SEOWebPage = {
	url: website.baseURL,
	title: 'Home Page',
	description: 'This is the description for the Home Page',
	keywords: ['sveltekit, components, tests, jest'],
	opengraph: {
		type: OpenGraphType.Website
	},
	twitter: {
		type: TwitterCardType.Summary
	}
};

const sampleArticle: SEOWebPage = {
	url: website.baseURL + '/posts/getting-started',
	title: 'Getting Started Article',
	description: 'This is the description for the Getting Started Article',
	author: 'Mirco Veltri',
	keywords: ['sveltekit, components, tests, jest'],
	opengraph: {
		type: OpenGraphType.Article,
		article: {
			tags: ['sveltekit'],
			published_at: new Date('23-01-2022'),
			modified_at: new Date('24-01-2022')
		}
	},
	twitter: {
		type: TwitterCardType.Large,
		site: '@indaco'
	}
};

const menu: Array<SEOMenuItem> = [
	{
		identifier: 'home',
		name: 'Home',
		url: '/',
		weight: 1
	},
	{
		identifier: 'about',
		name: 'About',
		url: '/about',
		weight: 2
	},
	{
		identifier: 'github',
		name: 'GitHub',
		url: 'https://github.com/sveltinio',
		weight: 3,
		external: true
	}
];

export { website, homePage, sampleArticle, menu };
