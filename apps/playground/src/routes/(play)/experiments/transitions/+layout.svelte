<script>
export let data;
</script>

<div class="pageContainer">
	{#key data.path}
		<div class="pageWrapper">
			<slot />
		</div>
	{/key}
</div>

<style>
	.pageContainer {
		display: grid;
		grid-template-columns: 1fr;
	}
	.pageWrapper {
		grid-row-start: 1;
		grid-column-start: 1;
	}

	:global(html),
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
