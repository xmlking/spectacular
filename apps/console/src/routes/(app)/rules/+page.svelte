<script lang="ts">
import { user } from '$lib/stores/user';
import { Debug } from '@spectacular/skeleton/components';
</script>

<svelte:head>
  <title>Datablocks | Settings</title>
  <meta name="description" content="Account Settings" />
</svelte:head>

<h2 class="h2">Settings</h2>
<Debug data={$user}/>
