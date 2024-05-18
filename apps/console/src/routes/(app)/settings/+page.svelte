<script lang="ts">
	import { Debug } from '@spectacular/skeleton/components';

	export let data;
</script>

<svelte:head>
	<title>Datablocks | Settings</title>
	<meta name="description" content="Account Settings" />
</svelte:head>

<h2 class="h2">Settings</h2>
<Debug {data} />
