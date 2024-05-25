<script lang="ts">
import { CloseCircleOutline } from 'flowbite-svelte-icons';
import { createEventDispatcher } from 'svelte';
import type { CustomEventProps } from '$lib/components/DeleteButton.svelte';

export let id: string;

const dispatch = createEventDispatcher();
const handleDeleteButton = () => {
	const props: CustomEventProps = { id };
	dispatch('delete', props);
};
</script>

<button on:click={handleDeleteButton}>
	<CloseCircleOutline color="red" />
</button>

<!-- For Debugging -->
<slot />
