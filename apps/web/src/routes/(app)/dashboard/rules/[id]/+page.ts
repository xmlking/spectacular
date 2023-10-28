import { error } from '@sveltejs/kit';
import type { GraphQLError } from 'graphql';
import { superValidate } from 'sveltekit-superforms/client';
import { updateRuleSchema as schema } from '$lib/models/schema';
import { CachePolicy, GetRuleStore } from '$houdini';

const getRuleStore = new GetRuleStore();
export const load = async (event) => {
	const {
		params: { id }
	} = event;
	const variables = { id }; // TODO: validate `id`
	const { errors, data } = await getRuleStore.fetch({
		event,
		blocking: true,
		policy: CachePolicy.NetworkOnly,
		variables
	});
	if (errors) throw error(400, errors[0] as GraphQLError);
	const rule = data?.rulesByPk;
	if (!rule) throw error(404, 'Rule not found');
	const form = await superValidate(rule, schema);
	return { form };
};
