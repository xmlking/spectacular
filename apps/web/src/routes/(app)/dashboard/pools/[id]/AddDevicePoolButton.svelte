<script lang="ts" context="module">
	export interface CustomEventProps {
		[key: string]: any;
		poolId: string | null;
		deviceId: string | null;
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { IconOutline } from 'svelte-heros-v2';

	export let poolId: string;
	export let deviceId: string;

	const dispatch = createEventDispatcher();
	const handleAddButton = () => {
		const props: CustomEventProps = { poolId, deviceId };
		dispatch('add', props);
	};
</script>

<button on:click={handleAddButton}>
	<IconOutline name="plus-circle-outline" color="green" />
</button>
<!-- For Debug -->
<slot />
