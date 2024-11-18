import { Logger, sleep } from '@spectacular/utils';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const smartpasteSchema = z.object({
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
  phoneNumber: z.string().nullish(),
  line1: z.string().nullish(),
  line2: z.string().nullish(),
  city: z.string().nullish(),
  state: z.string().nullish(),
  zip: z.string().nullish(),
  country: z.string().nullish(),
});

const log = new Logger('server:ai:ms');

export const load = async () => {
  const form = await superValidate(zod(smartpasteSchema));
  return { form };
};

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod(smartpasteSchema));
    await sleep(1000);

    if (!form.valid) return fail(400, { form });

    const { firstName, lastName, phoneNumber, line1, line2, city, state, zip, country } = form.data;
    log.debug({ firstName, lastName, phoneNumber, line1, line2, city, state, zip, country });
    return message(form, { type: 'success', message: 'User form saved sucessfully 😎' });
  },
};
