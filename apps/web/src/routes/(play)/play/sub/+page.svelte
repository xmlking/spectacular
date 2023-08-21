<script lang="ts">
	import { graphql } from '$houdini';
	import { onDestroy, onMount } from 'svelte';

	const schedules = graphql(`
		subscription StreamPolicy {
			policies(
				order_by: [{ updatedAt: desc_nulls_last }]
				limit: 50
				offset: 0
				where: { updatedAt: { _is_null: true } }
			) {
				id
				active
			}
		}
	`);

	// const livePolicy = graphql(`
	// 	query LivePolicy {
	// 		policies(order_by: [{ updatedAt: desc_nulls_last }], limit: 50, offset: 0) @live {
	// 			id
	// 			displayName
	// 		}
	// 	}
	// `);

	onMount(() => {
		console.log('sub Mount');
		schedules.listen();
	});
	onDestroy(() => {
		console.log('sub Destroy');
		schedules.unlisten();
	});
	$: console.log('$schedules.data on load:', $schedules.data);
</script>

{#if $schedules.fetching}
	loading...
{:else if $schedules.errors?.length}
	{JSON.stringify($schedules)}
{:else}
	{JSON.stringify($schedules.data)}
{/if}

{#if $schedules.data}
	<pre>{JSON.stringify($schedules.data, null, 4)}</pre>
{/if}
