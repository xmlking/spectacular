import { Logger, sleep } from '@repo/utils';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { aiSchema } from './schema';

export const ssr = false;

const log = new Logger('smart:date:server');

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod4(aiSchema));

    await sleep(1000);

    if (!form.valid) return fail(400, { form });

    const { commentOne, commentTwo, commentThree, startDate, endDate, specialization } = form.data;
    log.debug({ commentOne, commentTwo, commentThree, startDate, endDate, specialization });
    return message(form, { type: 'success', message: 'AI form saved sucessfully 😎' });
  },
};
