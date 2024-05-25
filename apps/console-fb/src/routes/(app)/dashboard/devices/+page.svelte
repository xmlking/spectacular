<script lang="ts">
import {
	Breadcrumb,
	BreadcrumbItem,
	Button,
	ButtonGroup,
	Input,
	NavBrand,
	Navbar
} from 'flowbite-svelte';
import { MobilePhoneOutline, SearchOutline } from 'flowbite-svelte-icons';
import { createRender, createTable } from 'svelte-headless-table';
import { addPagination, addSortBy, addTableFilter } from 'svelte-headless-table/plugins';
import { TimeDistance } from 'svelte-time-distance';
import { writable } from 'svelte/store';
import SuperDebug, { superForm } from 'sveltekit-superforms';
import { Logger } from '@spectacular/utils';
import { DataTable } from '$lib/components/table';
import FormAlerts from '$lib/components/form/FormAlerts.svelte';
import { ErrorMessage } from '$lib/components/form';
import { Link } from '$lib/components';
import { dev } from '$app/environment';

const log = new Logger('devices:list:browser');
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
				url: `/dashboard/devices/${value.id}`,
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
		header: 'Version',
		accessor: 'version',
		plugins: {
			tableFilter: {
				exclude: true
			},
			sort: {
				disable: true
			}
		}
	}),
	table.column({
		header: 'IP',
		accessor: 'ip'
	}),
	table.column({
		header: 'Tags',
		accessor: 'tags'
	})
]);

const tableViewModel = table.createViewModel(columns);

// Search form
const superform = superForm(data.form, {
	dataType: 'json',
	taintedMessage: null,
	syncFlashMessage: false,
	onError({ result }) {
		// the onError event allows you to act on ActionResult errors.
		// TODO:
		// message.set(result.error.message)
		log.error('superForm:', { result });
	}
});
const { form, delayed, errors, constraints, message, tainted, posted, submitting } = superform;
</script>

<svelte:head>
	<title>Devices</title>
	<meta name="description" content="devices" />
</svelte:head>

<Breadcrumb aria-label="Default breadcrumb example" class="mb-6">
	<BreadcrumbItem href="/dashboard" home>Home</BreadcrumbItem>
	<BreadcrumbItem href="/dashboard/devices">Devices</BreadcrumbItem>
	<BreadcrumbItem>Search Devices</BreadcrumbItem>
</Breadcrumb>

<form data-sveltekit-noscroll>
	<Navbar border={true} rounded={true}>
		<NavBrand>
			<MobilePhoneOutline />
			<span class="self-center whitespace-nowrap px-1 text-xl font-semibold dark:text-white">
				Devices
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
			<Button type="submit" color="primary" class="!p-2.5"><SearchOutline size="md" /></Button
			>
		</ButtonGroup>
		<span />
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
