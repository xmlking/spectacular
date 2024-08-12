import { createPolicySchema as schema } from '$lib/schema/policy';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params }) => {
  const form = await superValidate(zod(schema));

  return { schema, form };
};
