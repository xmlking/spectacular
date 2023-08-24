<script lang="ts">
	import type { CustomEventProps } from '$lib/components/DeleteButton.svelte';
	import { createEventDispatcher } from 'svelte';
	import { IconOutline } from 'svelte-heros-v2';

	export let id: string;

	const dispatch = createEventDispatcher();
	const handleDeleteButton = () => {
		const props: CustomEventProps = { id };
		dispatch('delete', props);
	};
</script>

<button on:click={handleDeleteButton}>
	<IconOutline name="minus-circle-outline" color="red" />
</button>

<!-- For Debugging -->
<slot />
