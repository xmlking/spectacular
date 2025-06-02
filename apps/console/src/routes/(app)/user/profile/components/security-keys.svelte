<script lang="ts">
import { fragment, graphql, type SecurityKeysFragment } from '$houdini';
import { loaded } from '$lib/graphql/loading';
import { Alerts } from '$lib/ui/components/form';
import { flip } from 'svelte/animate';
import { quintOut } from 'svelte/easing';
import { fade } from 'svelte/transition';
import SecurityKeyItem from './security-key.svelte';

export let user: SecurityKeysFragment;
$: data = fragment(
  user,
  graphql(`
      fragment SecurityKeysFragment on users {
        securityKeys(order_by: { nickname: asc })
          @list(name: "Security_Keys")
          @loading {
          ...SecurityKeyFragment @mask_disable
        }
      }
    `)
);

$: ({ securityKeys } = $data);

// Variables
let message: App.Superforms.Message | undefined;
let errors: string[] = [];
</script>

<!-- Form Level Errors / Messages -->
<Alerts {errors} {message} />
<div class="w-full text-token card p-4 space-y-4">
  <dl class="list-dl">
    {#each securityKeys.filter(loaded) as securityKey (securityKey.id)}
      <div
        transition:fade={{ duration: 450, easing: quintOut }}
        animate:flip={{ duration: 450, easing: quintOut }}
      >
        <SecurityKeyItem bind:message bind:errors {securityKey} />
      </div>
    {:else}
      <div class="text-center text-gray-500">No security keys found.</div>
    {/each}
  </dl>
</div>
