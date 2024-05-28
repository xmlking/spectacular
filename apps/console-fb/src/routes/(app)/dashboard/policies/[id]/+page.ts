import { CachePolicy, GetPolicyStore } from '$houdini';
import { updatePolicySchema as schema } from '$lib/models/schema';
import { error } from '@sveltejs/kit';
import type { GraphQLError } from 'graphql';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const getPolicyStore = new GetPolicyStore();
export const load = async (event) => {
  const {
    params: { id },
  } = event;
  const variables = { id }; // TODO: validate `id`
  const { errors, data } = await getPolicyStore.fetch({
    event,
    blocking: true,
    policy: CachePolicy.CacheAndNetwork,
    variables,
  });
  if (errors) error(400, errors[0] as GraphQLError);
  const policy = data?.policies_by_pk;
  if (!policy) error(404, 'policy not found');
  const form = await superValidate(policy, zod(schema));
  // we need `originalShared` to track if `rule.shared` is changeing from false ==> true
  form.data.originalShared = form.data.rule.shared;
  return { form };
};
