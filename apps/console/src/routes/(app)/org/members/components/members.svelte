<script lang="ts">
  import { run, stopPropagation } from 'svelte/legacy';

import { invalidate } from '$app/navigation';
import { page } from '$app/stores';
import { type MembersFragment, PendingValue, fragment, graphql } from '$houdini';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { loaded } from '$lib/graphql/loading';
import { getLoadingState } from '$lib/stores/loading';
import type { PartialGraphQLErrors } from '$lib/types';
import { Avatar, getToastStore, popup } from '@skeletonlabs/skeleton';
import { GraphQLErrors } from '$lib/ui/components';
import { ListBox, ListBoxItem } from '$lib/ui/components/listbox';
import * as Table from '$lib/ui/components/table';
import { cn } from '$lib/ui/utils';
import { Logger } from '@spectacular/utils';
import { DataHandler, type Row, check } from '@vincjo/datatables/legacy';
import { MoreHorizontal, Trash, UserCog } from 'lucide-svelte';
import type { MouseEventHandler } from 'svelte/elements';
import { fade, slide } from 'svelte/transition';
import { DeleteMember, UpdateMember } from '../mutations';
import Filter from './filter.svelte';

const log = new Logger('members:list:browser');

  interface Props {
    organization: MembersFragment;
  }

  let { organization }: Props = $props();
let data = $derived(fragment(
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
));
let { memberships } = $derived($data);
let flattenedMembers = $derived(memberships?.map(
  ({ userId, orgId, role, updatedAt, user: { displayName, avatarUrl, email } }) => ({
    userId,
    orgId,
    role,
    updatedAt,
    displayName,
    avatarUrl,
    email,
  }),
));

// Variables
const subjectRole = $page.data.role;
let gqlErrors: PartialGraphQLErrors = $state();
const toastStore = getToastStore();
const loadingState = getLoadingState();

//Datatable handler initialization
const handler = new DataHandler(flattenedMembers?.filter(loaded), {
  rowsPerPage: 5,
});
run(() => {
    handler.setRows(flattenedMembers);
  });
const rows = handler.getRows();

// Functions

/**
 * Delete Member action
 */
const handleDelete: MouseEventHandler<HTMLButtonElement> = async (event) => {
  const { userId, orgId, userName } = event.currentTarget.dataset;
  if (!userId || !orgId || !userName) {
    log.error('Misconfiguration: did you miss adding `data-user-id`, `data-org-id`, `data-user-name` attributes?');
    return;
  }

  const { data, errors } = await DeleteMember.mutate({ orgId, userId });
  if (errors) {
    gqlErrors = errors;
    log.error('handleDelete api error:', errors);
    return;
  }
  if (!data?.delete_memberships_by_pk) {
    handleMessage(
      { message: 'No responce from server: may be userId, orgId not found', type: 'error', timeout: 5000 },
      toastStore,
    );
    return;
  }

  // await invalidate(() => true);
  handleMessage({ message: `Member: ${userName} removed successfully`, type: 'success' }, toastStore);
};

/**
 * Update Member role action
 */
const handleUpdate: MouseEventHandler<HTMLButtonElement> = async (event) => {
  const { orgId, userId, role, userName } = event.currentTarget.dataset;
  if (!orgId || !userId || !role || !userName) {
    log.error('Misconfiguration: did you miss adding `data-user-id`, `data-org-id`, `data-role` attributes?');
    return;
  }
  // before
  loadingState.setFormLoading(true);
  const { data, errors } = await UpdateMember.mutate({ orgId, userId, role });
  if (errors) {
    gqlErrors = errors;
    log.error('handleUpdate api error:', errors);
    return;
  }
  if (!data?.update_memberships_by_pk) {
    handleMessage(
      { message: 'No responce from server: may be userId, orgId not found', type: 'error', timeout: 5000 },
      toastStore,
    );
    return;
  }
  // after
  loadingState.setFormLoading(false);
  // await invalidate(() => true);
  handleMessage({ message: `${userName} role changed to: ${role}`, type: 'success' }, toastStore);
};
</script>

<!-- GraphQL errors -->
{#if gqlErrors}
  <GraphQLErrors errors={gqlErrors} />
{/if}

<!-- Members List -->
<div class="w-full text-token card p-4 space-y-10">
  <!-- member filter header -->
  <header class="flex flex-col sm:flex-row gap-4">
    <Filter {handler} />
  </header>

  <!-- member list body -->
  <div class="grid gap-4 md:grid-cols-1">
    {#each $rows as member (member.userId)}
      <div
        class="card variant-soft-surface overflow-hidden p-3 md:p-4 transition-all shadow-md hover:shadow-xl flex justify-between items-center"
        transition:slide={{ duration: 300, axis: 'y' }}
      >
        <!-- Avatar Left -->
        <a href="/admin/users/{member.userId}" class="flex items-center space-x-4">
          <Avatar src={member.avatarUrl} width="w-12" />
          <div>
            <h3 class="font-semibold text-lg">{member.displayName}</h3>
            <p class="text-sm text-gray-500">{member.email}</p>
          </div>
        </a>

        <!-- Actions Right -->
        <div class="flex items-center align-middle gap-3">
          <!-- Role -->
          <span
            class="badge"
            class:variant-filled-primary={member.role === "org:member"}
            class:variant-filled-secondary={member.role === "org:admin"}
            class:variant-filled-warning={member.role === "org:billing"}
            class:variant-filled-error={member.role === "org:owner"}
          >
            {member.role}
          </span>
          <!-- Popover Trigger -->
          <button
            type="button"
            class="btn btn-sm hover:variant-soft"
            disabled={member.role === "org:owner"}
            use:popup={{ event: 'click', placement: 'bottom', target: 'actionPopup-' + member.userId }}
          >
            <MoreHorizontal size={20} />
          </button>
          <!-- Popover Content -->
          <div class="card w-48 shadow-xl py-2 z-50" data-popup="actionPopup-{member.userId}">
            <ListBox rounded="rounded-none" spacing="space-y-0" padding="px-4 py-1.5">
              <div class="px-2 py-1.5 text-sm text-gray-500">Change role to:</div>
              {#each ["org:admin", "org:billing", "org:member"] as role}
                {#if role !== member.role}
                  <ListBoxItem>
                      <button
                        type="button"
                        class="btn p-0 text-sm"
                        data-user-id={member.userId}
                        data-org-id={member.orgId}
                        data-role={role}
                        data-user-name={member.displayName}
                        disabled={subjectRole !== "org:owner"}
                        onclickcapture={stopPropagation(handleUpdate)}
                      >
                        <span><UserCog size={16} /></span>
                        <span>{role}</span>
                      </button>
                  </ListBoxItem>
                {/if}
              {/each}
              <div class="h-px bg-surface-300 my-1"></div>
              <ListBoxItem hover="bg-error-hover-token" regionDefault="text-error-600">
                <button type="button"
                    class="btn p-0 text-sm"
                  data-user-id={member.userId}
                  data-org-id={member.orgId}
                  data-user-name={member.displayName}
                  disabled={subjectRole !== "org:owner" && member.role !== "org:member"}
                  onclickcapture={stopPropagation(handleDelete)}
                >
                  <span><Trash size={16} /></span>
                  <span>Remove member</span>
                </button>
              </ListBoxItem>
            </ListBox>
            <div class="arrow bg-surface-100-800-token"></div>
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

