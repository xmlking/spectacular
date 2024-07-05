<script lang="ts">
import { getNhostClient } from '$lib/stores/nhost';
import { Debug } from '@spectacular/skeleton/components';

const { user, accessToken } = getNhostClient();
</script>

<svelte:head>
  <title>Datablocks | Contact</title>
  <meta name="description" content="Contact Page" />
</svelte:head>

<h2 class="h2">Contact</h2>
<Debug data={$user}/>
<Debug data={$accessToken}/>
