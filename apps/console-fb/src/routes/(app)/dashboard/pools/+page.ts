import { error } from '@sveltejs/kit';
import type { GraphQLError } from 'graphql';
import { setError, setMessage, superValidate } from 'sveltekit-superforms/client';
import { Logger } from '@spectacular/utils';
import { ruleSearchSchema as schema } from '$lib/models/schema';
import { CachePolicy, ListPoolsStore } from '$houdini';
const log = new Logger('rules.list.browser');

const listPoolsStore = new ListPoolsStore();
export const load = async (event) => {
	const { url } = event;
	const form = await superValidate(url, schema);

	if (!form.valid) return { status: 400, form }; // return fail(400, { form }); // FIXME

	const {
		data: { limit, offset, displayName }
	} = form;

	const variables = {
		limit,
		offset,
		...{ displayName: displayName ? `%${displayName}%` : '%%' }
	};
	const { errors, data } = await listPoolsStore.fetch({
		event,
		blocking: true,
		policy: CachePolicy.NetworkOnly,
		variables
	});
	if (errors) {
		errors.forEach((error) => {
			log.error('list rule api error', error);
			// NOTE: you can add multiple errors, send all along with a message
			setError(form, '', (error as GraphQLError).message);
		});
		setMessage(form, 'Backend error');
		return { status: 500, form };
	}
	const items = data?.pools;
	if (!items) error(404, 'pools not found');
	return { form, items };
};
