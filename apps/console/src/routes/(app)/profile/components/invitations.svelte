<script lang="ts">
import { fragment, graphql, PendingValue, type UserInvitationsFragment } from '$houdini';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { loaded } from '$lib/graphql/loading';
import { getLoadingState } from '$lib/stores/loading';
import { getToastStore } from '@skeletonlabs/skeleton';
import { Logger } from '@spectacular/utils';
import { invalidate } from '$app/navigation';
import { DataHandler, type Row, check } from '@vincjo/datatables/legacy';
import { MoreHorizontal, Trash, UserCog } from 'lucide-svelte';
import type { MouseEventHandler } from 'svelte/elements';
import { fade, slide } from 'svelte/transition';
import { cn } from '@spectacular/skeleton/utils';
import { AcceptInvitation, DeclineInvitation } from '../mutations';
import Filter from './filter.svelte';

const log = new Logger('memberships:search-results:browser');
// Variables

export let user: UserInvitationsFragment;
$: data = fragment(
  user,
  graphql(`
      fragment UserInvitationsFragment on users {
        invitations(order_by: { updatedAt: asc }) @list(name: "List_User_Invitations") {
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

const toastStore = getToastStore();
const loadingState = getLoadingState();

//Datatable handler initialization
const handler = new DataHandler(invitations?.filter(loaded), {
  rowsPerPage: 10,
});
$: handler.setRows(invitations);
const rows = handler.getRows();

// Functions
/**
 * Accept Invitation action
 */
let isDeleting = false;

const acceptInvitation: MouseEventHandler<HTMLButtonElement> = async (event) => {
  const { email, orgId, userDisplayName } = event.currentTarget.dataset;
  console.log(event.currentTarget.dataset);
  if (!email || !orgId) {
    log.error('Misconfiguration: did you miss adding `data-email`, `data-org-id` attributes?');
    return;
  }
  // before
  isDeleting = true;
  const { data, errors: gqlErrors } = await AcceptInvitation.mutate(
    { email, orgId },
    { metadata: { logResult: true, useRole: 'me' } },
  );
  if (gqlErrors) {
    handleMessage(
      {
        message: `Error deleting Membership : "${userDisplayName}", cause: ${gqlErrors[0].message} `,
        hideDismiss: false,
        timeout: 10000,
        type: 'error',
      },
      toastStore,
    );
    return;
  }
  if (data?.update_invitations_by_pk) {
    handleMessage(
      {
        message: `<p class="text-xl">Memebership : <span class="text-red-500 font-bold">${userDisplayName}</span> deleted</p>`,
        hideDismiss: false,
        timeout: 1000,
        type: 'success',
      },
      toastStore,
    );
  } else {
    handleMessage(
      {
        message: `Membership not found for : ${userDisplayName}`,
        hideDismiss: false,
        timeout: 50000,
        type: 'error',
      },
      toastStore,
    );
  }
  await invalidate(() => true);
  // after
  isDeleting = false;
};
/**
 * Decline Invitation action
 */

const declineInvitation: MouseEventHandler<HTMLButtonElement> = async (event) => {
  const { email, orgId } = event.currentTarget.dataset;
  console.log(event.currentTarget.dataset);
  if (!email || !orgId) {
    log.error('Misconfiguration: did you miss adding `data-email` `data-org-id` attributes?');
    return;
  }

  // before
  isDeleting = true;
  const { data, errors: gqlErrors } = await DeclineInvitation.mutate(
    { email, orgId },
    { metadata: { logResult: true, useRole: 'me' } },
  );
  if (gqlErrors) {
    handleMessage(
      {
        message: `Error while updating membership for:, cause: ${gqlErrors[0].message} `,
        hideDismiss: false,
        timeout: 10000,
        type: 'error',
      },
      toastStore,
    );
    return;
  }
  if (data?.update_invitations_by_pk) {
    handleMessage(
      {
        message: `<p class="text-xl">Membership : <span class="text-red-500 font-bold"> </span> role successfully updated to <span class="text-red-500 font-bold"> </span></p>`,
        hideDismiss: false,
        timeout: 10000,
        type: 'success',
      },
      toastStore,
    );
  } else {
    handleMessage(
      {
        message: `Membership not found for :`,
        hideDismiss: false,
        timeout: 50000,
        type: 'error',
      },
      toastStore,
    );
  }
  // after
  isDeleting = false;
};
let showActionsFor = '';
// Reactivity
$: loadingState.setFormLoading(isDeleting);
</script>

<!-- Filter Section -->
<Filter {handler} searchFields={['inviter_name', 'inviter_org_name']} />

<!-- Members List -->
<div class="bg-white rounded-lg shadow-sm border border-gray-200">
  <div class="divide-y divide-gray-200">
    {#each $rows as invite (invite.inviter_org_name)}
      <div transition:slide class="p-4 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <p class="text-sm text-gray-500">Invited to <span class="font-semibold uppercase">{invite.inviter_org_name}</span>  By <span class="font-semibold">{invite.inviter_name}</span></p>
        </div>

        <div class="flex items-center gap-3">
          <span
            class={cn(
              "px-3 py-1 text-sm rounded-full",
              invite.role === "org:owner" && "bg-purple-100 text-purple-700",
              invite.role === "org:admin" && "bg-blue-100 text-blue-700",
              invite.role === "org:member" && "bg-gray-100 text-gray-700",
            )}
          >
            {invite.role}
          </span>

          <!-- try button class class="p-2 hover:bg-gray-100 rounded-lg transition-colors" -->
          <div class="relative">
            <button
              on:click={() =>
                (showActionsFor =
                  showActionsFor === invite.orgId ? "" : invite.orgId)}
              class="btn hover:variant-ghost-success"
              disabled={invite.role === "org:owner"}
            >
              <MoreHorizontal size={20} />
            </button>

            {#if showActionsFor === invite.orgId}
              <div
                transition:fade
                class="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
              >

                  <button
                  class="w-full px-4 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    data-email={invite.email}
                    data-org-id={invite.orgId}
                    on:click|stopPropagation|capture={acceptInvitation}
                  >
                    <UserCog size={16} />
                    Accept
                  </button>
                  <button
                    class="w-full px-4 py-1.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    data-email={invite.email}
                    data-org-id={invite.orgId}
                    on:click|stopPropagation|capture={declineInvitation}
                    disabled={isDeleting}
                  >
                    <Trash size={16} />
                    Decline
                  </button>
                </div>
            {/if}
          </div>
        </div>
      </div>
    {:else}
      <div class="p-8 text-center text-gray-500">
        No records found matching your search criteria.
      </div>
    {/each}
  </div>
</div>
