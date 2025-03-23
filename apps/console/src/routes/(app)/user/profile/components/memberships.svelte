<script lang="ts">
  import { run, stopPropagation } from 'svelte/legacy';

import { invalidate, invalidateAll } from '$app/navigation';
import { page } from '$app/stores';
import { type MembershipsFragment, PendingValue, cache, fragment, graphql } from '$houdini';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { loaded } from '$lib/graphql/loading';
import { getLoadingState } from '$lib/stores/loading';
import { getNhostClient } from '$lib/stores/nhost';
import type { PartialGraphQLErrors } from '$lib/types';
import { getToastStore, popup } from '@skeletonlabs/skeleton';
import { GraphQLErrors } from '$lib/ui/components';
import * as Table from '$lib/ui/components/table';
import { cn } from '$lib/ui/utils';
import { Logger } from '@spectacular/utils';
import { DataHandler } from '@vincjo/datatables/legacy';
import { Check, MoreHorizontal, X } from 'lucide-svelte';
import type { MouseEventHandler } from 'svelte/elements';
import { slide } from 'svelte/transition';
import { LeaveOrganization } from '../mutations';

const log = new Logger('user:profile:memberships:browser');

  interface Props {
    user: MembershipsFragment;
  }

  let { user }: Props = $props();
let data = $derived(fragment(
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
));
let { allowedOrgs } = $derived($data);

// Variables
let gqlErrors: PartialGraphQLErrors = $state();
const nhost = getNhostClient();
const toastStore = getToastStore();
const loadingState = getLoadingState();

//Datatable handler initialization
const handler = new DataHandler(allowedOrgs?.filter(loaded), {
  rowsPerPage: 5,
});
run(() => {
    handler.setRows(allowedOrgs);
  });
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
            <td><div class="placeholder"></div></td>
            <td><div class="placeholder"></div></td>
            <td><div class="placeholder"></div></td>
            <td class="table-cell-fit text-center align-middle"><div class="placeholder"></div></td>
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
                        onclickcapture={stopPropagation(leaveOrganization)}
                      >
                        <X class="w-5 justify-center" />
                        <p class="flex-grow text-justify">Leave</p>
                      </button>
                    </li>
                  </ul>
                </nav>
                  <div class="arrow bg-surface-100-800-token"></div>
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
