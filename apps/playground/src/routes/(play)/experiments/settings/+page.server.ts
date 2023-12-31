import { superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { someFormSchema } from './schema.js';

export const load: PageServerLoad = async () => {
	return {
		form: superValidate(someFormSchema)
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, someFormSchema);
		if (!form.valid) {
			return fail(400, { form });
		}
		return {
			form
		};
	}
};
