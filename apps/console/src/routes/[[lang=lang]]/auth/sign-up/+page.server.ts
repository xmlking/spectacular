import { fail, error as swError } from '@sveltejs/kit';
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
	terms: true
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
		// Every call to isLimited counts as a hit towards the rate limit for the event.
		if (await limiter.isLimited(event)) swError(429);

		const form = await superValidate(request, zod(signUpSchema));

		log.debug({ lang, nhost });
		log.debug('raw form:', form);
		// await sleep(8000)

		if (!form.valid) return fail(400, { form });

		const { firstName, lastName, email, password } = form.data;

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
					org: 'chinthagunta'
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
