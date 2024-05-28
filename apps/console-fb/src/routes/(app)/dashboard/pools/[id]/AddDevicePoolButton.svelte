<script lang="ts" context="module">
export interface CustomEventProps {
  [key: string]: any;
  poolId: string | null;
  deviceId: string | null;
}
</script>

<script lang="ts">
	import { CirclePlusOutline } from 'flowbite-svelte-icons';
	import { createEventDispatcher } from 'svelte';

	export let poolId: string;
	export let deviceId: string;

	const dispatch = createEventDispatcher();
	const handleAddButton = () => {
		const props: CustomEventProps = { poolId, deviceId };
		dispatch('add', props);
	};
</script>

<button on:click={handleAddButton}>
	<CirclePlusOutline color="green" />
</button>
<!-- For Debug -->
<slot />
