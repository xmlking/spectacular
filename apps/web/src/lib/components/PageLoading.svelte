<svelte:options immutable />

<script lang="ts">
	import { navigating } from '$app/stores';

	$: isNavigating = !!$navigating;
</script>

{#if isNavigating}
	<div class="page-loading">
		<div class="spinner-grow text-primary" role="status">
			<span class="visually-hidden loading">Loading...</span>
		</div>
	</div>
{/if}

<style lang="postcss">
	.page-loading {
		position: fixed;
		top: calc(50% - 2.5rem);
		left: calc(50% - 2.5rem);
		z-index: 100;
	}
	.loading {
		width: 5rem;
		height: 5rem;
	}
</style>
