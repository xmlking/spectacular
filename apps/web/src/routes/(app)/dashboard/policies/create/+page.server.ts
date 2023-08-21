import { CreatePolicyStore, type policies_insert_input } from '$houdini';
import { ToastLevel } from '$lib/components/toast';
import { createPolicySchema as schema } from '$lib/models/schema';
import { Logger, cleanClone } from '$lib/utils';
import { fail } from '@sveltejs/kit';
import type { GraphQLError } from 'graphql';
import { redirect } from 'sveltekit-flash-message/server';
import { setError, setMessage, superValidate } from 'sveltekit-superforms/server';

const log = new Logger('policy.create.server');

const createPolicyStore = new CreatePolicyStore();
export const actions = {
	default: async (event) => {
		const { request, locals } = event;
		const session = await locals.getSession();
		if (session?.user == undefined) {
			throw redirect(307, '/auth/signin?callbackUrl=/dashboard/policies/create');
		}

		const form = await superValidate(request, schema);
		log.debug({ form });

		// superform validation
		if (!form.valid) return fail(400, { form });

		// TODO: validate incoming data with business rules
		if (form.data.ruleId && form.data.rule.shared == false) {
			return setError(form, 'ruleId', 'Only shared rules are allowed to pick from. Chose a shared rule');
		}

		//const dataCopy = { ...form.data };
		log.debug('before cleanClone with strip:', form.data);
		const dataCopy = cleanClone(form.data, { empty: 'strip' });
		log.debug('after cleanClone with strip:', dataCopy);
		const {
			ruleId,
			rule: { throttleRate, ...ruleRest },
			...restPolicy
		} = dataCopy;
		const payload: policies_insert_input = {
			...restPolicy,
			...(ruleId
				? { ruleId }
				: {
						rule: {
							data: {
								...ruleRest,
								...(throttleRate && { throttleRate: `${throttleRate}` })
							}
						}
				  })
		};
		// if we are creating Policy with new Rule, overwrite Rule's weight with Policy's weight.
		if (payload.rule?.data && payload.weight) {
			payload.rule.data.weight = payload.weight;
		}
		log.debug('payload:', payload);

		const variables = { data: payload };
		const { errors, data } = await createPolicyStore.mutate(variables, {
			metadata: { logResult: true },
			event
		});
		if (errors) {
			errors.forEach((error) => {
				log.error('create policy api error', error);
				// NOTE: you can add multiple errors, send all along with a message
				if (error.message.includes('Uniqueness violation')) {
					setError(form, 'rule.displayName', 'Display Name already taken');
				} else {
					setError(form, '', (error as GraphQLError).message);
				}
			});
			return setMessage(form, 'Create policy failed');
		}

		const result = data?.insert_policies_one;
		if (!result) return setMessage(form, 'Create policy failed: responce empty', { status: 404 });

		// return message(form, 'Policy Created');
		const message = {
			message: `Policy created with Rule: ${result.rule.displayName}`,
			dismissible: true,
			duration: 10000,
			type: ToastLevel.Success
		} as const;
		throw redirect(302, '/dashboard/policies', message, event);
	}
};

async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
