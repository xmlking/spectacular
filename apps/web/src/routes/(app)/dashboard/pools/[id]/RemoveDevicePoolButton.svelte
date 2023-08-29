<script lang="ts">
	import type { CustomEventProps } from '$lib/components/DeleteButton.svelte';
	import { Icon } from 'flowbite-svelte-icons';
	import { createEventDispatcher } from 'svelte';

	export let id: string;

	const dispatch = createEventDispatcher();
	const handleDeleteButton = () => {
		const props: CustomEventProps = { id };
		dispatch('delete', props);
	};
</script>

<button on:click={handleDeleteButton}>
	<Icon name="x-circle-outline" color="red" />
</button>

<!-- For Debugging -->
<slot />
