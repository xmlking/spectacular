import { Logger, sleep } from '@spectacular/utils';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { spSchema } from './schema';

const log = new Logger('smart:past:server');

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod(spSchema));
    await sleep(1000);

    if (!form.valid) return fail(400, { form });

    const { firstName, lastName, phoneNumber, line1, line2, city, state, zip, country } = form.data;
    log.debug({ firstName, lastName, phoneNumber, line1, line2, city, state, zip, country });
    return message(form, { type: 'success', message: 'User form saved sucessfully 😎' });
  },
};
