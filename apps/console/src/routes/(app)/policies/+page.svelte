<script lang="ts">
/* eslint-disable */ // FIXME: remove
import { GraphQLError } from 'graphql';
// import { default as SelectFetch } from 'svelte-select';
// import { TimeDistance } from 'svelte-time-distance';
import { DebugShell } from '@spectacular/skeleton/components';
import SuperDebug, { superForm } from 'sveltekit-superforms';
import { Logger } from '@spectacular/utils';
import { getToastStore } from '@skeletonlabs/skeleton';
import * as Form from '@spectacular/skeleton/components/form';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { goto, invalidateAll } from '$app/navigation';
import { browser, dev } from '$app/environment';
import { DeletePolicyStore, cache } from '$houdini';

const log = new Logger('policies:list:browser');
export let data;

const toastStore = getToastStore();

// Search form
const superform = superForm(data.form, {
	dataType: 'json',
	taintedMessage: null,
	syncFlashMessage: false,
	onError({ result }) {
		// the onError event allows you to act on ActionResult errors.
		// TODO:
		// message.set(result.error.message)
		log.error('policy superForm error:', { result });
	}
});
const { form, delayed, errors, constraints, message, tainted, posted, submitting } = superform;

let searchForm: HTMLFormElement;
let subject = $form.subjectId
	? {
			id: $form.subjectId,
			displayName: $form.subjectDisplayName,
			secondaryId: ''
		}
	: null;

async function fetchSubjects(filterText: string) {
	if (!filterText.length) return Promise.resolve([]);
	const response = await fetch(
		`/api/directory/search?subType=${$form.subjectType}&filter=&search=${filterText}`
	);
	if (!response.ok) throw new Error(`An error has occurred: ${response.status}`);
	const data = await response.json();
	if (!data) throw new Error('no data');
	return data.results;
}
async function clearSubject(event: Event) {
	subject = null;
	if (browser) {
		await goto(
			`/policies?subjectType=${$form.subjectType}&limit=${$form.limit}&offset=${$form.offset}`
		);
	}
}

// delete action
const deletePolicyStore = new DeletePolicyStore();
let busy = false;
const handleDelete = async (e: CustomEvent<any>) => {
	busy = true;
	try {
		if (e.detail.id) {
			const id = e.detail.id;
			const id2 = e.detail.id2;
			const deletedAt = new Date();
			const { data } = await deletePolicyStore.mutate({
				policyId: id,
				ruleId: id2,
				deletedAt
			});
			if (data?.update_policies_by_pk && data?.update_rules?.affected_rows) {
				handleMessage(
					{
						message: `Policy and associated rule: ${data?.update_rules?.returning[0].displayName} deleted`,
						hideDismiss: false,
						timeout: 10000,
						type: 'success'
					},
					toastStore
				);
				cache.markStale();
				await invalidateAll();
			} else if (data?.update_policies_by_pk) {
				handleMessage(
					{
						message: `Policy ${data?.update_policies_by_pk.id} deleted`,
						hideDismiss: false,
						timeout: 10000,
						type: 'success'
					},
					toastStore
				);
				cache.markStale();
				await invalidateAll();
			} else {
				handleMessage(
					{
						message: `Policy not found for ID: ${id}`,
						hideDismiss: false,
						timeout: 50000,
						type: 'error'
					},
					toastStore
				);
			}
		} else {
			log.error('id missing in event!');
		}
	} catch (err) {
		if (err instanceof GraphQLError) {
			log.error(err.message);
		} else {
			throw err;
		}
	} finally {
		busy = false;
	}
};
</script>

<svelte:head>
	<title>Policies</title>
	<meta name="description" content="policies" />
</svelte:head>

<form data-sveltekit-noscroll bind:this={searchForm}>
	<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
		Policies
	</span>
	<!--
		<ButtonGroup class="w-1/3">
			<Select
				name="subjectType"
				class="!w-fit !rounded-r-none"
				items={subjectTypeOptions}
				bind:value={$form.subjectType}
				on:change={clearSubject}
				placeholder="Select Type"
				data-invalid={$errors.subjectType}
				color={$errors.subjectType ? 'red' : 'base'}
				aria-invalid={Boolean($errors.subjectType)}
				aria-errormessage={Array($errors.subjectType).join('. ')}
				aria-required="{$constraints.subjectType?.required},"
				{...$constraints.subjectType}
			/>
			<SelectFetch
				class="w-auto !rounded-l-none !bg-gray-50 !px-2 dark:!bg-gray-700"
				itemId="displayName"
				label="displayName"
				bind:value={subject}
				on:change={() => searchForm.requestSubmit()}
				on:clear={clearSubject}
				loadOptions={fetchSubjects}
				--list-z-index="100"
			>
				<b slot="prepend" class="p-2">
					{#if $form.subjectType == 'group'}
						<UsersGroupOutline />
					{:else if $form.subjectType == 'service_account'}
						<UserCircleOutline />
					{:else if $form.subjectType == 'device'}
						<MobilePhoneOutline />
					{:else if $form.subjectType == 'device_pool'}
						<ComputerSpeakerOutline />
					{:else}
						<UserOutline />
					{/if}
				</b>
				<svelte:fragment slot="input-hidden" let:value>
					<input type="hidden" name="subjectId" value={value ? value.id : null} />
					<input type="hidden" name="subjectDisplayName" value={value ? value.displayName : null} />
				</svelte:fragment>
			</SelectFetch>
		</ButtonGroup>
 -->

	<input name="limit" bind:value={$form.limit} type="hidden" />
	<input name="offset" bind:value={$form.offset} type="hidden" />
	<Form.ErrorMessage error={$errors?.subjectType?.[0]} />
	<Form.ErrorMessage error={$errors?.subjectId?.[0]} />
	<Form.ErrorMessage error={$errors?.limit?.[0]} />
	<Form.ErrorMessage error={$errors?.offset?.[0]} />
	<Form.FormAlerts message={$message} errors={$errors._errors} />
</form>

<DebugShell>
	<SuperDebug
		label="Miscellaneous"
		status={false}
		data={{ message: $message, submitting: $submitting, delayed: $delayed, posted: $posted }}
	/>
	<br />
	<SuperDebug label="Form" data={$form} />
	<br />
	<SuperDebug label="Tainted" status={false} data={$tainted} />
	<br />
	<SuperDebug label="Errors" status={false} data={$errors} />
	<br />
	<SuperDebug label="Constraints" status={false} data={$constraints} />
	<!-- <br />
	<SuperDebug label="$page data" status={false} data={$page} /> -->
</DebugShell>

<style lang="postcss">
:global(td.matches) {
	background: rgba(46, 196, 182, 0.2);
}
:global(.sv-control) {
	--sv-min-height: 48px;
	border-radius: 0.5rem !important;
}
</style>
