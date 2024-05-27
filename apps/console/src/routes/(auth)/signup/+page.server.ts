import { i18n } from '$lib/i18n';
import { setNhostSessionInCookies } from '$lib/nhost';
import { signUpSchema } from '$lib/schema/user';
import { limiter } from '$lib/server/limiter/limiter';
import { getOrgs } from '$lib/server/utils/getOrgs';
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
  // Preflight prevents direct posting.
  // If preflight option is true and this function isn't called
  // before posting, request will be limited:
  await limiter.cookieLimiter?.preflight(event);

  const session = nhost.auth.getSession();
  // log.debug(session);
  if (session) redirectWithFlash(302, i18n.resolveRoute('/dashboard'));
  const form = await superValidate(zod(signUpSchema));
  // fetch orgs and render errors if backend throw error.
  const { errors, data } = await getOrgs(nhost);
  if (errors) {
    errors.forEach((error) => {
      log.error('list orgs api error', error);
      // NOTE: you can add multiple errors, send all along with a message
      setError(form, '', (error as GraphQLError).message);
    });
    setMessage(form, { type: 'error', message: 'List organizations failed' }, { status: 500 });
    return { status: 500, form };
  }
  const organizations = data.organizations.map((x) => x.organization);
  if (!organizations) error(404, 'organizations not found');

  return { organizations, form };
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

    log.debug({ lang, nhost });
    await sleep(8000);

    if (!form.valid) return fail(400, { form });

    const { organization, firstName, lastName, email, password } = form.data;

    const { session, error } = await nhost.auth.signUp({
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

    if (session) {
      setNhostSessionInCookies(cookies, session);
      const message: App.Superforms.Message = { type: 'success', message: 'Signup sucessfull 😎' } as const;
      redirectWithFlash(303, i18n.resolveRoute('/dashboard'), message, event);
    }

    // This line should never reach.
    return message(form, { type: 'success', message: 'Signup sucessfull 😎' });
  },
};
