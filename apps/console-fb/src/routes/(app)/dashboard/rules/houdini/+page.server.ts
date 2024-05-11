import { fail } from '@sveltejs/kit';
import type { GraphQLError } from 'graphql';
import { redirect as redirectWithFlash } from 'sveltekit-flash-message/server';
import { setError, setMessage, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { Logger } from '@spectacular/utils';
import { ruleDeleteSchema as schema } from '$lib/models/schema';
import { ToastLevel } from '$lib/components/toast';
import { DeleteRuleStore } from '$houdini';

const log = new Logger('rule.action.server');

const deleteRuleStore = new DeleteRuleStore();
export const actions = {
	delete: async (event) => {
		const { request, locals } = event;
		const session = await locals.auth();
		if (session?.user == undefined) {
			redirectWithFlash(307, '/auth/signin?callbackUrl=/dashboard/rules');
		}

		const form = await superValidate(request, zod(schema));
		log.debug({ form });

		// superform validation
		if (!form.valid) return fail(400, { form });

		const variables = { id: form.data.id, deletedAt: new Date() };
		log.debug('DELETE action variables:', variables);
		const { errors, data } = await deleteRuleStore.mutate(variables, {
			metadata: { logResult: true },
			event
		});
		if (errors) {
			errors.forEach((error) => {
				log.error('delete rule gql error', error);
				setError(form, '', (error as GraphQLError).message);
			});
			return setMessage(form, 'Delete rule failed');
		}

		const result = data?.update_rules_by_pk;
		if (!result) return setMessage(form, 'Delete rule failed: responce empty', { status: 404 });
		const message = {
			message: `Rule: ${result.displayName} deleted`,
			dismissible: true,
			duration: 10000,
			type: ToastLevel.Success
		} as const;
		redirectWithFlash(302, '/dashboard/rules', message, event);
	}
};
