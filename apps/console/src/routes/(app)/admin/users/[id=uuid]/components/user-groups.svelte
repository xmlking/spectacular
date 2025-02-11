<script lang="ts">
import { page } from '$app/stores';
import { type AddUserGroup$input, type UserGroupsFragment, cache, fragment, graphql } from '$houdini';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { getLoadingState } from '$lib/stores/loading';
import type { PartialGraphQLErrors } from '$lib/types';
import { getToastStore } from '@skeletonlabs/skeleton';
import { GraphQLErrors } from '@spectacular/skeleton';
import { Logger } from '@spectacular/utils';
import { Plus, X } from 'lucide-svelte';
import { dndzone } from 'svelte-dnd-action';
import { flip } from 'svelte/animate';
import { AddUserGroup, DeleteUserGroup } from '../mutations';

const log = new Logger('user-groups.assign.browser');

export let user: UserGroupsFragment;
$: data = fragment(
  user,
  graphql(`
      fragment UserGroupsFragment on users {
        associatedGroups(order_by: { displayName: asc }) {
          displayName
          id
        }
        dissociatedGroups(order_by: { displayName: asc }) {
          displayName
          id
        }
      }
    `),
);

// Reactivity
$: ({ dissociatedGroups, associatedGroups } = $data);
$: availableGroups = dissociatedGroups ?? [];
$: assignedGroups = associatedGroups ?? [];
// Initialize tempAvailableGroups and tempAssignedGroups with IDs from dissociatedGroups and associatedGroups
  $: tempAvailableGroups = dissociatedGroups ? dissociatedGroups.map((group) => group.id) : [];
  $: tempAssignedGroups = associatedGroups ? associatedGroups.map((group) => group.id) : [];

// Variables
const toastStore = getToastStore();
const loadingState = getLoadingState();
const role = $page.data.role;
const userId = $page.params.id;

let gqlErrors: PartialGraphQLErrors;
// DND Configuration
const flipDurationMs = 300;
const dropTargetStyle = {
  // outline: "2px dashed #cbd5e1",
  outline: '2px dashed #A9A9A9',
};

// Functions
function handleAvailableConsider(e: CustomEvent) {
  availableGroups = e.detail.items;
}
function handleAssignedConsider(e: CustomEvent) {
  assignedGroups = e.detail.items;
}

async function handleAvailableFinalize(e: CustomEvent) {
  const {
    items,
    info: { id: groupId },
  } = e.detail;
  if (items.some((e) => e.id === groupId)) {
    availableGroups = items;
  }
  // Remove group from associatedGroups if dissociatedGroups does not include this group
  if(!tempAvailableGroups.includes(groupId))
  {
    await deleteUserGroup(groupId);
  }
}
async function handleAssignedFinalize(e: CustomEvent) {
  const {
    items,
    info: { id: groupId },
  } = e.detail;
  if (items.some((e) => e.id === groupId)) {
    assignedGroups = items;
  }
  // Add group to associatedGroups if associatedGroups does not include this group
  if(!tempAssignedGroups.includes(groupId))
  {
    await addUserGroup(groupId);
  }
}
async function handleAdd(group: { id: string; displayName: string }) {
  loadingState.setFormLoading(true);
  if (await addUserGroup(group.id)) {
    availableGroups = availableGroups.filter((g) => g.id !== group.id);
    assignedGroups = [...assignedGroups, group];
  }
  loadingState.setFormLoading(false);
}
async function handleRemove(group: { id: string; displayName: string }) {
  loadingState.setFormLoading(true);
  if (await deleteUserGroup(group.id)) {
    assignedGroups = assignedGroups.filter((g) => g.id !== group.id);
    availableGroups = [...availableGroups, group];
  }
  loadingState.setFormLoading(false);
}
async function addUserGroup(groupId: string) {
  const { errors, data } = await AddUserGroup.mutate({ userId, groupId });
  if (errors) {
    gqlErrors = errors;
    log.error('add user-group api call error:', errors);
    return false;
  }
  if (!data?.insert_user_groups_one) {
    handleMessage(
      { message: 'No responce from server: may be userId. groupId not found', type: 'error', timeout: 5000 },
      toastStore,
    );
    return false;
  }
  // Update tempAvailableGroups and tempAssignedGroups
  tempAssignedGroups = tempAssignedGroups.concat(data?.insert_user_groups_one?.groupId);
  tempAvailableGroups = tempAvailableGroups.filter((id) => id !== data?.insert_user_groups_one?.groupId);
  // const userGroup = cache.get('user_groups', { userId, groupId })
  // console.log({userGroup})
  // userGroup.markStale()
  return true;
}
async function deleteUserGroup(groupId: string) {
  const { errors, data } = await DeleteUserGroup.mutate({ userId, groupId });
  if (errors) {
    gqlErrors = errors;
    log.error('delete user-group api call error:', errors);
    return false;
  }
  if (!data?.delete_user_groups_by_pk) {
    handleMessage(
      { message: 'No responce from server: may be userId. groupId not found', type: 'error', timeout: 5000 },
      toastStore,
    );
    return false;
  }
  // Update tempAvailableGroups and tempAssignedGroups
  tempAvailableGroups = tempAvailableGroups.concat(data?.delete_user_groups_by_pk?.groupId);
  tempAssignedGroups = tempAssignedGroups.filter((id) => id !== data?.delete_user_groups_by_pk?.groupId);
  // const userGroup = cache.get('user_groups', { userId, groupId })
  // console.log({userGroup})
  // userGroup.markStale()
  return true;
}
</script>

{#if gqlErrors}
  <GraphQLErrors errors={gqlErrors} />
{/if}

<div class="grid md:grid-cols-2 gap-8">
	<!-- Available Groups -->
  <div class="card p-4">
    <header class="card-header">
      <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
        Available Groups
      </h2>
    </header>
    <ul
        class="list min-h-[200px]"
        use:dndzone={{
          items: availableGroups,
          type: 'groups',
          flipDurationMs,
          dragDisabled: false,
          dropFromOthersDisabled: false,
          dropTargetStyle,
        }}
        on:consider={handleAvailableConsider}
        on:finalize={handleAvailableFinalize}
    >
      {#each availableGroups as group (group.id)}
        <li class="card card-hover variant-soft-surface p-3 cursor-move !rounded-container-token" animate:flip="{{duration: flipDurationMs}}">
          <span class="flex-auto font-medium">{group.displayName}</span>
					<button class="btn-icon btn-icon-sm" on:click={() => handleAdd(group)}>
						 <Plus class="w-4 h-4" />
					</button>
        </li>
      {/each}
    </ul>
  </div>
	<!-- Assigned Groups -->
  <div class="card p-4">
    <header class="card-header">
      <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
        Assigned Groups
      </h2>
    </header>
    <ul
        class="list min-h-[200px]"
        use:dndzone={{
          items: assignedGroups,
          type: 'groups',
          flipDurationMs,
          dragDisabled: false,
          dropFromOthersDisabled: false,
          dropTargetStyle,
        }}
        on:consider={handleAssignedConsider}
        on:finalize={handleAssignedFinalize}
    >
      {#each assignedGroups as group (group.id)}
        <li class="card card-hover variant-soft-surface p-3 cursor-move !rounded-container-token" animate:flip="{{duration: flipDurationMs}}">
          <span class="flex-auto font-medium">{group.displayName}</span>
					<button class="btn-icon btn-icon-sm" on:click={() => handleRemove(group)}>
						<X class="w-4 h-4" />
					</button>
        </li>
      {/each}
    </ul>
  </div>
</div>
