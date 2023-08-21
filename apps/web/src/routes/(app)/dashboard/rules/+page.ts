import { CachePolicy, SearchSharedRulesStore } from '$houdini';
import { ruleSearchSchema as schema } from '$lib/models/schema';
import { Logger } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { GraphQLError } from 'graphql';
import { setError, setMessage, superValidate } from 'sveltekit-superforms/client';
const log = new Logger('rules.list.browser');

const searchSharedRulesStore = new SearchSharedRulesStore();
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
	const { errors, data } = await searchSharedRulesStore.fetch({
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
	const items = data?.rules;
	if (!items) throw error(404, 'rules not found');
	return { form, items };
};
