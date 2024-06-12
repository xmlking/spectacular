<script lang="ts">
import { nhost, user } from '$lib/nhost';
import { Debug } from '@spectacular/skeleton/components';

console.log(nhost);
</script>

<svelte:head>
  <title>Datablocks | Settings</title>
  <meta name="description" content="Account Settings" />
</svelte:head>

<h2 class="h2">Settings</h2>
<Debug data={$user}/>
