<script lang="ts">
/**
 * Ensure that Auth is initialized before rendering the app.
 * Otherwise all authorized graphql queries will get errors.
 */
import { isAuthenticated } from '$lib/stores/user';
</script>

{#if $isAuthenticated}
  <slot />
{/if}
