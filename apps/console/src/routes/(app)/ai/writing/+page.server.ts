import { Logger, sleep } from '@spectacular/utils';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { aiSchema } from './schema';

const log = new Logger('server:ai:ms');

export const load = async () => {
  const form = await superValidate(zod(aiSchema));
  return { form };
};

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod(aiSchema));

    await sleep(1000);

    if (!form.valid) return fail(400, { form });

    const { writing1 } = form.data;
    log.debug({ writing1 });
    return message(form, { type: 'success', message: 'AI form saved sucessfully 😎' });
  },
};
