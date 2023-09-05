<script lang="ts">
	import { version } from '$app/environment';
	import VinylImgMeta from '$lib/assets/img/erik-mclean-QzpgqElvSiA-unsplash.jpg?w=200;400;800&format=avif;webp;jpg&as=picture';
	import Page from '$lib/components/layout/Page.svelte';
	import { Picture } from 'ui';
	console.log(`Client version: ${version}`);
</script>


<Page>
	<header class="space-y-4">
		<h1 class="h1">Picture</h1>
		<p>Showcase image optimization.</p>
	</header>
		<Picture meta={VinylImgMeta} alt="Vinyls" sizes="33vw" />
</Page>


<style lang="postcss">
</style>
