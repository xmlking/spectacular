<script lang="ts">
	import { version } from '$app/environment';
	import LL from '$lib/i18n/i18n-svelte';
	import LogoAnim from '$lib/components/logos/LogoAnim.svelte';
	console.log(`Client version: ${version}`);
</script>

<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->

<div class="container mx-auto flex h-full items-center justify-center">
	<div class="flex flex-col items-center space-y-10 text-center">
		<h2 class="h2">{$LL.welcome()}</h2>
		<!-- Animated Logo -->
		<LogoAnim />
		<!-- / -->
		<div class="flex justify-center space-x-2">
			<a class="variant-filled btn" href="/dashboard"> Launch Dashboard </a>
		</div>
	</div>
</div>

<style lang="postcss">
</style>
