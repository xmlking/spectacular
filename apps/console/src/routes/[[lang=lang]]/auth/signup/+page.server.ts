import { fail } from '@sveltejs/kit';
import { redirect as redirectWithFlash } from 'sveltekit-flash-message/server';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { Logger } from '@spectacular/utils';
import { userSchema } from '$lib/schema/user';
import { NHOST_SESSION_KEY } from '$lib/nhost';
import { limiter } from '$lib/server/limiter/limiter';

const signUpSchema = userSchema.pick({
	firstName: true,
	lastName: true,
	email: true,
	password: true,
	terms: true,
	organization: true
});

const log = new Logger('server:auth:signup');

export const load = async (event) => {
	const {
		locals: { nhost }
	} = event;
	// Preflight prevents direct posting.
	// If preflight option is true and this function isn't called
	// before posting, request will be limited:
	await limiter.cookieLimiter?.preflight(event);

	const session = nhost.auth.getSession();
	log.debug(session);
	if (session) redirectWithFlash(302, '/dashboard');
	const form = await superValidate(zod(signUpSchema));
	return { form };
};

export const actions = {
	default: async (event) => {
		const {
			request,
			cookies,
			locals: { lang, nhost }
		} = event;

		const form = await superValidate(request, zod(signUpSchema));

		const status = await limiter.check(event);
		if (status.limited) {
			event.setHeaders({
				'Retry-After': status.retryAfter.toString()
			});
			return message(
				form,
				{
					type: 'error',
					message: `Rate limit has been reached. Please retry after ${status.retryAfter} seconds`
				},
				{ status: 429 }
			);
		}

		log.debug({ lang, nhost });
		// await sleep(8000)

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
					org: organization
				}
			}
		});
		if (error) {
			log.error(error);
			return setError(form, `Failed creating account: ${error.message}`, { status: 409 }); // 424 ???
		}

		if (session) {
			cookies.set(NHOST_SESSION_KEY, btoa(JSON.stringify(session)), { path: '/' });
			const message: App.Superforms.Message = { type: 'success', message: 'Signup sucessfull 😎' } as const;
			redirectWithFlash(303, '/dashboard', message, event);
		}

		// This line should never reach.
		return message(form, { type: 'success', message: 'Signup sucessfull 😎' });
	}
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
