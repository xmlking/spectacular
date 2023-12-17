import { redirect } from '@sveltejs/kit';
import { getNhost } from '$lib/nhost';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ cookies }) => {
		const nhost = await getNhost(cookies);

		const { providerUrl } = await nhost.auth.signIn({
			provider: 'google',
			options: {
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

		if (providerUrl) {
			redirect(307, providerUrl);
		}
	}
};
