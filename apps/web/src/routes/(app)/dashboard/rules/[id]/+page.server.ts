import { UpdateRuleStore, type rules_set_input } from '$houdini';
import { ToastLevel } from '$lib/components/toast';
import { updateRuleSchema as schema } from '$lib/models/schema';
import { Logger, cleanClone } from '$lib/utils';
import { uuidSchema } from '$lib/utils/zod.utils';
import { fail } from '@sveltejs/kit';
import type { GraphQLError } from 'graphql';
import { redirect } from 'sveltekit-flash-message/server';
import { setError, setMessage, superValidate } from 'sveltekit-superforms/server';

const log = new Logger('rule.update.server');

const updateRuleStore = new UpdateRuleStore();
export const actions = {
	default: async (event) => {
		const { params, request, locals } = event;
		const id = uuidSchema.parse(params.id);
		const session = await locals.getSession();
		if (session?.user == undefined) {
			throw redirect(307, `/auth/signin?callbackUrl=/dashboard/rules/${id}`);
		}

		const form = await superValidate(request, schema);
		log.debug({ form });

		// superform validation
		if (!form.valid) return fail(400, { form });

		log.debug('before cleanClone with null:', form.data);
		const dataCopy = cleanClone(form.data, { empty: 'null' });
		log.debug('after cleanClone with null:', dataCopy);

		const payload: rules_set_input = {
			...dataCopy,
			shared: true,
			...(dataCopy.throttleRate && { throttleRate: `${dataCopy.throttleRate}` })
		};
		const variables = { id, data: payload };
		log.debug('UPDATE action variables:', variables);
		const { errors, data } = await updateRuleStore.mutate(variables, {
			metadata: { logResult: true },
			event
		});
		if (errors) {
			errors.forEach((error) => {
				log.error('update rule api error', error);
				// NOTE: you can add multiple errors, send all along with a message
				if (error.message.includes('Uniqueness violation')) {
					setError(form, 'displayName', 'Display Name already taken');
				} else {
					setError(form, '', (error as GraphQLError).message);
				}
			});
			return setMessage(form, 'Update rule failed');
		}

		const result = data?.update_rules_by_pk;
		if (!result) return setMessage(form, 'Update rule failed: responce empty', { status: 404 });

		const message = {
			message: `Rule: ${result.displayName} updated`,
			dismissible: true,
			duration: 10000,
			type: ToastLevel.Success
		} as const;
		throw redirect(302, '/dashboard/rules', message, event);
	}
};
