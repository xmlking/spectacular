<script lang="ts" context="module">
	export interface CustomEventProps {
		[key: string]: any;
		id: string | null;
		id2: string | null;
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { ArchiveBox } from 'svelte-heros-v2';

	export let id: string;
	export let id2: string;

	const dispatch = createEventDispatcher();
	const handleDeleteButton = () => {
		const props: CustomEventProps = { id, id2 };
		dispatch('delete', props);
	};
</script>

<button on:click={handleDeleteButton}>
	<ArchiveBox class="text-pink-700 dark:text-blue-300" />
</button>
<!-- For Debug -->
<slot />
