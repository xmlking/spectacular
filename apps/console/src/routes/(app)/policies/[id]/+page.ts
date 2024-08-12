import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { createPolicySchema as schema } from '$lib/schema/policy';

export const load = (async ({ params }) => {

  const form = await superValidate(zod(schema));


  return { schema, form };
})
