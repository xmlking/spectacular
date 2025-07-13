<script lang="ts">
import { Logger } from '@repo/utils';
import { Avatar, getToastStore, popup } from '@skeletonlabs/skeleton';
import { check, DataHandler, type Row } from '@vincjo/datatables/legacy';
import { MoreHorizontal, Trash, UserCog } from 'lucide-svelte';
import type { MouseEventHandler } from 'svelte/elements';
import { fade, slide } from 'svelte/transition';
import { invalidate } from '$app/navigation';
import { page } from '$app/stores';
import { fragment, graphql, type InvitationsFragment, PendingValue } from '$houdini';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { loaded } from '$lib/graphql/loading';
import { getLoadingState } from '$lib/stores/loading';
import type { PartialGraphQLErrors } from '$lib/types';
import { GraphQLErrors } from '$lib/ui/components';
import { ListBox, ListBoxItem } from '$lib/ui/components/listbox';
import * as Table from '$lib/ui/components/table';
import { cn } from '$lib/ui/utils';
import { DeleteInvite, UpdateInvite } from '../mutations';
import Filter from './filter.svelte';

const log = new Logger('invitations:list:browser');

export let organization: InvitationsFragment;
$: data = fragment(
  organization,
  graphql(`
      fragment InvitationsFragment on organizations {
        invitations(order_by: { updatedAt: asc }) @list(name: "List_Invitations") {
          email
          orgId
          role
          status
          updatedAt
        }
      }
    `)
);
$: ({ invitations } = $data);

// Variables
const subjectRole = $page.data.role;
let gqlErrors: PartialGraphQLErrors;
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
 * Delete Invitation action
 */
const handleDelete: MouseEventHandler<HTMLButtonElement> = async (event) => {
  const { orgId, email } = event.currentTarget.dataset;
  if (!orgId || !email) {
    log.error('Misconfiguration: did you miss adding `data-org-id`, `data-email` attributes?');
    return;
  }

  const { data, errors } = await DeleteInvite.mutate({ orgId, email });
  if (errors) {
    gqlErrors = errors;
    log.error('handleDelete api error:', errors);
    return;
  }
  if (!data?.delete_invitations_by_pk) {
    handleMessage(
      { message: 'No responce from server: may be orgId not found', type: 'error', timeout: 5000 },
      toastStore
    );
    return;
  }

  // await invalidate(() => true);
  handleMessage({ message: `Invitation to: ${email} removed successfully`, type: 'success' }, toastStore);
};

/**
 * Update Invitation role action
 */
const handleUpdate: MouseEventHandler<HTMLButtonElement> = async (event) => {
  const { orgId, email, role } = event.currentTarget.dataset;
  if (!orgId || !email || !role) {
    log.error('Misconfiguration: did you miss adding  `data-org-id`, `data-email`, `data-role` attributes?');
    return;
  }
  // before
  loadingState.setFormLoading(true);
  const { data, errors } = await UpdateInvite.mutate({ orgId, email, role });
  if (errors) {
    gqlErrors = errors;
    log.error('handleUpdate api error:', errors);
    return;
  }
  if (!data?.update_invitations_by_pk) {
    handleMessage(
      { message: 'No responce from server: may be userId, orgId not found', type: 'error', timeout: 5000 },
      toastStore
    );
    return;
  }
  // after
  loadingState.setFormLoading(false);
  // await invalidate(() => true);
  handleMessage({ message: `${email} role changed to: ${role}`, type: 'success' }, toastStore);
};
</script>

<!-- GraphQL errors -->
{#if gqlErrors}
  <GraphQLErrors errors={gqlErrors} />
{/if}

<!-- Invitations List -->
<div class="w-full text-token card p-4 space-y-10">
  <!-- invitation filter header -->
  <header class="flex flex-col sm:flex-row gap-4">
    <Filter {handler} searchFields={['email']} />
  </header>

  <!-- invitation list body -->
  <div class="grid gap-4 md:grid-cols-1">
    {#each $rows as invite (invite.email)}
      <div
        class="card variant-soft-surface overflow-hidden p-3 md:p-4 transition-all shadow-md hover:shadow-xl flex justify-between items-center"
        transition:slide={{ duration: 300, axis: 'y' }}
      >
        <!-- Avatar Left -->
        <div class="flex items-center gap-3">
          <Avatar initials={invite.email} width="w-12"></Avatar>
          <div>
            <h3 class="font-semibold text-lg">{invite.email}</h3>
            <p class="text-sm text-gray-500">
              <span
                class="badge"
                class:variant-filled-surface={invite.status === "pending"}
                class:variant-filled-success={invite.status === "accepted"}
                class:variant-filled-warning={invite.status === "declined"}
                >
                {invite.status}
              </span>
            </p>
          </div>
        </div>

        <!-- Actions Right -->
        <div class="flex items-center align-middle gap-3">
          <!-- Role -->
          <span
            class="badge"
            class:variant-filled-primary={invite.role === "org:member"}
            class:variant-filled-secondary={invite.role === "org:admin"}
            class:variant-filled-warning={invite.role === "org:billing"}
            class:variant-filled-error={invite.role === "org:owner"}
          >
            {invite.role}
          </span>
          <!-- Popover Trigger -->
          <button
            type="button"
            class="btn btn-sm hover:variant-soft"
            use:popup={{ event: 'click', placement: 'bottom', target: 'actionPopup-' + invite.email }}
          >
            <MoreHorizontal size={20} />
          </button>
          <!-- Popover Content -->
          <div class="card w-48 shadow-xl py-2 z-50" data-popup="actionPopup-{invite.email}">
            <ListBox rounded="rounded-none" spacing="space-y-0" padding="px-4 py-1.5">
              <div class="px-2 py-1.5 text-sm text-gray-500">Change role to:</div>
              {#each ["org:admin", "org:billing", "org:member"] as role}
                {#if role !== invite.role}
                  <ListBoxItem>
                      <button
                        type="button"
                        class="btn p-0 text-sm"
                        data-org-id={invite.orgId}
                        data-email={invite.email}
                        data-role={role}
                        disabled={subjectRole !== "org:owner"}
                        on:click|stopPropagation|capture={handleUpdate}
                      >
                        <span><UserCog size={16} /></span>
                        <span>{role}</span>
                      </button>
                  </ListBoxItem>
                {/if}
              {/each}
              <div class="h-px bg-surface-300 my-1" />
              <ListBoxItem hover="bg-error-hover-token" regionDefault="text-error-600">
                <button type="button"
                  class="btn p-0 text-sm"
                  data-org-id={invite.orgId}
                  data-email={invite.email}
                  disabled={subjectRole !== "org:owner" && invite.role !== "org:member"}
                  on:click|stopPropagation|capture={handleDelete}
                >
                  <span><Trash size={16} /></span>
                  <span>Remove member</span>
                </button>
              </ListBoxItem>
            </ListBox>
            <div class="arrow bg-surface-100-800-token" />
          </div>
        </div>
      </div>
    {:else}
      <p class="p-4 text-center opacity-60">
        No records found matching your search criteria.
      </p>
    {/each}
  </div>

  <!-- member list footer -->
  <footer class="flex justify-between">
    <Table.RowCount {handler} />
    <Table.Pagination {handler} />
  </footer>
</div>

