import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { someFormSchema } from './schema.js';

export const load: PageServerLoad = async () => {
	return {
		form: superValidate(zod(someFormSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(someFormSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		return {
			form
		};
	}
};
