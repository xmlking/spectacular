<script lang="ts">
import {
  cache,
  type UserData$result,
  type UserGroupsFragment,
  fragment,
  graphql,
  type users_set_input,
  PendingValue,
} from '$houdini';
import { crossfade } from 'svelte/transition';
import { ArrowLeftIcon, ArrowRightIcon, Plus } from 'lucide-svelte';
import { writable } from 'svelte/store';
import { AddUser_Group, DeleteUser_Group } from '../mutations';
import { invalidateAll } from '$app/navigation';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { getToastStore, popup } from '@skeletonlabs/skeleton';
import { dndzone, type DndEvent } from 'svelte-dnd-action';
import { Logger } from '@spectacular/utils';
const log = new Logger('user:groups:browser');

export let user: UserGroupsFragment;
$: data = fragment(
  user,
  graphql(`
      fragment UserGroupsFragment on users @loading(cascade: true) {
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

// Variables
const toastStore = getToastStore();
// Initial maps data using writable stores
const map1 = writable(
  dissociatedGroups?.map((group) => ({
    id: group.id,
    name: group.displayName,
  })) ?? [],
);
const map2 = writable(
  associatedGroups?.map((group) => ({
    id: group.id,
    name: group.displayName,
  })) ?? [],
);
let tempMap1: string[] = dissociatedGroups?.map((group) => group.id) || [];
let tempMap2: string[] = associatedGroups?.map((group) => group.id) || [];
// Flip between considering as items from list 1 or 2
function handleDndConsider(e: CustomEvent<{ items: any[] }>, targetList: 'map1' | 'map2') {
  const { items } = e.detail;
  if (targetList === 'map1') {
    map1.set(items);
  } else {
    map2.set(items);
  }
}

// When the dnd operation finalize - update both lists
async function handleDndFinalize(e: CustomEvent<DndEvent<any>>, sourceList: 'map1' | 'map2') {
  const { items, info } = e.detail;
  const item = items.find((i) => i.id === info.id);
  if (sourceList === 'map1' && item && !tempMap1.includes(item.id)) {
    await deleteusergroups(item.id, item.name);
  }
  if (sourceList === 'map2' && item && !tempMap2.includes(item.id)) {
    await addusergroups(item.id, item.name);
  }
  if (sourceList === 'map1') {
    map1.set(items);
  } else {
    map2.set(items);
  }
}
async function addusergroups(groupId: string, name: string) {
  const group = {
    userId: user?.id,
    groupId: groupId,
  };
  const { errors, data } = await AddUser_Group.mutate({ group: group });
  if (errors) {
    handleMessage(
      {
        message: `Error Adding Groups : "${user?.displayName}", cause: ${errors[0].message} `,
        hideDismiss: false,
        timeout: 10000,
        type: 'error',
      },
      toastStore,
    );
    return;
  } else if (data?.insert_user_groups_one) {
    // Reset tempMap2
    tempMap2.push(data?.insert_user_groups_one?.groupId);
    tempMap1 = tempMap1.filter((id) => id !== data?.insert_user_groups_one?.groupId);
    handleMessage(
      {
        message: `<p class="text-xl">Group <span class="text-green-800 font-bold">${name}</span> added successfully for user: <span class="font-bold">${user?.displayName}</span></p>`,
        hideDismiss: false,
        timeout: 3000,
        type: 'success',
      },
      toastStore,
    );
  } else {
    handleMessage(
      {
        message: `User not found for ID: ${user?.id}`,
        hideDismiss: false,
        timeout: 50000,
        type: 'error',
      },
      toastStore,
    );
  }
}
async function deleteusergroups(groupId: string, name: string) {
  const { errors, data } = await DeleteUser_Group.mutate({
    userId: user?.id,
    groupId: groupId,
  });
  if (errors) {
    handleMessage(
      {
        message: `Error Adding Groups : "${user?.displayName}", cause: ${errors[0].message} `,
        hideDismiss: false,
        timeout: 10000,
        type: 'error',
      },
      toastStore,
    );
    return;
  } else if (data?.delete_user_groups_by_pk) {
    // Reset tempMap1
    tempMap1.push(data?.delete_user_groups_by_pk?.groupId);
    tempMap2 = tempMap2.filter((id) => id !== data?.delete_user_groups_by_pk?.groupId);
    handleMessage(
      {
        message: `<p class="text-xl">Group <span class="text-red-500 font-bold">${name}</span> deleted successfully for user: <span class="font-bold">${user?.displayName}</span></p>`,
        hideDismiss: false,
        timeout: 3000,
        type: 'success',
      },
      toastStore,
    );
  } else {
    handleMessage(
      {
        message: `User not found for ID: ${user?.id}`,
        hideDismiss: false,
        timeout: 50000,
        type: 'error',
      },
      toastStore,
    );
  }
}
// Configuration for dnd zones
const flipDurationMs = 300;
function getDndOptions(list: any[]) {
  return {
    items: list,
    flipDurationMs,
    dragDisabled: false,
    dropFromOthersDisabled: false,
  };
}
</script>

<div class="page-container">
  <h1 class="text-2xl font-bold text-center mb-8">Drag and Drop Groups</h1>

  <div class="grid md:grid-cols-2 gap-4">
    <!-- Left List -->
    <div
      class="max-h-[500px] flex flex-col variant-ghost-surface rounded-lg space-y-6 p-4 shadow-md"
    >
      <h1 class="pb-4 text-xl font-semibold tracking-tight">
        Available Groups
      </h1>
      <div class="flex-1 overflow-hidden">
        <ul
          use:dndzone={getDndOptions($map1)}
          on:consider={(e) => handleDndConsider(e, "map1")}
          on:finalize={(e) => handleDndFinalize(e, "map1")}
          class="space-y-2 h-full overflow-y-auto pr-2"
        >
          {#if $map1?.length === 0}
            <div class="text-center p-4 text-zinc-500 dark:text-zinc-400">
              No groups available
            </div>
          {/if}
          {#each $map1 as item (item.id)}
            <li
              class="flex items-center justify-between p-2 rounded-lg border bg-card hover:scale-[1.02] cursor-move h-14"
            >
              <span>{item.name}</span>
            </li>
          {/each}
        </ul>
      </div>
    </div>

    <!-- Right List -->
    <div
      class="max-h-[500px] flex flex-col variant-ghost-surface rounded-lg space-y-6 p-4 shadow-md"
    >
      <h1 class="pb-4 text-xl font-semibold tracking-tight">Existing Groups</h1>
      <div class="flex-1 overflow-hidden">
        <ul
          use:dndzone={getDndOptions($map2)}
          on:consider={(e) => handleDndConsider(e, "map2")}
          on:finalize={(e) => handleDndFinalize(e, "map2")}
          class="space-y-2 h-full overflow-y-auto pr-2"
        >
          {#if $map2.length === 0}
            <div class="text-center p-4 text-zinc-500 dark:text-zinc-400">
              Drag groups here
            </div>
          {/if}
          {#each $map2 as item (item.id)}
            <li
              class="flex items-center justify-between p-2 rounded-lg border bg-card hover:scale-[1.02] cursor-move h-14"
            >
              <span>{item.name}</span>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
</div>
