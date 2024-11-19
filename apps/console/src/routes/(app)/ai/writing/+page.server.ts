import { Logger, sleep } from '@spectacular/utils';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { writingSchema } from './schema';

const log = new Logger('ai:writing:server');


export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod(writingSchema));

    await sleep(1000);

    if (!form.valid) return fail(400, { form });

    const { content } = form.data;
    log.debug({ content });
    return message(form, { type: 'success', message: 'AI form saved sucessfully 😎' });
  },
};
