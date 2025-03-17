<script lang="ts">
import { getNhostClient } from '$lib/stores/nhost';
import { Debug } from '$lib/ui/components';

const { isAuthenticated, user } = getNhostClient();
</script>

<svelte:head>
  <title>Datablocks | About</title>
  <meta name="description" content="About Page" />
</svelte:head>

<h2 class="h2">About</h2>
<Debug data={$user}/>
 {$isAuthenticated}
