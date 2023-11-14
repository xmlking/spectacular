<script lang="ts" context="module">
	import { fade } from 'svelte/transition';
	import { crossfade } from './crossfade';
	// import { circOut } from 'svelte/easing';

	let [send, receive] = crossfade({
		fallback: (node, params, flyingTo) =>
			fade(node, {
				...params,
				duration: 300,
				delay: flyingTo ? 200 : 0
			}),
		delay: 0,
		duration: (d) => Math.max(700, Math.sqrt(d) * 30)
	});
</script>

<script lang="ts">
	export let src;
	let className = '';
	export { className as class };

	export let alt = '';

	export let transitionId;
</script>

<div class="container {className}">
	<div class="imgWrapper" out:send={{ key: transitionId }} in:receive={{ key: transitionId }}>
		<img {src} {alt} crossorigin="anonymous" />
	</div>
</div>

<style>
	.container {
		position: relative;
	}

	.imgWrapper {
		position: absolute;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
