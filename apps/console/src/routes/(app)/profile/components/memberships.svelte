<script lang="ts">
import { PendingValue, type MembershipsFragment, fragment, graphql } from '$houdini';
import { loaded } from '$lib/graphql/loading';
import * as Table from '@spectacular/skeleton/components/table';
import { DataHandler } from '@vincjo/datatables/legacy';
import { Logger } from '@spectacular/utils';
import { getNhostClient } from '$lib/stores/nhost';

const log = new Logger('profile:memberships:browser');

const nhost = getNhostClient();

export let user: MembershipsFragment;
$: data = fragment(
  user,
  graphql(`
      fragment MembershipsFragment on users {
        allowedOrgs(order_by: { orgId: asc }) @list(name: "User_Org_Roles") @loading(cascade: true) {
          orgId
          organization {
            displayName
            description
          }
          role
        }
      }
    `),
);
$: ({ allowedOrgs } = $data);

// Functions

//variables
const handler = new DataHandler(allowedOrgs?.filter(loaded), {
  rowsPerPage: 5,
});
$: handler.setRows(allowedOrgs);
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
          <Table.Head {handler} orderBy="role">Description</Table.Head>
          <Table.Head {handler} orderBy="role">Role</Table.Head>
        </tr>
      </thead>
      <tbody>
        {#each $rows as role}
          {#if role.orgId === PendingValue}
            <tr class="animate-pulse">
              <td><div class="placeholder" /></td>
              <td><div class="placeholder" /></td>
              <td><div class="placeholder" /></td>
            </tr>
          {:else}
            <tr>
              <td>{role.organization.displayName}</td>
              <td>{role.organization.description}</td>
              <td>{role.role}</td>
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
