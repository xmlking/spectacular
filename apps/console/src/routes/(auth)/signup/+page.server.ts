import { i18n } from '$lib/i18n';
import { signUpSchema } from '$lib/schema/user';
import { limiter } from '$lib/server/limiter/limiter';
import { setNhostSessionInCookies } from '$lib/server/utils/nhost';
import { Logger, sleep } from '@spectacular/utils';
import { fail } from '@sveltejs/kit';
import { redirect as redirectWithFlash } from 'sveltekit-flash-message/server';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const log = new Logger('server:auth:signup');

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

    const form = await superValidate(request, zod(signUpSchema));

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

    const { organization, firstName, lastName, email, password, redirectTo } = form.data;

    const { session: sessionBad, error } = await nhost.auth.signUp({
      email,
      password,
      options: {
        displayName: `${firstName} ${lastName}`,
        // defaultRole: 'user',
        // It's possible to give users a subset of allowed roles during signup.
        // allowedRoles: ['me', 'user'],
        locale: lang,
        metadata: {
          plan: 'free',
          default_org: organization,
        },
      },
    });
    if (error) {
      log.error(error);
      return setError(form, `Failed creating account: ${error.message}`, { status: 409 }); // 424 ???
    }
    const session = nhost.auth.getSession();
    if (session) {
      setNhostSessionInCookies(cookies, session);
      const message: App.Superforms.Message = { type: 'success', message: 'Signup sucessfull 😎' } as const;
      redirectWithFlash(303, i18n.resolveRoute(redirectTo), message, event);
    }

    // This line should never reach.
    return message(form, { type: 'success', message: 'Signup sucessfull-no 😎' });
  },
};
