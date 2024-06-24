<script lang="ts">
  import SecurityKeyItem from './security-key.svelte';
  import { quintOut } from 'svelte/easing';
  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';
  import type { SecurityKey } from '$houdini';


  export const defaultDE = {
  duration: 450,
  easing: quintOut,
};


  export let securityKeys: SecurityKey[];
</script>

<div class="divide-y divide-slate-200">
  {#each securityKeys as securityKey (securityKey.id)}
    <div transition:fade={defaultDE} animate:flip={defaultDE}>
      <SecurityKeyItem {securityKey} />
    </div>
  {/each}
</div>
