import { createOrganizationSchema } from '$lib/schema/organization';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export async function load() {
  const form = await superValidate(zod(createOrganizationSchema));

  return { form, schema: createOrganizationSchema };
}
