<script lang="ts">
import { Avatar } from '@skeletonlabs/skeleton';
import * as Table from '@spectacular/skeleton/components/table';
import { DataHandler } from '@vincjo/datatables';
import type { PageData } from './$houdini';
import { Pencil } from 'lucide-svelte';
export let data: PageData;
$: ({ UsersList } = data);
const handler = new DataHandler(UsersList, { rowsPerPage: 10 });
const rows = handler.getRows();
$: handler.setRows(UsersList);
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
					<Table.Head {handler} orderBy="displayName">Avatar</Table.Head>
					<Table.Head {handler} orderBy="displayName">First name</Table.Head>
					<Table.Head {handler} orderBy="email">EMail</Table.Head>
					<Table.Head {handler} orderBy="metadata">Organization</Table.Head>
					<Table.Head {handler} orderBy="defaultRole">Role</Table.Head>
					<Table.Head {handler} >Edit</Table.Head>
				</tr>
			</thead>
			<tbody>
				{#each $rows as row}
					<tr>
						<td><Avatar src={row.avatarUrl} width="w-10" rounded="rounded-full" /></td>
						<td>{row.displayName}</td>
						<td>{row.email}</td>
						<td>{row.metadata?.default_org}</td>
						<td>{row.defaultRole}</td>
						<td>
            <button class="btn-icon bg-initial hover:variant-soft-primary">
              <a href="/delegation/{row.id}"><Pencil /></a>
            </button>
						</td>
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
