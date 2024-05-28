import { fail } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types.js';
import { schema } from './schema.js';

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod(schema));
  return { form };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(schema));
    if (!form.valid) {
      return fail(400, { form });
    }
    return {
      form,
    };
  },
};
