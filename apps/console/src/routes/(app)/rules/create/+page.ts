import { superValidate } from 'sveltekit-superforms/client';
import { createRuleSchema as schema } from '$lib/schema/rule';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	// Client API:
	const form = await superValidate(zod(schema));

	// Always return { form } in load and form actions.
	return { schema, form };
};
