<!-- Layout: (dashboard) -->
<script lang="ts">
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import WaitForAuth from '$lib/components/layout/wait-for-auth.svelte';
import { getNhostClient } from '$lib/stores/nhost';

const nhost = getNhostClient();

/**
 * Ensure that Auth is initialized before rendering the app.
 * Otherwise all authorized graphql queries will get errors.
 */
onMount(async () => {
  if (!nhost.auth.isAuthenticated()) {
    goto(`/signin?redirectTo=${$page.url.pathname}`);
  }
});
</script>

<WaitForAuth>
  <slot />
</WaitForAuth>
