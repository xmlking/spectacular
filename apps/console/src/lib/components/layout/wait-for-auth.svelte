<script lang="ts">
/**
 * Ensure that Auth is initialized before rendering the app.
 * Otherwise all authorized graphql queries will get errors.
 */
import { getNhostClient } from '$lib/stores/nhost';

const { isAuthenticated } = getNhostClient();
</script>

{#if $isAuthenticated}
  <slot />
{/if}
