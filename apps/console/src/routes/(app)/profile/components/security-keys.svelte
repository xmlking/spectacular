<script lang="ts">
import type { SecurityKeyFragment } from '$houdini';
import { Alerts } from '@spectacular/skeleton/components/form';
import { toWithId } from '@spectacular/utils';
import { flip } from 'svelte/animate';
import { quintOut } from 'svelte/easing';
import { fade } from 'svelte/transition';
import SecurityKeyItem from './security-key.svelte';
export let securityKeys: SecurityKeyFragment[];

// Variables
let message: App.Superforms.Message | undefined;
let errors: string[] = [];
// $: securityKeysWithId = securityKeys.map(toWithId);
</script>

<!-- Form Level Errors / Messages -->
<Alerts errors={errors} message={message} />
<div class="w-full text-token card p-4 space-y-4">
  <dl class="list-dl">
    {#each securityKeys as securityKey (securityKey.id)}
      <div transition:fade={{ duration: 450, easing: quintOut }} animate:flip={{ duration: 450, easing: quintOut }}>
        <SecurityKeyItem bind:message bind:errors {securityKey} />
      </div>
    {:else}
      <div class="text-center text-gray-500">No security keys found.</div>
    {/each}
  </dl>
</div>
