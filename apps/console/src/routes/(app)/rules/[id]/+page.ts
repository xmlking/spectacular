import { updateRuleSchema } from '$lib/schema/rule';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
  const response = await fetch(`/api/rules/${params.id}`);
  if (!response.ok) {
    throw error(response.status, 'Failed to load rule');
  }
  const rule = await response.json();

  const form = await superValidate(rule, zod(updateRuleSchema));
  return { form, ruleId: params.id };
};
