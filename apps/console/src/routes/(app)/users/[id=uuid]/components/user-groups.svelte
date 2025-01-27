<script lang="ts">
import { dndzone } from 'svelte-dnd-action';
import { Plus, X } from 'lucide-svelte';
import { fragment, graphql, type UserGroupsFragment } from '$houdini';

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

// States for both lists
$: availableGroups = dissociatedGroups ?? [];
$: assignedGroups = associatedGroups ?? [];

// DND Configuration
const flipDurationMs = 300;
const dropTargetStyle = {
  // outline: "2px dashed #cbd5e1",
  outline: '2px dashed #A9A9A9',
};

function handleAvailableConsider(e: CustomEvent) {
  availableGroups = e.detail.items;
}

function handleAvailableFinalize(e: CustomEvent) {
  availableGroups = e.detail.items;
}

function handleAssignedConsider(e: CustomEvent) {
  assignedGroups = e.detail.items;
}

function handleAssignedFinalize(e: CustomEvent) {
  assignedGroups = e.detail.items;
}

function handleAdd(group: { id: string; displayName: string }) {
  availableGroups = availableGroups.filter((g) => g.id !== group.id);
  assignedGroups = [...assignedGroups, group];
}
function handleRemove(group: { id: string; displayName: string }) {
  assignedGroups = assignedGroups.filter((g) => g.id !== group.id);
  availableGroups = [...availableGroups, group];
}
</script>

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
          flipDurationMs,
          dragDisabled: false,
          dropFromOthersDisabled: false,
          dropTargetStyle,
        }}
        on:consider={handleAvailableConsider}
        on:finalize={handleAvailableFinalize}
    >
      {#each availableGroups as group (group.id)}
        <li class="list-option cursor-move justify-between">
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
          flipDurationMs,
          dragDisabled: false,
          dropFromOthersDisabled: false,
          dropTargetStyle,
        }}
        on:consider={handleAssignedConsider}
        on:finalize={handleAssignedFinalize}
    >
      {#each assignedGroups as group (group.id)}
        <li class="list-option cursor-move justify-between">
          <span class="flex-auto">{group.displayName}</span>
					<button class="hover:text-destructive" on:click={() => handleRemove(group)}>
						<X class="w-4 h-4" />
					</button>
        </li>
      {/each}
    </ul>
  </div>
</div>
