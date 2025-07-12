import { Logger, sleep } from '@repo/utils';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { personSchema } from './schema';

const log = new Logger('smart:past:server');

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod4(personSchema));
    await sleep(1000);

    if (!form.valid) return fail(400, { form });

    const { firstName, lastName, phoneNumber, line1, line2, city, state, zip, country } = form.data;
    log.debug({ firstName, lastName, phoneNumber, line1, line2, city, state, zip, country });
    return message(form, { type: 'success', message: 'User form saved sucessfully 😎' });
  },
};
