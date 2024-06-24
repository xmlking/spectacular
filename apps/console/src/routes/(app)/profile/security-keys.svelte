<script lang="ts">
import { PendingValue, type SecurityKeyFields } from '$houdini';
import { flip } from 'svelte/animate';
import { quintOut } from 'svelte/easing';
import { fade } from 'svelte/transition';
import SecurityKeyItem from './security-key.svelte';

export const defaultDE = {
  duration: 450,
  easing: quintOut,
};

export let securityKeys: SecurityKeyFields[];
</script>

<section class="rounded-lg bg-slate-50">
  <pre>{JSON.stringify(securityKeys, null, 2)}</pre>
</section>

<div class="divide-y divide-slate-200">
  {#each securityKeys as securityKey (securityKey.id)}
    <div transition:fade={defaultDE} animate:flip={defaultDE}>
      <SecurityKeyItem {securityKey} />
    </div>
  {/each}
</div>
