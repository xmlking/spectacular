<script>
	export let isSelected;
	export let isSomeSubRowsSelected;
</script>

<label class="flex items-center">
	<input
		type="checkbox"
		class="form-checkbox border-surface-200-700-token bg-surface-500-400-token focus:bg-primary-300-600-token hover:bg-primary-300-600-token border outline-none ring-0 focus:outline-none"
		bind:checked={$isSelected}
		indeterminate={$isSomeSubRowsSelected}
	/>
</label>
