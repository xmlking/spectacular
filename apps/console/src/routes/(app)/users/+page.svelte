<script lang="ts">
import { Avatar } from '@skeletonlabs/skeleton';
import * as Table from '@spectacular/skeleton/components/table';
import { DataHandler } from '@vincjo/datatables/legacy';
import { loaded } from '$lib/graphql/loading';
import type { PageData } from './$houdini';

export let data: PageData;
$: ({ SearchUsersAll } = data);
$: ({ users } = $SearchUsersAll.data || { users: [] });

//Datatable handler initialization
const handler = new DataHandler(users?.filter(loaded), { rowsPerPage: 10 });
// const handler = new DataHandler(users, { rowsPerPage: 10 });
$: handler.setRows(users);
const rows = handler.getRows();
</script>

<div class="page-container">
	<div class="page-section">
		<header class="flex justify-between">
			<Table.Search {handler} />
			<Table.RowsPerPage {handler} />
		</header>
		<table class="table table-hover table-compact w-full table-auto">
			<thead>
				<tr>
          <Table.Head {handler} orderBy="avatarUrl">Avatar</Table.Head>
					<Table.Head {handler} orderBy="displayName">Name</Table.Head>
					<Table.Head {handler} orderBy="currentOrg">Organization</Table.Head>
					<Table.Head {handler} orderBy="defaultRole">Role</Table.Head>
					<Table.Head {handler} orderBy="email">Email</Table.Head>
					<Table.Head {handler} orderBy="phoneNumber">Phone</Table.Head>
					<Table.Head {handler} orderBy="lastSeen">Last Seen</Table.Head>
				</tr>
			</thead>
			<tbody>
				{#each $rows as row}
					<tr>
						<td><Avatar src={row.avatarUrl} width="w-10" rounded="rounded-full" /></td>
						<td> <a href="/users/{row.id}">{row?.displayName}</a></td>
						<td>{row?.currentOrg?.displayName}</td>
						<td>{row?.defaultRole}</td>
						<td>{row?.email}</td>
						<td>{row?.phoneNumber}</td>
						<td>{row?.lastSeen}</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<footer class="flex justify-between">
			<Table.RowCount {handler} />
			<Table.Pagination {handler} />
		</footer>
	</div>
</div>
