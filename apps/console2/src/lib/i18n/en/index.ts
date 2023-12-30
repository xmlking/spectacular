import type { BaseTranslation } from '../i18n-types';

const en = {
	// TODO: your translations go here
	HI: 'Hi {name:string}! Please leave a star if you like this project: https://github.com/ivanhofer/typesafe-i18n',
	welcome: 'Welcome to SvelteKit',
	message: 'Hello World',
	buttons: {
		create: 'Create',
		edit: 'Edit',
		update: 'Update',
		logOut: 'Logout',
		loginYouTube: 'Login with YouTube'
	},
	labels: {
		title: 'Title',
		description: 'Description',
		visibility: 'Visibility',
		views: '{0} views',
		filter: 'Filter'
	},
	enums: {
		visibility: {
			Public: 'Public',
			Unlisted: 'Unlisted',
			Private: 'Private'
		}
	},
	errors: {
		titleRequired: 'Title cannot be empty.',
		descriptionRequired: 'Description cannot be empty.',
		notFound: 'Not found.'
	},
	messages: {
		pleaseWait: 'Please wait...'
	},
	pages: {
		root: {
			loggedIn: {
				messages: {
					createList: 'Click Create to get started.'
				}
			},
			messages: {
				tagline:
					"Presenting the ultimate YouTube experience. Whether you're looking for new content to watch or want to share your own curated list with friends, our app has got you covered."
			}
		},
		onboarding: {
			buttons: {
				letsGo: 'Lets Go!'
			},
			labels: {
				username: 'Username',
				uploadFile: 'Upload File'
			},
			messages: {
				main: "Welcome to listd! Let's setup your profile.",
				avatar: 'Upload your avatar.',
				final: "That's all! Let's get started!"
			}
		},
		create: {
			labels: {
				channelSearch: 'Channel Search'
			},
			messages: {
				channelSearch: 'Search for a channel...'
			}
		}
	},
	log: `This log was called from '{fileName:string}'`
} satisfies BaseTranslation;

export default en;
