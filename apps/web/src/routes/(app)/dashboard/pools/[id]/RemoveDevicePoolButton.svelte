<script lang="ts">
	import type { CustomEventProps } from '$lib/components/DeleteButton.svelte';
	import { createEventDispatcher } from 'svelte';
	import { MinusCircle } from 'svelte-heros-v2';

	export let id: string;

	const dispatch = createEventDispatcher();
	const handleDeleteButton = () => {
		const props: CustomEventProps = { id };
		dispatch('delete', props);
	};
</script>

<button on:click={handleDeleteButton}>
	<MinusCircle color="red" variation="outline" />
</button>

<!-- For Debugging -->
<slot />
