<script lang="ts">
import { isAuthenticated, user } from '$lib/stores/user';
import { Debug } from '@spectacular/skeleton/components';
</script>

<svelte:head>
  <title>Datablocks | About</title>
  <meta name="description" content="About Page" />
</svelte:head>

<h2 class="h2">About</h2>
<Debug data={$user}/>
 {$isAuthenticated}
