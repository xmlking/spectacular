<script>
import TransitionableImage from './TransitionableImage.svelte';
</script>

<div class="container">
	<a href="transitions/a">
		<TransitionableImage
			class="image"
			src="https://picsum.photos/id/400/1200/800"
			transitionId="a"
		/>
	</a>
	<a href="transitions/b">
		<TransitionableImage
			class="image"
			src="https://picsum.photos/id/402/1200/800"
			transitionId="b"
		/>
	</a>
	<a href="transitions/c">
		<TransitionableImage
			class="image"
			src="https://picsum.photos/id/403/1200/800"
			transitionId="c"
		/>
	</a>
	<a href="transitions/d">
		<TransitionableImage
			class="image"
			src="https://picsum.photos/id/404/1200/800"
			transitionId="d"
		/>
	</a>
	<a href="transitions/e">
		<TransitionableImage
			class="image"
			src="https://picsum.photos/id/405/1200/800"
			transitionId="e"
		/>
	</a>
</div>

<style>
.container {
	display: flex;
	flex-direction: row;
	gap: 20px;
	width: 100%;
	justify-content: center;
	align-items: center;
	height: 100vh;
}

.container :global(.image) {
	aspect-ratio: 4 / 12;
	width: 180px;
	flex-shrink: 0;
	align-items: center;
	object-fit: cover;
}
</style>
