import { i18n } from '$lib/i18n';
import { signUpSchema } from '$lib/schema/user';
import { limiter } from '$lib/server/limiter/limiter';
import { setNhostSessionInCookies } from '$lib/server/utils/nhost';
import { Logger, sleep } from '@spectacular/utils';
import { error, fail } from '@sveltejs/kit';
import type { GraphQLError } from 'graphql';
import { redirect as redirectWithFlash } from 'sveltekit-flash-message/server';
import { message, setError, setMessage, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const log = new Logger('server:auth:signup');

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
  // const form = await superValidate(zod(signUpSchema));
  // return { form };
};

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
