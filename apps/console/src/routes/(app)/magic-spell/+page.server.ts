import { Logger, sleep } from '@spectacular/utils';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const aiSchema = z.object({
  commentOne: z
    .string({ required_error: 'First Comment is required' })
    .min(10, { message: 'First Comment must contain at least 10 character(s)' })
    .max(256)
    .trim(),
  commentTwo: z
    .string({ required_error: 'Second Comment is required' })
    .min(10, { message: 'Second Name Comment contain at least 10 character(s)' })
    .max(256)
    .trim(),
});

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

    const { commentOne, commentTwo } = form.data;
    log.debug({ commentOne, commentTwo });
    return message(form, { type: 'success', message: 'AI sucessfull 😎' });
  },
};
