<script lang="ts">
	import { dev } from '$app/environment';
	import { invalidateAll } from '$app/navigation';
	import { cache, DeleteRuleStore } from '$houdini';
	import { DeleteButton, Link } from '$lib/components';
	import type { CustomEventProps } from '$lib/components/DeleteButton.svelte';
	import { ErrorMessage } from '$lib/components/form';
	import FormAlerts from '$lib/components/form/FormAlerts.svelte';
	import { DataTable } from '$lib/components/table';
	import { addToast, ToastLevel } from '$lib/components/toast';
	import { Logger } from '$lib/utils';
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		ButtonGroup,
		Input,
		Navbar,
		NavBrand
	} from 'flowbite-svelte';
	import { GraphQLError } from 'graphql';
	import { createRender, createTable } from 'svelte-headless-table';
	import { addPagination, addSortBy, addTableFilter } from 'svelte-headless-table/plugins';
	import { IconOutline } from 'svelte-heros-v2';
	import { TimeDistance } from 'svelte-time-distance';
	import { writable } from 'svelte/store';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	const log = new Logger('rules:list:browser');
	export let data;
	$: ({ items } = data);
	$: itemsStore.set(items ?? []);

	const itemsStore = writable(items ?? []);
	const table = createTable(itemsStore, {
		page: addPagination({ initialPageSize: 5 }),
		tableFilter: addTableFilter({
			fn: ({ filterValue, value }) => {
				if ('' === filterValue) return true;

				return String(value).toLowerCase().includes(filterValue.toLowerCase());
			}
		}),
		sort: addSortBy()
	});

	const columns = table.createColumns([
		table.column({
			header: 'Name',
			accessor: (item) => item,
			id: 'name',
			cell: ({ value }) =>
				createRender(Link, {
					url: `/dashboard/rules/${value.id}`,
					content: value.displayName,
					title: value.description
				}),
			plugins: {
				tableFilter: {
					getFilterValue: ({ displayName }) => displayName
				},
				sort: {
					getSortValue: ({ displayName }) => displayName
				}
			}
		}),
		table.column({
			header: 'Updated At',
			accessor: 'updatedAt',
			cell: ({ value }) =>
				createRender(TimeDistance, {
					timestamp: value,
					class: 'decoration-solid'
				}),
			plugins: {
				tableFilter: {
					exclude: true
				},
				sort: {
					getSortValue: (value) => value
				}
			}
		}),
		table.column({
			header: 'Updated By',
			accessor: 'updatedBy'
		}),
		table.column({
			header: 'Tags',
			accessor: 'tags'
		}),
		table.column({
			header: 'Delete',
			id: 'delete',
			accessor: 'id',
			cell: ({ value }) =>
				createRender(DeleteButton, { id: value })
					// .slot(value)
					.on('delete', handleDelete),
			// cell: ({ value }) => createRender(DeleteForm, { id: value }),
			plugins: {
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

	// delete action
	const deleteRuleStore = new DeleteRuleStore();
	let busy = false;
	const handleDelete = async (e: CustomEvent<CustomEventProps>) => {
		busy = true;
		try {
			if (e.detail.id) {
				const id = e.detail.id;
				const deletedAt = new Date();
				const { data } = await deleteRuleStore.mutate({ id, deletedAt });
				if (data?.update_rules_by_pk?.displayName) {
					addToast({
						message: `Rule: ${data?.update_rules_by_pk?.displayName} deleted. \n Policies: ${data?.update_policies?.affected_rows} deleted`,
						dismissible: true,
						duration: 10000,
						type: ToastLevel.Info
					});
					// await invalidate('/dashboard/rules');
					cache.markStale();
					await invalidateAll();
				} else {
					addToast({
						message: `Rule not found for ID: ${id}`,
						dismissible: true,
						duration: 10000,
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
	<title>Rules</title>
	<meta name="description" content="rules" />
</svelte:head>

<Breadcrumb aria-label="Default breadcrumb example" class="mb-6">
	<BreadcrumbItem href="/dashboard" home>Home</BreadcrumbItem>
	<BreadcrumbItem href="/dashboard/rules">Rules</BreadcrumbItem>
	<BreadcrumbItem>Search Rules</BreadcrumbItem>
</Breadcrumb>

<form data-sveltekit-noscroll>
	<Navbar border={true} rounded={true}>
		<NavBrand>
			<IconOutline name="scale-outline" />
			<span class="self-center whitespace-nowrap px-1 text-xl font-semibold dark:text-white">
				Golden Rules
			</span>
		</NavBrand>
		<ButtonGroup class="w-1/2">
			<Input
				name="displayName"
				bind:value={$form.displayName}
				autofocus
				class="input !rounded-r-none focus:outline-none"
				placeholder="Display Name"
				data-invalid={$errors.displayName}
				color={$errors.displayName ? 'red' : 'base'}
				aria-invalid={Boolean($errors.displayName)}
				aria-errormessage={Array($errors.displayName).join('. ')}
				aria-required="{$constraints.displayName?.required},"
				{...$constraints.displayName}
			/>
			<!-- <Select
				name="limit"
				items={limits}
				data-invalid={$errors.displayName}
				aria-invalid={Boolean($errors)}
				aria-errormessage={Array($errors.limit).join('. ')}
				aria-required="{$constraints.limit?.required},"
				{...$constraints.limit}
				bind:value={$form.limit}
				class="w-16 !rounded-none border-l-0"
			/> -->
			<input name="limit" bind:value={$form.limit} type="hidden" />
			<input name="offset" bind:value={$form.offset} type="hidden" />
			<Button type="submit" color="primary" class="!p-2.5"
				><IconOutline name="magnifying-glass-outline"  width="20" height="20" /></Button
			>
		</ButtonGroup>
		<Button href="/dashboard/rules/create">Add Rule</Button>
	</Navbar>
	<ErrorMessage error={$errors?.displayName?.[0]} />
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
