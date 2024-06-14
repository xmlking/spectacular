import { PUBLIC_DEFAULT_ORGANIZATION } from '$env/static/public';
import { i18n } from '$lib/i18n';
import { pwSchema, pwlSchema } from '$lib/schema/user';
import { limiter } from '$lib/server/limiter/limiter';
import { setNhostSessionInCookies } from '$lib/server/utils/nhost';
import type { NhostClient, Provider } from '@nhost/nhost-js';
import { Logger, sleep } from '@spectacular/utils';
import { fail } from '@sveltejs/kit';
import { redirect as redirectWithFlash } from 'sveltekit-flash-message/server';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const log = new Logger('server:auth:signin');

export const load = async (event) => {
  const {
    locals: { nhost },
  } = event;
  // Preflight prevents direct posting.
  // If preflight option is true and this function isn't called
  // before posting, request will be limited:
  await limiter.cookieLimiter?.preflight(event);

  const session = nhost.auth.getSession();
  log.debug(session);
  if (session) redirectWithFlash(302, i18n.resolveRoute('/dashboard'));
  const pwForm = await superValidate(zod(pwSchema));
  const pwlForm = await superValidate(zod(pwlSchema));
  return { pwForm, pwlForm };
};

export const actions = {
  password: async (event) => {
    const {
      request,
      cookies,
      url,
      locals: {
        paraglide: { lang },
        nhost,
      },
    } = event;

    const form = await superValidate(request, zod(pwSchema));

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

    log.debug('in password', { lang, nhost });
    await sleep(5000);

    if (!form.valid) return fail(400, { form });

    const { email, password, redirectTo } = form.data;

    let { session, error } = await nhost.auth.signIn({ email, password });
    if (error) {
      log.error(error);
      return setError(form, `Failed signin: ${error.message}`, { status: 409 }); // 424 ???
    }

    if (session && session.accessTokenExpiresIn === 0) {
      // FIXME: we have to call refreshSession() as accessTokenExpiresIn comming as zero.
      ({ session, error } = await nhost.auth.refreshSession());
      if (error) {
        log.error(error);
        return setError(form, `Failed signin: ${error.message}`, { status: 409 }); // 424 ???
      }
    }

    if (session) {
      setNhostSessionInCookies(cookies, session);
      const message: App.Superforms.Message = { type: 'success', message: 'Signin sucessfull 😎' } as const;
      redirectWithFlash(303, i18n.resolveRoute(redirectTo), message, event); // how to reload!
    }

    // This line should never reach.
    return message(form, { type: 'success', message: 'Signin sucessfull-no 😎' });
  },

  passwordless: async (event) => {
    const {
      request,
      locals: {
        paraglide: { lang },
        nhost,
      },
    } = event;

    const form = await superValidate(request, zod(pwlSchema));

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

    log.debug('in passwordless', { lang, nhost });
    await sleep(8000);

    if (!form.valid) return fail(400, { form });

    const { email } = form.data;

    const { error } = await nhost.auth.signIn({ email });

    if (error) {
      log.error(error);
      return setError(form, `Failed signin: ${error.message}`, { status: 409 }); // 424 ???
    }
    return message(form, {
      type: 'success',
      message: '😎 Click the link in the email to finish the sign in process',
    });
  },

  google: async ({
    request,
    locals: {
      paraglide: { lang },
      nhost,
    },
  }) => {
    // TODO check if already login? session is valid
    log.debug('in login with google');
    await login(nhost, new URL(request.url).origin + i18n.resolveRoute('/dashboard'), lang, 'google');
  },

  github: async ({
    request,
    locals: {
      paraglide: { lang },
      nhost,
    },
  }) => {
    log.debug('in login with github');
    await login(nhost, new URL(request.url).origin + i18n.resolveRoute('/dashboard'), lang, 'github');
  },

  azuread: async ({
    request,
    locals: {
      paraglide: { lang },
      nhost,
    },
  }) => {
    log.debug('in login with azuread');
    await login(nhost, new URL(request.url).origin, lang, 'azuread');
  },
};

async function login(nhost: NhostClient, redirectTo: string, lang: string, provider: Provider) {
  const { providerUrl } = await nhost.auth.signIn({
    provider,
    options: {
      redirectTo,
      // defaultRole: 'user',
      // It's possible to give users a subset of allowed roles during signup.
      // allowedRoles: ['me', 'user'],
      locale: lang,
      metadata: {
        plan: 'free',
        default_org: PUBLIC_DEFAULT_ORGANIZATION,
      },
    },
  });

  log.debug(providerUrl);
  if (providerUrl) {
    redirectWithFlash(307, providerUrl);
  }
}
