<script lang="ts">
	import { default as Card } from './Card.svelte';
	import movies_json from './movies.json';

	type Movie = {
		title: string;
		image: string;
		subtitle: string;
		description: string;
	};
	const movies = movies_json as Movie[];
</script>

<div class="mx-auto max-w-5xl @container">
	<div class="@4xl:grid @4xl:grid-cols-[3fr_1fr]">
		<main class="@container">
			<Card {...movies[0]} />
			<Card {...movies[1]} />
			<Card {...movies[2]} />
		</main>
		<article class="@container">
			<Card {...movies[3]} />
			<Card {...movies[2]} />
			<Card {...movies[1]} />
		</article>
	</div>
</div>
