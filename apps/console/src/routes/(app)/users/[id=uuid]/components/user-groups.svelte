<script lang="ts">
import { dndzone } from 'svelte-dnd-action';
import { Plus, X } from 'lucide-svelte';
import { cache, fragment, graphql, type AddUserGroup$input, type UserGroupsFragment } from '$houdini';
import { AddUserGroup, DeleteUserGroup } from '../mutations';
import { getToastStore } from '@skeletonlabs/skeleton';
import { getLoadingState } from '$lib/stores/loading';
import type { PartialGraphQLErrors } from '$lib/types';
import { page } from '$app/stores';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { Logger } from '@spectacular/utils';
import { GraphQLErrors } from '@spectacular/skeleton';
import { flip } from 'svelte/animate';

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
  if (items.some((e) => e.id === groupId) && (await deleteUserGroup(groupId))) {
    availableGroups = items;
  }
}
async function handleAssignedFinalize(e: CustomEvent) {
  const {
    items,
    info: { id: groupId },
  } = e.detail;
  if (items.some((e) => e.id === groupId) && (await addUserGroup(groupId))) {
    assignedGroups = items;
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
    handleMessage({ message: 'No responce from server: may be userId. groupId not found', type: 'error' }, toastStore);
    return false;
  }
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
    handleMessage({ message: 'No responce from server: may be userId. groupId not found', type: 'error' }, toastStore);
    return false;
  }
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
        <li class="list-option cursor-move justify-between" animate:flip="{{duration: flipDurationMs}}">
          <span class="flex-auto">{group.displayName}</span>

					<button class="hover:text-destructive" on:click={() => handleAdd(group)}>
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
        <li class="list-option cursor-move justify-between" animate:flip="{{duration: flipDurationMs}}">
          <span class="flex-auto">{group.displayName}</span>
					<button class="hover:text-destructive" on:click={() => handleRemove(group)}>
						<X class="w-4 h-4" />
					</button>
        </li>
      {/each}
    </ul>
  </div>
</div>
