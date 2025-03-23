<!-- Layout: (dashboard) -->
<script lang="ts">
import { goto } from '$app/navigation';
import { page } from '$app/state';
import WaitForAuth from '$lib/components/layout/wait-for-auth.svelte';
import { getNhostClient } from '$lib/stores/nhost';
import { onMount } from 'svelte';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

const nhost = getNhostClient();

/**
 * Ensure that Auth is initialized before rendering the app.
 * Otherwise all authorized graphql queries will get errors.
 */
onMount(async () => {
  if (!nhost.auth.isAuthenticated()) {
    goto(`/signin?redirectTo=${page.url.pathname}`);
  }
});
</script>

<WaitForAuth>
  {@render children?.()}
</WaitForAuth>
