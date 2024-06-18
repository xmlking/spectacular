<script lang="ts">
import { accessToken, user } from '$lib/stores/user';
import { Debug } from '@spectacular/skeleton/components';
</script>

<svelte:head>
  <title>Datablocks | Contact</title>
  <meta name="description" content="Contact Page" />
</svelte:head>

<h2 class="h2">Contact</h2>
<Debug data={$user}/>
<Debug data={$accessToken}/>
