<script lang="ts">
import type { GetUser$result, SecurityKeyFields } from '$houdini';
import { Alerts } from '@spectacular/skeleton/components/form';
import { flip } from 'svelte/animate';
import { quintOut } from 'svelte/easing';
import { fade } from 'svelte/transition';
import SecurityKeyItem from './security-key.svelte';

export const defaultDE = {
  duration: 450,
  easing: quintOut,
};

export let securityKeys: SecurityKeyFields[]

// Variables
let message: App.Superforms.Message | undefined;
let errors: string[] = [];
</script>

<!-- Form Level Errors / Messages -->
<Alerts errors={errors} message={message} />
<div class="w-full text-token card p-4 space-y-4">
  <dl class="list-dl">
    {#each securityKeys as securityKey (securityKey.id)}
      <div transition:fade={defaultDE} animate:flip={defaultDE}>
        <SecurityKeyItem bind:message bind:errors {securityKey} />
      </div>
    {:else}
      <div class="text-center text-gray-500">No security keys found.</div>
    {/each}
  </dl>
</div>
