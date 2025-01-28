<script lang="ts">
import { fragment, graphql, PendingValue, type MembersFragment } from '$houdini';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { loaded } from '$lib/graphql/loading';
import { getLoadingState } from '$lib/stores/loading';
import { Avatar, getToastStore } from '@skeletonlabs/skeleton';
import { Logger } from '@spectacular/utils';
import { invalidate } from '$app/navigation';
import { DataHandler, type Row, check } from '@vincjo/datatables/legacy';
import { MoreHorizontal, Trash, UserCog } from 'lucide-svelte';
import type { MouseEventHandler } from 'svelte/elements';
import { fade, slide } from 'svelte/transition';
import { cn } from '@spectacular/skeleton/utils';
import { DeleteMember, UpdateMember } from '../mutations';
import Filter from './filter.svelte';

const log = new Logger('memberships:search-results:browser');
// Variables

export let organization: MembersFragment;
$: data = fragment(
  organization,
  graphql(`
      fragment MembersFragment on organizations {
        memberships(order_by: { updatedAt: asc }) @list(name: "List_Members") {
          userId
          orgId
          role
          updatedAt
          user {
            displayName
            avatarUrl
            email
          }
        }
      }
    `),
);
$: ({ memberships } = $data);
$: flattenedMembers = memberships?.map(
  ({ userId, orgId, role, updatedAt, user: { displayName, avatarUrl, email } }) => ({
    userId,
    orgId,
    role,
    updatedAt,
    displayName,
    avatarUrl,
    email,
  }),
);

const toastStore = getToastStore();
const loadingState = getLoadingState();

//Datatable handler initialization
const handler = new DataHandler(flattenedMembers?.filter(loaded), {
  rowsPerPage: 10,
});
$: handler.setRows(flattenedMembers);
const rows = handler.getRows();

// Functions
/**
 * Delete Organization action
 */
let isDeleting = false;

const handleDelete: MouseEventHandler<HTMLButtonElement> = async (event) => {
  const { userId, orgId, userDisplayName } = event.currentTarget.dataset;
  console.log(event.currentTarget.dataset);
  if (!userId || !orgId) {
    log.error('Misconfiguration: did you miss adding `data-user-id`, `data-org-id` attributes?');
    return;
  }
  // before
  isDeleting = true;
  const { data, errors: gqlErrors } = await DeleteMember.mutate({
    orgId,
    userId,
  });
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
  if (data?.delete_memberships_by_pk) {
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
 * Update MemberShip role action
 */

const handleUpdate: MouseEventHandler<HTMLButtonElement> = async (event) => {
  const { orgId, userId, role, userDisplayName } = event.currentTarget.dataset;
  console.log(event.currentTarget.dataset);
  if (!orgId || !userId || !role) {
    log.error('Misconfiguration: did you miss adding `data-org-id` `data-user-id` `data-role` attributes?');
    return;
  }

  // before
  isDeleting = true;
  const { data, errors: gqlErrors } = await UpdateMember.mutate({
    orgId,
    userId,
    role,
  });
  if (gqlErrors) {
    handleMessage(
      {
        message: `Error while updating membership for: "${userDisplayName}", cause: ${gqlErrors[0].message} `,
        hideDismiss: false,
        timeout: 10000,
        type: 'error',
      },
      toastStore,
    );
    return;
  }
  if (data?.update_memberships_by_pk) {
    handleMessage(
      {
        message: `<p class="text-xl">Membership : <span class="text-red-500 font-bold">${userDisplayName}</span> role successfully updated to <span class="text-red-500 font-bold">${role}</span></p>`,
        hideDismiss: false,
        timeout: 10000,
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
  // after
  isDeleting = false;
};
let showActionsFor = '';
// Reactivity
$: loadingState.setFormLoading(isDeleting);
</script>

<!-- Filter Section -->
<Filter {handler} />

<!-- Members List -->
<div class="bg-white rounded-lg shadow-sm border border-gray-200">
  <div class="divide-y divide-gray-200">
    {#each $rows as member (member.userId)}
      <div transition:slide class="p-4 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <img
            src={member.avatarUrl}
            alt={member.displayName}
            class="w-10 h-10 rounded-full"
          />
          <div>
            <h3 class="font-medium text-gray-900"><a href="/users/{member.userId}">{member.displayName}</a></h3>
            <p class="text-sm text-gray-500">{member.email}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <span
            class="badge"
            class:variant-filled-primary={member.role === "org:member"}
            class:variant-fille-secondary={member.role === "org:admin"}
            class:variant-filled-error={member.role === "org:owner"}
          >
            {member.role}
          </span>

          <!-- try button class class="p-2 hover:bg-gray-100 rounded-lg transition-colors" -->
          <div class="relative">
            <button
              on:click={() =>
                (showActionsFor =
                  showActionsFor === member.userId ? "" : member.userId)}
              class="btn hover:variant-ghost-success"
              disabled={member.role === "org:owner"}
            >
              <MoreHorizontal size={20} />
            </button>

            {#if showActionsFor === member.userId}
              <div
                transition:fade
                class="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
              >
                <div class="px-2 py-1.5 text-sm text-gray-500">
                  Change role to:
                </div>
                {#each ["org:admin", "org:billing", "org:member"] as role}
                  {#if role !== member.role}
                    <button
                      class="w-full px-4 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      data-user-id={member.userId}
                      data-org-id={member.orgId}
                      data-role={role}
                      data-user-dispaly-name={member.displayName}
                      on:click|stopPropagation|capture={handleUpdate}
                    >
                      <UserCog size={16} />
                      {role}
                    </button>
                  {/if}
                {/each}
                <div class="h-px bg-gray-200 my-1" />
                <button
                  class="w-full px-4 py-1.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  data-user-id={member.userId}
                  data-org-id={member.orgId}
                  data-user-dispaly-name={member.displayName}
                  on:click|stopPropagation|capture={handleDelete}
                  disabled={isDeleting}
                >
                  <Trash size={16} />
                  Remove member
                </button>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {:else}
      <div class="p-8 text-center text-gray-500">
        No members found matching your search criteria.
      </div>
    {/each}
  </div>
</div>

<div class="w-full text-token card p-4 space-y-4">
  <dl class="list-dl">
    {#each $rows as member (member.userId)}
      <!-- Note: we insert an extra div element to control flex layout and aid with vertical list item spacing. -->
      <div class="list-option">
        <Avatar src={member.avatarUrl} width="w-10" />
        <span class="flex-auto">
          <dt class="font-bold">{member.displayName}</dt>
          <dd class="text-sm opacity-50">{member.email}</dd>
        </span>
        <span
          class="badge"
          class:variant-filled-primary={member.role === "org:member"}
          class:variant-fille-secondary={member.role === "org:admin"}
          class:variant-filled-error={member.role === "org:owner"}
        >
          {member.role}
        </span>
        <span>⋮</span>
      </div>
    {:else}
      <p class="p-4 text-center opacity-60">
        No members found matching your search criteria.
      </p>
    {/each}
  </dl>
</div>
