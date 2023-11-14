import { redirect } from '@sveltejs/kit';
import { getNhost, NHOST_SESSION_KEY } from '$lib/nhost';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async (event) => {
		const { request, cookies } = event;
		const nhost = await getNhost(cookies);

		const formData = await request.formData();
		const email = String(formData.get('email'));
		const password = String(formData.get('password'));
		const firstName = String(formData.get('firstName'));
		const lastName = String(formData.get('lastName'));

		const { session, error } = await nhost.auth.signUp({
			email,
			password,
			options: {
				displayName: `${firstName} ${lastName}`,
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

		if (session) {
			cookies.set(NHOST_SESSION_KEY, btoa(JSON.stringify(session)), { path: '/' });
			throw redirect(303, '/protected/todos');
		}

		if (error) {
			return {
				error: error?.message
			};
		}
	}
};
