<script lang="ts">
import { PendingValue, type UserOrgRolesFragment, fragment, graphql } from '$houdini';
import { loaded } from '$lib/graphql/loading';
import * as Table from '@spectacular/skeleton/components/table';
import { DataHandler } from '@vincjo/datatables/legacy';
import { UsersRound } from 'lucide-svelte';
import type { MouseEventHandler } from 'svelte/elements';
import { Logger } from '@spectacular/utils';
import { getNhostClient } from '$lib/stores/nhost';
import { i18n } from '$lib/i18n';
import { ROUTE_DASHBOARD } from '$lib/constants';

const log = new Logger('profile:user-org-roles:browser');

const nhost = getNhostClient();

export let user: UserOrgRolesFragment;
$: data = fragment(
  user,
  graphql(`
      fragment UserOrgRolesFragment on users {
        allowedOrgs(order_by: { orgId: asc }) @list(name: "User_Org_Roles") @loading(cascade: true) {
          orgId
          organization {
            displayName
            description
          }
          role
          isCurrentOrg
        }
      }
    `),
);
$: ({ allowedOrgs } = $data);

// Functions
const handleSwitchOrg: MouseEventHandler<HTMLButtonElement> = async (event) => {
  const { orgId, orgDisplayName } = event.currentTarget.dataset;
  if (!orgId || !orgDisplayName) {
    log.error('Misconfiguration: did you mess adding `data-org-id/data-org-display-name` attributes?');
    return;
  }
  const status = await nhost.switchOrg(orgId);
  if (status) {
    location.replace(i18n.resolveRoute(ROUTE_DASHBOARD));
  } else {
    log.error('org switch failed');
  }
};

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
          <Table.Head {handler} orderBy="isCurrentOrg"
            >isCurrentOrg</Table.Head
          >
          <th>Switch Org</th>
        </tr>
      </thead>
      <tbody>
        {#each $rows as role}
          {#if role.orgId === PendingValue}
            <tr class="animate-pulse">
              <td><div class="placeholder" /></td>
              <td><div class="placeholder" /></td>
              <td><div class="placeholder" /></td>
              <td><div class="placeholder" /></td>
              <td><div class="placeholder" /></td>
            </tr>
          {:else}
            <tr>
              <td>{role.organization.displayName}</td>
              <td>{role.organization.description}</td>
              <td>{role.role}</td>
              <td>{role.isCurrentOrg}</td>
              <td>
                <button
                  type="button"
                  class="btn-icon btn-icon-sm variant-filled-warning"
                  data-org-id={role.orgId}
                  data-org-display-name={role.organization.displayName}
                  on:click|stopPropagation|capture={handleSwitchOrg}
                  disabled={role.isCurrentOrg}
                >
                  <UsersRound />
                </button>
              </td>
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
