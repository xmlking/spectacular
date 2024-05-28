<!-- Layout: (dashboard) -->
<script lang="ts">
import { goto } from '$app/navigation';
import { onMount } from 'svelte';

export let data;

/**
 * Ensure that Auth is initialized before rendering the app.
 * Otherwise all authorized graphql queries will get errors.
 */
onMount(async () => {
  if (data.user == null) {
    goto('/signin');
  }
});
</script>

{#if data.user}
  <slot />
{/if}
