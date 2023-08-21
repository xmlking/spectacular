<script lang="ts">
	import { flip } from 'svelte/animate';
	import colors from './colors';

	let colorNames = pickNewPalette();
	updateColors();

	function updateColors() {
		colorNames = shuffle(colorNames);
	}

	function refresh() {
		colorNames = pickNewPalette();
	}

	function pickNewPalette() {
		return shuffle(Object.entries(colors)).slice(0, 50);
	}

	function shuffle<T>(array: T[]): T[] {
		return array.sort(() => Math.random() - 0.5);
	}
</script>

<div class="buttons">
	<button on:click={updateColors}> Shuffle </button>
	<button on:click={refresh}> Refresh palette </button>
</div>

<div class="grid">
	{#each colorNames as [name, hex] (name)}
		<div
			animate:flip={{ duration: (d) => Math.sqrt(d) * 40 }}
			style:background-color={name}
			style:--name="'{name}'"
			class="cell"
		/>
	{/each}
</div>

<style>
	:global(*) {
		box-sizing: border-box;
	}

	.grid {
		display: grid;
		--size: 80px;
		grid-template-columns: repeat(auto-fit, var(--size));
		margin-top: 3.5rem;
	}

	.cell {
		width: var(--size);
		height: var(--size);
		padding: 4px;
	}

	.cell:hover::after {
		content: var(--name);
		/* This'll be cool once its supported by all browsers. */
		color: color-contrast(var(--name) vs black, white);
		overflow-wrap: anywhere;
	}

	.buttons {
		position: fixed;
		top: 1rem;
		left: 1rem;
		display: flex;
		gap: 1rem;
	}
</style>
