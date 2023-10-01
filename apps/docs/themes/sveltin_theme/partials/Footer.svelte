<script lang="ts">
	import { sveltinVersion } from '$config/defaults.js';

	export let logoSrc: string;

	import SveltinLogo from './SveltinLogo.svelte';
</script>

<footer
	class="w-full text-sm text-skin-muted bg-skin-deep-dark"
	aria-labelledby="footer-heading"
>
	<h2 id="footer-heading" class="sr-only">Footer</h2>
	<div class="mx-auto px-4 py-6 sm:px-6 lg:px-8">
		<div class="flex items-center justify-center text-center lg:justify-between lg:text-left">
			<div class="space-y-8 text-skin-muted dark:text-skin-muted-dark">
				<div
					class="flex w-full flex-col items-center justify-center font-light tracking-tighter lg:flex-row lg:justify-between"
				>
					<SveltinLogo />

					<p class="mt-6">
						The CLI to Boost Your Productivity creating SvelteKit powered
						static websites.
					<span class="mt-6 font-semibold">
						You are running Sveltin v{sveltinVersion}
					</span>
					</p>
				</div>
			</div>
		</div>
	</div>
</footer>
