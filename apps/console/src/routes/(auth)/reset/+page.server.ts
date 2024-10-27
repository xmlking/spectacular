import { i18n } from '$lib/i18n';
import { resetPasswordSchema } from '$lib/schema/user';
import { limiter } from '$lib/server/limiter/limiter';
import { Logger, sleep } from '@spectacular/utils';
import { fail } from '@sveltejs/kit';
import { redirect as redirectWithFlash } from 'sveltekit-flash-message/server';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const log = new Logger('auth:reset:server');

export const load = async (event) => {
  const {
    locals: { nhost },
  } = event;
  /**
   * Preflight prevents direct posting. If preflight option for the
   * cookie limiter is true and this function isn't called before posting,
   * request will be limited.
   *
   * Remember to await, so the cookie will be set before returning!
   */
  await limiter.cookieLimiter?.preflight(event);

  const isAuthenticated = nhost.auth.isAuthenticated();
  if (isAuthenticated) redirectWithFlash(302, i18n.resolveRoute('/dashboard'));
};

export const actions = {
  default: async (event) => {
    log.debug('in reset action');
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

    await sleep(2000);

    const origin = new URL(event.url).origin;

    if (!form.valid) return fail(400, { form });
    const { email } = form.data;
    const { error } = await nhost.auth.resetPassword({
      email,
      options: {
        redirectTo: `${origin}/profile`,
      },
    });
    if (error) {
      log.error(error);
      return setError(form, `Failed to send reset password instructions: ${error.message}`, { status: 409 }); // 424 ???
    }

    return message(form, { type: 'success', message: 'Send reset password instructions to email provided' });
  },
};
