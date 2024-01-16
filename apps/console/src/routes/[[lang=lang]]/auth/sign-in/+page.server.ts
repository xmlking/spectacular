import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { Logger } from '@spectacular/utils';
import type { NhostClient, Provider } from '@nhost/nhost-js';
import { userSchema } from '$lib/schema/user';
import { NHOST_SESSION_KEY } from '$lib/nhost';

const signInSchema = userSchema.pick({
	email: true,
	password: true
});

const log = new Logger('server:auth:login');

export const load = async ({ locals: { nhost } }) => {
	const session = nhost.auth.getSession();
	log.debug(session);
	if (session) redirect(302, '/dashboard');
	const form = await superValidate(zod(signInSchema));
	return { form };
};

export const actions = {
	password: async ({ request, cookies, locals: { nhost } }) => {
		log.debug('in login with password');
		const formData = await request.formData();
		const email = String(formData.get('email'));
		const password = String(formData.get('password'));

		const { session, error } = await nhost.auth.signIn({ email, password });

		if (session) {
			cookies.set(NHOST_SESSION_KEY, btoa(JSON.stringify(session)), { path: '/' });
			throw redirect(303, '/dashboard');
		}

		if (error) {
			log.debug('password auth error:', error);
			return {
				error: error?.message
			};
		}
	},
	magic_link: async ({ request, locals: { nhost } }) => {
		log.debug('in login with magic_link');

		const formData = await request.formData();
		const email = String(formData.get('email'));
		const { error } = await nhost.auth.signIn({ email });
		if (error) {
			log.debug('magic_link auth error:', error);
			return {
				error: error?.message
			};
		} else {
			return {
				isSuccess: true
			};
		}
	},
	google: async ({ request, locals: { nhost } }) => {
		// TODO check if already login? session is valid
		log.debug('in login with google');
		log.debug(nhost);
		await login(nhost, new URL(request.url).origin, 'google');
	},

	github: async ({ request, locals: { nhost } }) => {
		log.debug('in login with github');
		log.debug(nhost);
		await login(nhost, new URL(request.url).origin, 'github');
	},

	azuread: async ({ request, locals: { nhost } }) => {
		log.debug('in login with azuread');
		log.debug(nhost);
		await login(nhost, new URL(request.url).origin, 'azuread');
	}
};

async function login(nhost: NhostClient, redirectTo: string, provider: Provider) {
	const { providerUrl } = await nhost.auth.signIn({
		provider,
		options: {
			redirectTo,
			// defaultRole: 'user',
			// It's possible to give users a subset of allowed roles during signup.
			// allowedRoles: ['me', 'user'],
			locale: 'en',
			metadata: {
				plan: 'free',
				org: 'chinthagunta'
			}
		}
	});

	log.debug(providerUrl);
	if (providerUrl) {
		redirect(307, providerUrl);
	}
}
