# zodfd

Isomorphic preprocessing library for [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData), [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) or SvelteKit's [params](https://kit.svelte.dev/docs/load#page-data) for validating with [zod](https://github.com/colinhacks/zod) for **CRUD** operations.

Built based on [zod-form-data](https://github.com/airjp73/remix-validated-form/tree/main/packages/zod-form-data#readme)

## Highlights

- [x] All capabilities of [zod-form-data](https://github.com/airjp73/remix-validated-form/tree/main/packages/zod-form-data#readme)
- [x] Isomorphic - support client-side and server-side validation
- [x] Preprocess _FormData/URLSearchParams/Params_ with remove **empty** fields (for CRUD create operation)
- [x] Preprocess _FormData/URLSearchParams/Params_ with set **empty** fields to `null` (for CRUD update operation)
- [ ] Preprocess _FormData/URLSearchParams/Params_ with set **target** fields to `null` or remove

## Usage

CRUD FormData validation usecase:

```ts
/**
 * Loader
 */
import { CachePolicy, DeletePolicyStore, order_by, SearchPoliciesStore, CreatePolicyStore, UpdatePolicyStore } from '$houdini';
import { handleActionErrors, handleLoadErrors, PolicyError } from '$lib/errors';
import { fail } from '@sveltejs/kit';
import { policyDeleteSchema, policySearchSchema, policyCreateSchema, policyUpdateSchema } from '$lib/models/schema';
import { zfd } from '$lib/zodfd';
import type { GraphQLError } from 'graphql';

const searchPoliciesStore = new SearchPoliciesStore();
const deletePolicyStore = new DeletePolicyStore();
const createPolicyStore = new CreatePolicyStore();
const updatePolicyStore = new UpdatePolicyStore();

const searchSchema = zfd.formData(policySearchSchema, { empty: 'strip' });

export async function load(event) {
	const { url, parent } = event;
	try {
		const { limit, offset, subjectType, displayName } = searchSchema.parse(url.searchParams);

		const orderBy = [{ updated_at: order_by.desc_nulls_first }];
		const where = {
			deleted_at: { _is_null: true },
			subjectType: { _eq: subjectType },
			...(subjectType ? { subjectType: { _eq: subjectType } } : {}),
			...(displayName ? { displayName: { _like: `%${displayName}%` } } : {})
		};
		const variables = { where, limit, offset, orderBy };

		const { errors, data } = await searchPoliciesStore.fetch({
			event,
			blocking: true,
			policy: CachePolicy.CacheAndNetwork,
			metadata: { backendToken: 'token from TokenVault', useRole: 'manager' },
			variables
		});

		if (errors) throw new PolicyError('SEARCH_POLICY_ERROR', 'list policies api error', errors[0] as GraphQLError);

		const {
			counts: { aggregate: count },
			policies: policies
		} = data;

		return { count, policies };
	} catch (err) {
		return handleLoadErrors(err);
	}
}

/**
 * Actions
 */
const deleteSchema = zfd.formData(policyDeleteSchema);
const createSchema = zfd.formData(policyCreateSchema, { empty: 'strip' });
const updateSchema = zfd.formData(policyUpdateSchema, { empty: 'null' });

export const actions = {
	delete: async ({ request, fetch }) => {
		try {
			const formData = await request.formData();
			const { id } = deleteSchema.parse(formData);

			const variables = { id };

			const { errors, data } = await deletePolicyStore.mutate(variables, {
				metadata: { backendToken: 'token from TokenVault', useRole: 'manager' },
				fetch
			});

			if (errors) throw new PolicyError('DELETE_POLICY_ERROR', 'delete policy api error', errors[0] as GraphQLError);

			const actionResult = data.delete_policies_by_pk;

			return {
				actionResult
			};
		} catch (err) {
				return handleActionErrors(err);
			}
		}
	}

	create: async ({ request, fetch }) => {
		try {
			const formData = await request.formData();
			const payload = createSchema.parse(formData);
			const variables = { data: payload };

			const { errors, data } = await createPolicyStore.mutate(variables, {fetch});

			if (errors) throw new PolicyError('CREATE_POLICY_ERROR', 'create policy api error', errors[0] as GraphQLError);

			const actionResult = data.insert_policies_one;
			return {
				actionResult
			};
		} catch (err) {
				return handleActionErrors(err);
			}
		}
	}

	update: async ({ request, fetch }) => {
		try {
			const formData = await request.formData();
			const payload = updateSchema.parse(formData);
			const variables = { data: payload };

			const { errors, data } = await updatePolicyStore.mutate(variables, {fetch});

			if (errors) throw new PolicyError('UPDATE_POLICY_ERROR', 'update policy api error', errors[0] as GraphQLError);

			const actionResult = data.update_policies_by_pk;
			return {
				actionResult
			};
		} catch (err) {
				return handleActionErrors(err);
			}
		}
	}
}

```
