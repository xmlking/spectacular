<script lang="ts">
	import { version } from '$app/environment';
	import LL from '$lib/i18n/i18n-svelte'
	import LogoAnim from '$lib/components/logos/LogoAnim.svelte';
	console.log(`Client version: ${version}`);
</script>

<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center flex flex-col items-center">
		<h2 class="h2">{$LL.welcome()}</h2>
		<!-- Animated Logo -->
		<LogoAnim />
		<!-- / -->
		<div class="flex justify-center space-x-2">
			<a
				class="btn variant-filled"
				href="/dashboard"
			>
				Launch Dashboard
			</a>
		</div>
	</div>
</div>

<style lang="postcss">
</style>
