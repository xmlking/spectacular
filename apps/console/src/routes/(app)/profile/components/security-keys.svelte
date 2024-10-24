<script lang="ts">
import { type SecurityKeysFragment, fragment, graphql } from '$houdini';
import { loaded } from '$lib/graphql/loading';
import { Alerts } from '@spectacular/skeleton/components/form';
import { flip } from 'svelte/animate';
import { quintOut } from 'svelte/easing';
import { fade } from 'svelte/transition';
import SecurityKeyItem from './security-key.svelte';

  interface Props {
    user: SecurityKeysFragment;
  }

  let { user }: Props = $props();
let data = $derived(fragment(
  user,
  graphql(`
      fragment SecurityKeysFragment on users {
        securityKeys(order_by: { nickname: asc })
          @list(name: "Security_Keys")
          @loading {
          ...SecurityKeyFragment @mask_disable
        }
      }
    `),
));

let { securityKeys } = $derived($data);

// Variables
let message: App.Superforms.Message | undefined = $state();
let errors: string[] = $state([]);
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
