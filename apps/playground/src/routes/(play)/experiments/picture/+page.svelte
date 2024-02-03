<script lang="ts">
	import { version } from '$app/environment';
	// import VinylImgMeta from '?w=200;400;800&format=avif;webp;jpg&as=picture';
	import Preview from '$lib/components/preview.svelte';
	console.log(`Client version: ${version}`);
</script>

<svelte:head>
	<title>Picture</title>
	<meta name="description" content="Showcase image optimization" />
</svelte:head>

<Preview>
	<header class="space-y-4">
		<h1 class="h1">Picture</h1>
		<p>Showcase image optimization.</p>
	</header>
	<enhanced:img
		src="$lib/assets/img/erik-mclean-QzpgqElvSiA-unsplash.jpg?blur=25"
		sizes="min(3493px, 33vw)"
		alt="An alt text"
	/>
</Preview>

<style lang="postcss">
</style>
