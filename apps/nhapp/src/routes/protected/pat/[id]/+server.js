import { gql } from '@apollo/client/index.js';
import { json, redirect } from '@sveltejs/kit';
import { getNhost } from '$lib/nhost.js';

export const DELETE = async ({ cookies, params }) => {
	const nhost = await getNhost(cookies);

	const id = params.id;

	const { error } = await nhost.graphql.request(
		gql`
			mutation deletePersonalAccessToken($id: uuid!) {
				deleteAuthRefreshToken(id: $id) {
					id
				}
			}
		`,
		{
			id
		}
	);

	if (!error) {
		redirect(303, '/protected/pat');
	}

	return json({ error });
};
