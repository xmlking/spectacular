import type { Translation } from '../i18n-types';
import en from '../en';

const de = {
	// this is an example Translation, just rename or delete this folder if you want
	...(en as Translation),
	language: 'Sprache',
	HI: 'Hallo {name}! Bitte hinterlasse einen Stern, wenn dir das Projekt gefällt: https://github.com/ivanhofer/typesafe-i18n',
	welcome: 'Willkommen bei SvelteKit',
	message: 'Hallo Welt',
	// Shared
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
		filter: 'Filter',
		privacy: "Datenschutz",
		terms: "Nutzungsbedingungen"
	},
	// Page specific
	home: {
		labels: {

		},
	  messages: {

	  },
	},
	auth: {
		labels: {
			signin: "Anmelden",
			signinProblem: "Sign In Problem",
			signup: "Registrieren",
			signout: "Abmelden",
			forgotPassword: "Passwort vergessen?",
			changePassword: "Ändern Sie Ihr Passwort",
			passwordProblem: "Problem beim Passwortwechsel",
			updatePassword: "Passwort aktualisieren",
			resetProblem: "Problem beim Zurücksetzen des Passworts",
			sendResetEmail: "Passwort-Zurücksetzen-E-Mail senden"
		},
		messages: {
		},
		forms: {
			firstName : {
				label: 'Vorname',
				placeholder: 'Vorname'
			},
			lastName : {
				label: 'Nachname',
				placeholder: 'Nachname'
			},
			email : {
				label: 'E-Mail',
				placeholder: 'E-Mail-Adresse'
			},
			password : {
				label: '',
				placeholder: 'Passwort'
			},
		}
	},
} satisfies Translation;

export default de;
