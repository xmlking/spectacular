<script lang="ts">
import { invalidateAll } from '$app/navigation';
import { page } from '$app/stores';
import { PendingValue, type UserInvitationsFragment, cache, fragment, graphql } from '$houdini';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { loaded } from '$lib/graphql/loading';
import { getLoadingState } from '$lib/stores/loading';
import { getNhostClient } from '$lib/stores/nhost';
import type { PartialGraphQLErrors } from '$lib/types';
import { getToastStore, popup } from '@skeletonlabs/skeleton';
import { DateTime, GraphQLErrors } from '@spectacular/skeleton';
import * as Table from '@spectacular/skeleton/components/table';
import { cn } from '@spectacular/skeleton/utils';
import { Logger } from '@spectacular/utils';
import { DataHandler, type Row, check } from '@vincjo/datatables/legacy';
import { Check, MoreHorizontal, X } from 'lucide-svelte';
import type { MouseEventHandler } from 'svelte/elements';
import { slide } from 'svelte/transition';
import { AcceptInvitation, DeclineInvitation } from '../mutations';

const log = new Logger('user:profile:invitations:browser');

export let user: UserInvitationsFragment;
$: data = fragment(
  user,
  graphql(`
      fragment UserInvitationsFragment on users {
        invitations(order_by: { updatedAt: asc }) @list(name: "User_Org_Invitations") @loading(cascade: true) {
          email
          orgId
          inviter_name
          inviter_org_name
          role
          status
          updatedAt
        }
      }
    `),
);
$: ({ invitations } = $data);

// Variables
let gqlErrors: PartialGraphQLErrors;
const nhost = getNhostClient();
const toastStore = getToastStore();
const loadingState = getLoadingState();

//Datatable handler initialization
const handler = new DataHandler(invitations?.filter(loaded), {
  rowsPerPage: 5,
});
$: handler.setRows(invitations);
const rows = handler.getRows();

// Functions

/**
 * Accept Invitation action
 */
const acceptInvitation: MouseEventHandler<HTMLButtonElement> = async (event) => {
  const { email, orgId, orgName } = event.currentTarget.dataset;
  if (!email || !orgId || !orgName) {
    log.error('Misconfiguration: did you miss adding `data-email`, `data-org-id`, `data-org-name` attributes?');
    return;
  }

  const { data, errors } = await AcceptInvitation.mutate({ email, orgId }, { metadata: { useRole: 'me' } });
  if (errors) {
    gqlErrors = errors;
    log.error('acceptInvitation api error:', errors);
    return;
  }
  if (!data?.update_invitations_by_pk) {
    handleMessage(
      { message: 'No responce from server: may be orgId, email not found', type: 'error', timeout: 5000 },
      toastStore,
    );
    return;
  }

  // after Invitation accepted, we need to flush cache, refresh session
  cache.markStale();
  await nhost.auth.refreshSession();
  await invalidateAll();
  handleMessage({ message: 'Invitation accepted successfully', type: 'success' }, toastStore);
};

/**
 * Decline Invitation action
 */
const declineInvitation: MouseEventHandler<HTMLButtonElement> = async (event) => {
  const { email, orgId, orgName } = event.currentTarget.dataset;
  if (!email || !orgId || !orgName) {
    log.error('Misconfiguration: did you miss adding `data-email`, `data-org-id`, `data-org-name` attributes?');
    return;
  }
  // before
  loadingState.setFormLoading(true);
  const { data, errors } = await DeclineInvitation.mutate({ email, orgId }, { metadata: { useRole: 'me' } });
  if (errors) {
    gqlErrors = errors;
    log.error('declineInvitation api error:', errors);
    return;
  }
  if (!data?.update_invitations_by_pk) {
    handleMessage(
      { message: 'No responce from server: may be orgId, email not found', type: 'error', timeout: 5000 },
      toastStore,
    );
    return;
  }
  // refresh profile data  TODO: https://github.com/HoudiniGraphql/houdini/issues/891
  const user = cache.get('users', { id: $page.data.userId });
  user.markStale();
  // after
  loadingState.setFormLoading(false);
  await invalidateAll();
  handleMessage({ message: 'Invitation declined successfully', type: 'success' }, toastStore);
};
</script>

<!-- GraphQL errors -->
{#if gqlErrors}
  <GraphQLErrors errors={gqlErrors} />
{/if}

<!-- Invitations List -->
<div class="card p-4 space-y-10">
  <header class="flex justify-between">
    <Table.Search {handler} />
    <Table.RowsPerPage {handler} />
  </header>
  <table class="table table-hover table-compact w-full table-auto">
    <thead>
      <tr>
        <Table.Head {handler} orderBy="inviter_name">Inviter</Table.Head>
        <Table.Head {handler} orderBy="inviter_org_name">Organization</Table.Head>
        <Table.Head {handler} orderBy="role">Role</Table.Head>
        <Table.Head {handler} orderBy="updatedAt">Updated At</Table.Head>
        <Table.Head {handler} class="table-cell-fit">Actions</Table.Head>
      </tr>
    </thead>
    <tbody>
      {#each $rows as invitation, i}
        {#if invitation.orgId === PendingValue}
          <tr class="animate-pulse">
            <td><div class="placeholder" /></td>
            <td><div class="placeholder" /></td>
            <td><div class="placeholder" /></td>
            <td><div class="placeholder" /></td>
            <td class="table-cell-fit text-center align-middle"><div class="placeholder" /></td>
          </tr>
        {:else}
          <tr transition:slide={{ duration: 300, axis: 'y' }}>
            <td>{invitation.inviter_name}</td>
            <td>{invitation.inviter_org_name}</td>
            <td>
              <span
                  class={cn(
                    "px-3 py-1 text-sm rounded-full",
                    invitation.role === "org:owner" && "bg-purple-100 text-purple-700",
                    invitation.role === "org:admin" && "bg-blue-100 text-blue-700",
                    invitation.role === "org:member" && "bg-gray-100 text-gray-700",
                  )}
                >
                  {invitation.role}
                </span>
            </td>
            <td><DateTime distance time={invitation.updatedAt} /></td>
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
                        data-email={invitation.email}
                        data-org-id={invitation.orgId}
                        data-org-name={invitation.inviter_org_name}
                        on:click|stopPropagation|capture={acceptInvitation}
                      >
                        <Check class="w-5 justify-center" />
                        <p class="flex-grow text-justify">Accept</p>
                      </button>
                    </li>
                    <li>
                      <button type="button"
                        class="btn w-full"
                        data-email={invitation.email}
                        data-org-id={invitation.orgId}
                        data-org-name={invitation.inviter_org_name}
                        on:click|stopPropagation|capture={declineInvitation}
                      >
                        <X class="w-5 justify-center" />
                        <p class="flex-grow text-justify">Decline</p>
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
          <td colspan="5"
            ><div class="text-center text-gray-500">
              No org invitations found.
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
