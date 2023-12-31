import type { Translation } from '../i18n-types';
import en from '../en';

const de = {
	// this is an example Translation, just rename or delete this folder if you want
	...(en as Translation),
	HI: 'Hallo {name}! Bitte hinterlasse einen Stern, wenn dir das Projekt gefällt: https://github.com/ivanhofer/typesafe-i18n',
	welcome: 'Willkommen bei SvelteKit',
	message: 'Hallo Welt'
} satisfies Translation;

export default de;
