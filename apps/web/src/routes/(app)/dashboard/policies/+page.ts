import { CachePolicy, ListPoliciesStore, order_by } from '$houdini';
import { policySearchSchema as schema } from '$lib/models/schema';
import { Logger } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { GraphQLError } from 'graphql';
import { setError, setMessage, superValidate } from 'sveltekit-superforms/client';
const log = new Logger('rules.list.browser');

const listPoliciesStore = new ListPoliciesStore();
export const load = async (event) => {
	const { url } = event;
	const form = await superValidate(url, schema);

	if (!form.valid) return { status: 400, form }; // return fail(400, { form }); // FIXME

	const {
		data: { limit, offset, subjectType, subjectId }
	} = form;

	const orderBy = [{ updatedAt: order_by.desc_nulls_first }];
	const where = {
		...(subjectType ? { subjectType: { _eq: subjectType } } : {}),
		...(subjectId ? { subjectId: { _eq: subjectId } } : {})
	};

	const variables = {
		limit,
		offset,
		orderBy,
		where
	};
	const { errors, data } = await listPoliciesStore.fetch({
		event,
		blocking: true,
		policy: CachePolicy.NetworkOnly,
		variables
	});
	if (errors) {
		errors.forEach((error) => {
			log.error('list policies api error', error);
			// NOTE: you can add multiple errors, send all along with a message
			setError(form, '', (error as GraphQLError).message);
		});
		setMessage(form, 'Backend error');
		return { status: 500, form };
	}
	const items = data?.policies;
	if (!items) throw error(404, 'policies not found');
	return { form, items };
};
