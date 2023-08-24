<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { goto, invalidateAll } from '$app/navigation';
	import { DeletePolicyStore, cache } from '$houdini';
	import { DeleteButton2, Link } from '$lib/components';
	import type { CustomEventProps } from '$lib/components/DeleteButton.svelte';
	import { ErrorMessage } from '$lib/components/form';
	import FormAlerts from '$lib/components/form/FormAlerts.svelte';
	import { DataTable } from '$lib/components/table';
	import { ToastLevel, addToast } from '$lib/components/toast';
	import { subjectTypeOptions } from '$lib/models/enums';
	import { Logger } from '$lib/utils';
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		ButtonGroup,
		NavBrand,
		Navbar,
		Select
	} from 'flowbite-svelte';
	import { GraphQLError } from 'graphql';
	import { createRender, createTable } from 'svelte-headless-table';
	import {
		addPagination,
		addResizedColumns,
		addSortBy,
		addTableFilter
	} from 'svelte-headless-table/plugins';
	import { IconOutline } from 'svelte-heros-v2';
	import { default as SelectFetch } from 'svelte-select';
	import { TimeDistance } from 'svelte-time-distance';
	import { writable } from 'svelte/store';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	const log = new Logger('policies:list:browser');
	export let data;
	$: ({ items } = data);
	$: itemsStore.set(items ?? []);

	const itemsStore = writable(items ?? []);
	const table = createTable(itemsStore, {
		page: addPagination({ initialPageSize: 5 }),
		resize: addResizedColumns(),
		tableFilter: addTableFilter({
			fn: ({ filterValue, value }) => {
				if ('' === filterValue) return true;

				return String(value).toLowerCase().includes(filterValue.toLowerCase());
			}
		}),
		sort: addSortBy()
		// filter: addTableFilter({ serverSide: true }),
		// select: addSelectedRows(),
		// resize: addResizedColumns()
	});

	const columns = table.createColumns([
		table.column({
			header: 'Rule Name',
			accessor: (item) => item,
			id: 'name',
			cell: ({ value }) =>
				createRender(Link, {
					url: `/dashboard/policies/${value.id}`,
					content: value.rule.displayName,
					title: value.rule.description
				}),
			plugins: {
				resize: { initialWidth: 400 },
				tableFilter: {
					getFilterValue: ({ rule }) => rule.displayName
				},
				sort: {
					getSortValue: ({ rule }) => rule.displayName
				}
			}
		}),
		table.column({
			header: 'Subject',
			accessor: 'subjectDisplayName',
			plugins: {
				resize: { disable: true }
			}
		}),
		table.column({
			header: 'Updated',
			accessor: 'updatedAt',
			cell: ({ value }) =>
				createRender(TimeDistance, {
					timestamp: value,
					class: 'decoration-solid'
				}),
			plugins: {
				resize: { disable: true },
				tableFilter: {
					exclude: true
				},
				sort: {
					getSortValue: (value) => value
				}
			}
		}),
		table.column({
			header: 'Source',
			id: 'source',
			accessor: (item) => `${item.rule.source ?? ''}:${item.rule.sourcePort ?? ''}`,
			plugins: {
				resize: { disable: true }
			}
		}),
		table.column({
			header: 'Destination',
			id: 'destination',
			accessor: (item) => `${item.rule.destination ?? ''}:${item.rule.destinationPort ?? ''}`,
			plugins: {
				resize: { disable: true }
			}
		}),
		table.column({
			header: 'Active',
			accessor: 'active',
			plugins: {
				resize: { disable: true },
				tableFilter: {
					exclude: true
				},
				sort: {
					getSortValue: (value) => value
				}
			}
		}),
		table.column({
			header: 'Shared',
			id: 'shared',
			accessor: (item) => item.rule.shared,
			plugins: {
				resize: { disable: true },
				tableFilter: {
					exclude: true
				},
				sort: {
					getSortValue: (value) => value
				}
			}
		}),
		table.column({
			header: 'Delete',
			id: 'delete',
			accessor: (item) => item,
			cell: ({ value }) =>
				createRender(DeleteButton2, { id: value.id, id2: value.rule.id })
					// .slot(value)
					.on('delete', handleDelete),
			plugins: {
				resize: { disable: true },
				tableFilter: {
					exclude: true
				},
				sort: {
					disable: true
				}
			}
		})
	]);

	const tableViewModel = table.createViewModel(columns);

	// Search form
	const superform = superForm(data.form, {
		dataType: 'json',
		taintedMessage: null,
		syncFlashMessage: false,
		onError({ result, message }) {
			// the onError event allows you to act on ActionResult errors.
			log.error('superForm', { result }, { message });
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
				`/dashboard/policies?subjectType=${$form.subjectType}&limit=${$form.limit}&offset=${$form.offset}`
			);
		}
	}

	// delete action
	const deletePolicyStore = new DeletePolicyStore();
	let busy = false;
	const handleDelete = async (e: CustomEvent<CustomEventProps>) => {
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
					addToast({
						message: `Policy and associated rule: ${data?.update_rules?.returning[0].displayName} deleted`,
						dismissible: true,
						duration: 10000,
						type: ToastLevel.Info
					});
					cache.markStale();
					await invalidateAll();
				} else if (data?.update_policies_by_pk) {
					addToast({
						message: `Policy ${data?.update_policies_by_pk.id} deleted`,
						dismissible: true,
						duration: 10000,
						type: ToastLevel.Info
					});
					cache.markStale();
					await invalidateAll();
				} else {
					addToast({
						message: `Policy not found for ID: ${id}`,
						dismissible: true,
						duration: 50000,
						type: ToastLevel.Error
					});
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

<Breadcrumb aria-label="Default breadcrumb example" class="mb-6">
	<BreadcrumbItem href="/dashboard" home>Home</BreadcrumbItem>
	<BreadcrumbItem href="/dashboard/policies">Policy</BreadcrumbItem>
	<BreadcrumbItem>Search Policies</BreadcrumbItem>
</Breadcrumb>

<form data-sveltekit-noscroll bind:this={searchForm}>
	<Navbar border={true} rounded={true}>
		<NavBrand>
			<IconOutline name="shield-check-outline" />
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
				Policies
			</span>
		</NavBrand>
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
						<IconOutline name="user-group-outline" />
					{:else if $form.subjectType == 'service_account'}
						<IconOutline name="user-circle-outline" />
					{:else if $form.subjectType == 'device'}
						<IconOutline name="device-phone-mobile-outline" />
					{:else if $form.subjectType == 'device_pool'}
						<IconOutline name="rectangle-group-outline" />
					{:else}
						<IconOutline name="user-outline" />
					{/if}
				</b>
				<svelte:fragment slot="input-hidden" let:value>
					<input type="hidden" name="subjectId" value={value ? value.id : null} />
					<input
						type="hidden"
						name="subjectDisplayName"
						value={value ? value.displayName : null}
					/>
				</svelte:fragment>
			</SelectFetch>
		</ButtonGroup>
		<Button href="/dashboard/policies/create">Add Policy</Button>
	</Navbar>
	<input name="limit" bind:value={$form.limit} type="hidden" />
	<input name="offset" bind:value={$form.offset} type="hidden" />
	<ErrorMessage error={$errors?.subjectType?.[0]} />
	<ErrorMessage error={$errors?.subjectId?.[0]} />
	<ErrorMessage error={$errors?.limit?.[0]} />
	<ErrorMessage error={$errors?.offset?.[0]} />
	<FormAlerts message={$message} errors={$errors._errors} />
</form>

{#if items}
	<DataTable {tableViewModel} />
{/if}

{#if dev}
	<br />
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
{/if}

<style lang="postcss">
	:global(td.matches) {
		background: rgba(46, 196, 182, 0.2);
	}
	:global(.sv-control) {
		--sv-min-height: 48px;
		border-radius: 0.5rem !important;
	}
</style>
