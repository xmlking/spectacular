import { redirect } from '@sveltejs/kit';
import { manageAuthSession } from '$lib/nhost';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	await manageAuthSession(event, () => {
		redirect(303, '/auth/sign-in');
	});

	return resolve(event);
}
