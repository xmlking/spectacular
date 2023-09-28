import { name, baseurl } from '../sveltin.json';
import type { Sveltin } from '$sveltin';

const website: Sveltin.WebSite = {
	name: name,
	baseURL: baseurl,
	language: 'en-GB',
	title: name,
	slogan: '',
	description: '',
	seoDescription: '',
	favicon: 'favicon.png',
	logo: 'logo.png',
	copyright: '2023'.concat(' - ', name),
	keywords: [],
	contactEmail: '',
	socials: {
		linkedin: '',
		twitter: '',
		github: '',
		facebook: '',
		instagram: '',
		youtube: '',
		mastodon: ''
	},
	creator: {
		name: 'Sumanth Chinthagunta',
		address: 'Somewhere, World (Milky Way)',
		email: ''
	}
};

export { website };
