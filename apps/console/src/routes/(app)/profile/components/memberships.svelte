<script lang="ts">
import { PendingValue, type MembershipsFragment, fragment, graphql, cache } from '$houdini';
import { loaded } from '$lib/graphql/loading';
import * as Table from '@spectacular/skeleton/components/table';
import { DataHandler } from '@vincjo/datatables/legacy';
import { Logger } from '@spectacular/utils';
import { getToastStore, popup } from '@skeletonlabs/skeleton';
import { getLoadingState } from '$lib/stores/loading';
import { slide } from 'svelte/transition';
import { cn } from '@spectacular/skeleton/utils';
import { Check, MoreHorizontal, X } from 'lucide-svelte';
import { GraphQLErrors } from '@spectacular/skeleton';
import { invalidate, invalidateAll } from '$app/navigation';
import { page } from '$app/stores';
import { handleMessage } from '$lib/components/layout/toast-manager';
import type { PartialGraphQLErrors } from '$lib/types';
import type { MouseEventHandler } from 'svelte/elements';
import { LeaveOrganization } from '../mutations';
import { getNhostClient } from '$lib/stores/nhost';

const log = new Logger('profile:memberships:browser');

export let user: MembershipsFragment;
$: data = fragment(
  user,
  graphql(`
      fragment MembershipsFragment on users {
        allowedOrgs(order_by: { orgId: asc }) @list(name: "User_Org_Memberships") @loading(cascade: true) {
          userId
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

// Variables
let gqlErrors: PartialGraphQLErrors;
const nhost = getNhostClient();
const toastStore = getToastStore();
const loadingState = getLoadingState();

//Datatable handler initialization
const handler = new DataHandler(allowedOrgs?.filter(loaded), {
  rowsPerPage: 5,
});
$: handler.setRows(allowedOrgs);
const rows = handler.getRows();

// Functions

/**
 * Leave Membership action
 */
const leaveOrganization: MouseEventHandler<HTMLButtonElement> = async (event) => {
  const { userId, orgId, orgName } = event.currentTarget.dataset;
  console.log(event.currentTarget.dataset);
  if (!userId || !orgId || !orgName) {
    log.error('Misconfiguration: did you miss adding `data-user-id`, `data-org-id`, `data-org-name` attributes?');
    return;
  }
  const { data, errors } = await LeaveOrganization.mutate({ userId, orgId }, { metadata: { useRole: 'me' } });
  if (errors) {
    gqlErrors = errors;
    log.error('leaveOrganization api error:', errors);
    return;
  }
  if (!data?.delete_memberships_by_pk) {
    handleMessage(
      { message: 'No responce from server: may be orgId, userId not found', type: 'error', timeout: 5000 },
      toastStore,
    );
    return;
  }
  // after Membership removal, we need to flush cache, refresh session
  cache.markStale();
  await nhost.auth.refreshSession();
  await invalidateAll();
  handleMessage({ message: 'Leave organization successfully', type: 'success' }, toastStore);
};
</script>

{#if gqlErrors}
  <GraphQLErrors errors={gqlErrors} />
{/if}

<div class="card p-4 space-y-10">
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
        <Table.Head {handler} class="table-cell-fit">Actions</Table.Head>
      </tr>
    </thead>
    <tbody>
      {#each $rows as membership, i}
        {#if membership.orgId === PendingValue}
          <tr class="animate-pulse">
            <td><div class="placeholder" /></td>
            <td><div class="placeholder" /></td>
            <td><div class="placeholder" /></td>
            <td class="table-cell-fit text-center align-middle"><div class="placeholder" /></td>
          </tr>
        {:else}
          <tr transition:slide={{ duration: 300, axis: 'y' }}>
            <td>{membership.organization.displayName}</td>
            <td>{membership.organization.description}</td>
            <td>
              <span
                  class={cn(
                    "px-3 py-1 text-sm rounded-full",
                    membership.role === "org:owner" && "bg-purple-100 text-purple-700",
                    membership.role === "org:admin" && "bg-blue-100 text-blue-700",
                    membership.role === "org:member" && "bg-gray-100 text-gray-700",
                  )}
                >
                  {membership.role}
                </span>
            </td>
            <td class="table-cell-fit text-center align-middle">
              <button
                type="button"
                class="btn btn-sm variant-filled"
                use:popup={{ event: 'click', placement: 'bottom', target: 'actionPopup-' + i }}
              >
                <MoreHorizontal size={20} />
              </button>
              <!-- popup -->
              <div class="card w-48 shadow-xl py-2 z-50" data-popup="actionPopup-{i}">
                <nav class="list-nav">
                  <ul>
                    <li>
                      <button type="button"
                        class="btn w-full"
                        data-user-id={membership.userId}
                        data-org-id={membership.orgId}
                        data-org-name={membership.organization.displayName}
                        on:click|stopPropagation|capture={leaveOrganization}
                      >
                        <X class="w-5 justify-center" />
                        <p class="flex-grow text-justify">Leave</p>
                      </button>
                    </li>
                  </ul>
                </nav>
                  <div class="arrow bg-surface-100-800-token" />
              </div>
            </td>
          </tr>
        {/if}
      {:else}
        <tr>
          <td colspan="4"
            ><div class="text-center text-gray-500">
              No org memberships found.
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
