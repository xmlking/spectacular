import { CreateRuleStore, type rules_insert_input } from '$houdini';
import { ToastLevel } from '$lib/components/toast';
import { createRuleSchema as schema } from '$lib/models/schema';
import { Logger, cleanClone } from '$lib/utils';
import { fail } from '@sveltejs/kit';
import type { GraphQLError } from 'graphql';
import { redirect } from 'sveltekit-flash-message/server';
import { setError, setMessage, superValidate } from 'sveltekit-superforms/server';

const log = new Logger('rule.create.server');

const createRuleStore = new CreateRuleStore();
export const actions = {
	default: async (event) => {
		const { request, locals } = event;
		const session = await locals.getSession();
		if (session?.user == undefined) {
			throw redirect(307, '/auth/signin?callbackUrl=/dashboard/rules/create');
		}

		const form = await superValidate(request, schema);
		log.debug({ form });

		// superform validation
		if (!form.valid) return fail(400, { form });

		log.debug('before cleanClone with strip:', form.data);
		const dataCopy = cleanClone(form.data, { empty: 'strip' });
		log.debug('after cleanClone with strip:', dataCopy);

		const payload: rules_insert_input = {
			...dataCopy,
			shared: true,
			...(dataCopy.throttleRate && { throttleRate: `${dataCopy.throttleRate}` })
		};
		const variables = { data: payload };
		log.debug('CREATE action variables:', variables);
		const { errors, data } = await createRuleStore.mutate(variables, {
			metadata: { logResult: true },
			event
		});
		if (errors) {
			errors.forEach((error) => {
				log.error('create rule api error', error);
				// NOTE: you can add multiple errors, send all along with a message
				if (error.message.includes('Uniqueness violation')) {
					setError(form, 'displayName', 'Display Name already taken');
				} else {
					setError(form, '', (error as GraphQLError).message);
				}
			});
			return setMessage(form, 'Create rule failed');
		}

		const result = data?.insert_rules_one;
		if (!result) return setMessage(form, 'Create rule failed: responce empty', { status: 404 });

		const message = {
			message: `Rule: ${result.displayName} created`,
			dismissible: true,
			duration: 10000,
			type: ToastLevel.Success
		} as const;
		throw redirect(302, '/dashboard/rules', message, event);
	}
};
