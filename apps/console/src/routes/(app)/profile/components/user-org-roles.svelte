<script lang="ts">
import { PendingValue, type UserOrgRolesFragment, fragment, graphql } from '$houdini';
import { loaded } from '$lib/graphql/loading';
import * as Table from '@spectacular/skeleton/components/table';
import { DataHandler } from '@vincjo/datatables';

export let user: UserOrgRolesFragment;
$: data = fragment(
  user,
  graphql(`
      fragment UserOrgRolesFragment on users {
        userOrgRoles(order_by: { organization: asc }) @list(name: "User_Org_Roles") @loading(cascade: true) {
          organization
          role
          isDefaultRole
        }
      }
  `),
);
$: ({ userOrgRoles } = $data);

//variables
const handler = new DataHandler(userOrgRoles?.filter(loaded), { rowsPerPage: 5 });
$: handler.setRows(userOrgRoles);
const rows = handler.getRows();
</script>

<div class="card p-4">
  <div class="page-container p-0">
    <header class="flex justify-between">
      <Table.Search {handler} />
      <Table.RowsPerPage {handler} />
    </header>
    <table class="table table-hover table-compact w-full table-auto">
      <thead>
        <tr>
          <Table.Head {handler} orderBy="organization">Organization</Table.Head>
          <Table.Head {handler} orderBy="role">Role</Table.Head>
          <Table.Head {handler} orderBy="isDefaultRole">isDefaultRole</Table.Head>
        </tr>
      </thead>
      <tbody>
        {#each $rows as role}
          {#if role.organization === PendingValue}
            <tr class="animate-pulse">
              <td><div class="placeholder" /></td>
              <td><div class="placeholder" /></td>
              <td><div class="placeholder" /></td>
            </tr>
          {:else}
          <tr>
            <td>{role.organization}</td>
            <td>{role.role}</td>
            <td>{role.isDefaultRole}</td>
          </tr>
          {/if}
        {:else}
          <tr>
            <td colspan="3"
              ><div class="text-center text-gray-500">
                No org roles found.
              </div></td
            >
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
