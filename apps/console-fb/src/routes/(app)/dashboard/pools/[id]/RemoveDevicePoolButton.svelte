<script lang="ts">
import type { CustomEventProps } from '$lib/components/DeleteButton.svelte';
import { CloseCircleOutline } from 'flowbite-svelte-icons';
import { createEventDispatcher } from 'svelte';

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
