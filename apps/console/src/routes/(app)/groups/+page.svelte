<script lang="ts">
	import { DataHandler } from '@vincjo/datatables';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms';
  import type { PopupSettings } from '@skeletonlabs/skeleton';
  import  { popup } from '@skeletonlabs/skeleton';
  import { Logger } from '@spectacular/utils';
	import { dev } from '$app/environment';
import * as Table from '@spectacular/skeleton/components/table';
	import { searchGroupKeys as searchKeys } from '$lib/schema/group.js';
  import { CircleAlert, Plus, Search, UsersRound } from 'lucide-svelte';

	const log = new Logger('groups:list:browser');

	export let data;

	$: ({ groups } = data);

	const {
		allErrors,
		form: formData,
		delayed,
		errors,
		constraints,
		capture,
		restore,
		message,
		tainted,
		posted,
		submitting
	} = superForm(data.form, {
		dataType: 'json',
		taintedMessage: null,
		onError({ result }) {
			log.error('Client-Side SuperForm error', { result });
		}
	});

	$: handler = new DataHandler(groups, { rowsPerPage: 10 });
	$: rows = handler.getRows();

	export const snapshot = { capture, restore };

  //
  const popupHover: PopupSettings = {
	event: 'hover',
	target: 'popupHover',
	placement: 'top'
};
</script>

<svelte:head>
	<title>Groups</title>
	<meta name="description" content="List of ThreatMatic™ User Groups" />
</svelte:head>


<div
	class=" flex items-center justify-between rounded-lg border border-gray-100 bg-white px-4 py-2.5 text-gray-700 shadow shadow-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
>
	<div class="flex items-center">
    <UsersRound  />
		<span class="self-center whitespace-nowrap px-1 text-xl font-semibold dark:text-white">
			Groups
		</span>
	</div>

	<form data-sveltekit-noscroll class="relative w-1/2">
		<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
			<Search />
		</div>
		<input
			type="search"
			id="default-search"
			name={searchKeys['displayName']}
			class="block w-full rounded-[2.5rem] border border-gray-300 bg-gray-50 p-4 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
			placeholder="Search Group Name"
			bind:value={$formData[searchKeys['displayName']]}
		/>
		<input
			name={searchKeys['limit']}
			bind:value={$formData[searchKeys['limit']]}
			type="hidden"
		/>
		<input
			name={searchKeys['offset']}
			bind:value={$formData[searchKeys['offset']]}
			type="hidden"
		/>
		<button
			type="submit"
			class="absolute bottom-2.5 end-2.5 rounded-3xl bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			disabled={!$tainted || $allErrors.length >= 1}
		>
			Search
		</button>
	</form>

	<a
		href="/dashboard/groups/create"
		class="flex items-center rounded-lg bg-blue-700 p-3 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
	>
    <Plus />
		Add Group
	</a>
</div>

{#if $message || ($errors && Object.keys($errors).length > 0)}
	<div
		class="my-2 flex items-center rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-gray-800 dark:text-red-400"
		role="alert"
	>
    <CircleAlert size="xl" />
		<div class="ml-2">
			{#if $message}
				<span class="flex font-bold">{$message}</span>
			{/if}
			{#if $errors?._errors}
				<ul class="ml-2 list-outside list-none">
					{#each $errors._errors as gqlErrorMsg}
						<li>
							{gqlErrorMsg
								.replace(/([a-z])([A-Z])/g, '$1 $2')
								.split(' ')
								.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
								.join(' ')}
						</li>
					{/each}
				</ul>
			{:else if $errors && Object.keys($errors).length > 0}
				<ul class="ml-2 list-outside list-none">
					{#each Object.keys($errors) as fieldName}
						<li class="font-semibold">
							{fieldName
								.replace(/([a-z])([A-Z])/g, '$1 $2')
								.split(' ')
								.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
								.join(' ')}
							Errors
						</li>
						<li>
							<ol class="ml-8 list-outside list-decimal">
								{#each $errors[fieldName] as fieldError}
									<li>{fieldError}</li>
								{/each}
							</ol>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
{/if}

<div class="mt-3 overflow-x-auto rounded-lg p-2 shadow-xl shadow-gray-500">
	<header class="mb-1 flex justify-between">
		<Table.Search {handler} />
		<Table.RowsPerPage {handler} />
	</header>

	<table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
		<thead
			class="bg-gray-200 text-xs uppercase text-gray-700 dark:bg-gray-900 dark:text-gray-400"
		>
			<tr>
				<Table.Head {handler} orderBy={'displayName'} class="w-1/6">
					Display Name
				</Table.Head>
				<Table.Head {handler} orderBy={'tags'} class="w-1/4">Tags</Table.Head>
				<Table.Head {handler} orderBy="created_by" class="w-1/6">Created By</Table.Head>
				<Table.Head {handler} orderBy="updated_at" class="w-1/6">Updated At</Table.Head>
			</tr>
			<tr>
				<Table.HeadFilter
					{handler}
					placeholder="Display Name"
					filterBy={'displayName'}
				>
					Display Name
				</Table.HeadFilter>

				<Table.HeadFilter {handler} placeholder="Tags" filterBy="tags">
					Tags
				</Table.HeadFilter>
				<Table.HeadFilter {handler} placeholder="Created By" filterBy="createdBy">
					Created By
				</Table.HeadFilter>
				<Table.HeadFilter {handler} placeholder="Updated At" filterBy="updatedAt">
					Updated At
				</Table.HeadFilter>
			</tr>
		</thead>
		<tbody>
			{#each $rows as { id, displayName, description, createdBy, tags, updatedAt }}
				<tr
					class="border-b odd:bg-gray-50 even:bg-white dark:border-gray-700 odd:dark:bg-gray-800 even:dark:bg-gray-900"
				>
					<td class="p-2">
						<a
							href={`/dashboard/groups/${id}`}
							class="font-medium text-blue-600 hover:underline dark:text-blue-500"
						>
							{displayName}
						</a>
						<snap use:popup={popupHover}>{description}</snap>
					</td>
					<td class="p-2">
						<div class="flex flex-wrap">
							{#each tags ?? [] as tag}
								<span
									class="me-1 mt-0.5 rounded-2xl bg-gray-200 px-1 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
								>
									{tag}
								</span>
							{/each}
						</div>
					</td>
					<td class="p-2">
						{createdBy}
					</td>
					<td class="p-2">
						{updatedAt}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<footer class="mt-1 flex items-center justify-between">
		<Table.RowCount {handler} />
		<Table.Pagination {handler} />
	</footer>
</div>

{#if dev}
	<SuperDebug
		label="SuperDebug"
		status={true}
		data={{
			$allErrors,
			$message,
			$submitting,
			$delayed,
			$posted,
			$formData,
			$tainted,
			$errors,
			$constraints,
			groups
		}}
	/>
{/if}
