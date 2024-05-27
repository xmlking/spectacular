import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createPolicySchema as schema } from '$lib/models/schema';

export const load = async () => {
  // Client API:
  const form = await superValidate(zod(schema));

  // Always return { form } in load and form actions.
  return { schema, form };
};
