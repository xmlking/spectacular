import { createRuleSchema } from '$lib/schema/rule';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
  const form = await superValidate(zod(createRuleSchema));
  return { form };
};
