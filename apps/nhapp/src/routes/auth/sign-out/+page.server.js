import { redirect } from '@sveltejs/kit';
import { getNhost, NHOST_SESSION_KEY } from '$lib/nhost';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async (event) => {
		const nhost = await getNhost(event.cookies);

		await nhost.auth.signOut();
		event.cookies.set(NHOST_SESSION_KEY, '', { httpOnly: true, path: '/', maxAge: 0 });

		throw redirect(303, '/auth/sign-in');
	}
};
