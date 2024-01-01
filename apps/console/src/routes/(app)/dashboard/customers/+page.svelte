<script lang="ts">
	import { DataHandler } from '@vincjo/datatables';
	import * as Table from '@spectacular/skeleton/components/table/index.ts';
	//Import data
	// export let data: PageData;
	// $: ({ customers } = data);
	import customers from './data';

	//Datatable handler initialization
	const handler = new DataHandler(customers, { rowsPerPage: 10 });
	const rows = handler.getRows();

	// $: handler.setRows(customers);
</script>

<div class="mx-[10%] my-4 space-y-2 overflow-x-auto">
	<header class="flex justify-between">
		<Table.Search {handler} />
		<Table.RowsPerPage {handler} />
	</header>

	<table class="table table-hover table-compact w-full table-auto">
		<thead>
			<tr>
				<Table.Head {handler} orderBy="first_name">First name</Table.Head>
				<Table.Head {handler} orderBy="last_name">Last name</Table.Head>
				<Table.Head {handler} orderBy="email">Email</Table.Head>
			</tr>
			<tr>
				<Table.HeadFilter {handler} filterBy="first_name" />
				<Table.HeadFilter {handler} filterBy="last_name" />
				<Table.HeadFilter {handler} filterBy="email" />
			</tr>
		</thead>
		<tbody>
			{#each $rows as row}
				<tr>
					<td>{row.first_name}</td>
					<td>{row.last_name}</td>
					<td>{row.email}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<footer class="flex justify-between">
		<Table.RowCount {handler} />
		<Table.Pagination {handler} />
	</footer>
</div>

<Table.Root {handler} search={true} rowsPerPage={true}>
	<table class="table table-hover table-compact w-full table-auto">
		<thead>
			<tr>
				<Table.Head orderBy="first_name">First Name</Table.Head>
				<Table.Head orderBy="last_name">Last Name</Table.Head>
				<Table.Head orderBy="email">Email</Table.Head>
			</tr>
			<tr>
				<Table.HeadFilter filterBy="first_name" />
				<Table.HeadFilter filterBy="last_name" />
				<Table.HeadFilter filterBy="email" />
			</tr>
		</thead>
		<tbody>
			{#each $rows as row}
				<tr>
					<td>{row.first_name}</td>
					<td>{row.last_name}</td>
					<td>{row.email}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</Table.Root>
