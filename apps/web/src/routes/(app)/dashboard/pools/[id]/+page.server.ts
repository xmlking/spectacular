import { UpdatePoolStore, type pools_set_input } from '$houdini';
import { ToastLevel } from '$lib/components/toast';
import { poolUpdateSchema as schema } from '$lib/models/schema';
import { Logger, cleanClone } from '$lib/utils';
import { uuidSchema } from '$lib/utils/zod.utils';
import { fail } from '@sveltejs/kit';
import type { GraphQLError } from 'graphql';
import { redirect } from 'sveltekit-flash-message/server';
import { setError, setMessage, superValidate } from 'sveltekit-superforms/server';

const log = new Logger('pool.update.server');

const updatePoolStore = new UpdatePoolStore();
export const actions = {
	default: async (event) => {
		const { params, request, locals } = event;
		const id = uuidSchema.parse(params.id);
		const session = await locals.getSession();
		if (session?.user == undefined) {
			throw redirect(307, `/auth/signin?callbackUrl=/dashboard/pools/${id}`);
		}

		const form = await superValidate(request, schema);
		log.debug({ form });

		// superform validation
		if (!form.valid) return fail(400, { form });

		log.debug('before cleanClone with null:', form.data);
		const dataCopy = cleanClone(form.data, { empty: 'null' });
		log.debug('after cleanClone with null:', dataCopy);

		const payload: pools_set_input = dataCopy;
		const variables = { id, data: payload };
		log.debug('UPDATE action variables:', variables);
		const { errors, data } = await updatePoolStore.mutate(variables, {
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
			return setMessage(form, 'Update pool failed');
		}

		const result = data?.update_pools_by_pk;
		if (!result) return setMessage(form, 'Update pool failed: response empty', { status: 404 });

		const message = {
			message: `Pool ${result.displayName} updated`,
			dismissible: true,
			duration: 10000,
			type: ToastLevel.Success
		} as const;
		throw redirect(302, '/dashboard/pools', message, event);
	}
};
