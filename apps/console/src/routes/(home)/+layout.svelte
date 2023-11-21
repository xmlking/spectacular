<script lang="ts">
	import { Footer1 } from '$lib/blocks/footer';
	import { StickyHeader } from '$lib/blocks/header';
	import { DarkMode } from '$lib/components';

	// HINT: added `right-4 top-4` to original `btnClass`
	let btnClass =
		'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-lg p-2.5 fixed right-4 top-4 z-50';
</script>

<div class="flex min-h-screen flex-col">
	<DarkMode {btnClass} />

	<!-- <Header1 /> -->
	<StickyHeader />

	<slot />
	<Footer1 />
</div>
