<!-- Layout: (dashboard) -->
<script lang="ts">
import { page } from '$app/stores';
import { goto } from '$app/navigation';
import { nhost, isAuthenticated } from '$lib/stores/user';
import { onMount } from 'svelte';
import WaitForAuth from '$lib/components/layout/wait-for-auth.svelte';

export let data;

/**
 * Ensure that Auth is initialized before rendering the app.
 * Otherwise all authorized graphql queries will get errors.
 */
onMount(async () => {
  if (!(await nhost.auth.isAuthenticated())) {
    goto(`/signin?redirectTo=${$page.url.pathname}`);
  }
});
</script>

<WaitForAuth>
  <slot />
</WaitForAuth>
