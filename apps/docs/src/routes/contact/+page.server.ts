export const prerender = false;

import { superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';
import { contactFormSchema } from './schema.js';

export const load = async () => {
	return {
		form: superValidate(contactFormSchema)
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, contactFormSchema);
		if (!form.valid) {
			return fail(400, { form });
		}
		return {
			form
		};
	}
};
