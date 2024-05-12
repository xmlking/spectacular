<!-- Layout: (dashboard) -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	export let data;

	/**
	 * Ensure that Auth is initialized before rendering the app.
	 * Otherwise all authorized graphql queries will get errors.
	 */
	onMount(async () => {
		if (data.user == null) {
			goto('/auth/signin');
		}
	});
</script>

{#if data.user}
	<slot />
{/if}
