<script lang="ts">
	import { enhance } from '$app/forms';
	import { ArchiveBox } from 'svelte-heros-v2';

	export let id: string;
</script>

<form method="POST" action="?/delete" use:enhance>
	<input type="hidden" name="id" hidden value={id} />
	<!-- <button type="submit" on:click={(e) => !confirm('Are you sure?') && e.preventDefault()}> -->
	<button type="submit">
		<ArchiveBox class="text-pink-700 dark:text-blue-300" />
	</button>
</form>

<!-- <script lang="ts">
	// Paired with this form action
	import { DeleteRuleStore } from '$houdini';
	import { ToastLevel } from '$lib/components/toast';
	import { ruleDeleteSchema as schema } from '$lib/models/schema';
	import { Logger } from '$lib/utils';
	import { fail } from '@sveltejs/kit';
	import type { GraphQLError } from 'graphql';
	import { redirect } from 'sveltekit-flash-message/server';
	import { setError, setMessage, superValidate } from 'sveltekit-superforms/server';

	const log = new Logger('rule.action.server');

	const deleteRuleStore = new DeleteRuleStore();
	export const actions = {
		delete: async (event) => {
			const { request, locals } = event;
			const session = await locals.getSession();
			if (session?.user == undefined) {
				throw redirect(307, '/auth/signin?callbackUrl=/dashboard/rules');
			}

			const form = await superValidate(request, schema);
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
			throw redirect(302, '/dashboard/rules', message, event);
		}
	};
</script> -->
