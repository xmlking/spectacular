<script lang="ts">
	import { flip } from 'svelte/animate';
	let uid = 0;
	let dogs = [
		{ id: uid++, url: 'https://source.unsplash.com/collection/3578257/1' },
		{ id: uid++, url: 'https://source.unsplash.com/collection/3578257/2' },
		{ id: uid++, url: 'https://source.unsplash.com/collection/3578257/3' },
		{ id: uid++, url: 'https://source.unsplash.com/collection/3578257/4' },
		{ id: uid++, url: 'https://source.unsplash.com/collection/3578257/5' },
		{ id: uid++, url: 'https://source.unsplash.com/collection/3578257/6' }
	];

	function swap(index: number) {
		let first = dogs[0];
		let selected = dogs[index];
		dogs = dogs.map((dog, i) => {
			if (i === 0) return selected;
			else if (i === index) return first;
			else return dog;
		});
	}
</script>

<main>
	<div class="gallery">
		{#each dogs as dog, i (dog.id)}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<figure on:click={swap(i)} animate:flip={{ duration: 500 }} data-grid={`img-${i + 1}`}>
				<img src={dog.url} alt="good dog" />
			</figure>
		{/each}
	</div>
</main>

<!-- https://twitter.com/cassiecodes/status/1517122525649686530 -->
<style>
	/* Used Grid Generated https://cssgrid-generator.netlify.app  */
	:global(body) {
		min-height: 100vh;
		padding: 0;
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.gallery {
		display: grid;
		grid-template-columns: repeat(9, 1fr);
		grid-template-rows: repeat(9, 1fr);
		grid-gap: 1rem;
		width: 60vw;
		max-height: 60vh;
		aspect-ratio: 1/1;
	}

	figure[data-grid='img-1'] {
		grid-area: 1 / 1 / 7 / 7;
	}
	figure[data-grid='img-2'] {
		grid-area: 1 / 7 / 4 / 10;
	}
	figure[data-grid='img-3'] {
		grid-area: 4 / 7 / 7 / 10;
	}
	figure[data-grid='img-4'] {
		grid-area: 7 / 7 / 10 / 10;
	}
	figure[data-grid='img-5'] {
		grid-area: 7 / 4 / 10 / 7;
	}
	figure[data-grid='img-6'] {
		grid-area: 7 / 1 / 10 / 4;
	}

	figure {
		position: relative;
		margin: 0;
		padding: 0;
	}

	img {
		position: absolute;
		height: 100%;
		width: 100%;
		object-fit: cover;
	}
</style>
