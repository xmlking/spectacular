import { organizationsCreateSchema } from '$lib/schema/organizations';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export async function load() {
  const form = await superValidate(zod(organizationsCreateSchema));

  return { form, organizationsCreateSchema };
}
