import { i18n } from '$lib/i18n';
import { resetPasswordSchema } from '$lib/schema/user';
import { limiter } from '$lib/server/limiter/limiter';
import { Logger, sleep } from '@spectacular/utils';
import { fail } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const log = new Logger('auth:reset:server');

export const actions = {
  default: async (event) => {
    const {
      request,
      cookies,
      locals: {
        paraglide: { lang },
        nhost,
      },
    } = event;

    const form = await superValidate(request, zod(resetPasswordSchema));

    const status = await limiter.check(event);
    if (status.limited) {
      event.setHeaders({
        'Retry-After': status.retryAfter.toString(),
      });
      return message(
        form,
        {
          type: 'error',
          message: `Rate limit has been reached. Please retry after ${status.retryAfter} seconds`,
        },
        { status: 429 },
      );
    }

    await sleep(8000);

    if (!form.valid) return fail(400, { form });
    const { email } = form.data;
    const { error } = await nhost.auth.resetPassword({
      email,
      options: {
        redirectTo: '/profile',
      },
    });
    if (error) {
      log.error(error);
      return setError(form, `Failed to send reset password instructions: ${error.message}`, { status: 409 }); // 424 ???
    }

    return message(form, { type: 'success', message: 'Send reset password instructions to email provided' });
  },
};
