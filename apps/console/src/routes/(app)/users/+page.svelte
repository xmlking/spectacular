<script lang="ts">
import { Avatar } from '@skeletonlabs/skeleton';
import * as Table from '@spectacular/skeleton/components/table';
import { DataHandler } from '@vincjo/datatables';
import type { PageData } from './$houdini';
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
						<td>{row.metadata.default_org}</td>
						<td>{row.defaultRole}</td>
						<td><button class="btn hover:variant-soft-primary"><a href="./users/{row.id}"><svg
							xmlns="http://www.w3.org/2000/svg"
							class={`${$$props.class ?? 'h-6 w-6'} `}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
							/>
						</svg></a></button>
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
