import { redirect } from '@sveltejs/kit';
import { getNhost } from '$lib/nhost';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, cookies }) => {
		const nhost = await getNhost(cookies);

		const formData = await request.formData();

		const name = String(formData.get('name'));
		const expiration = String(formData.get('expiration'));
		const expirationDate = new Date(expiration);

		await nhost.auth.createPAT(expirationDate, { name });

		redirect(303, '/protected/pat');
	}
};
