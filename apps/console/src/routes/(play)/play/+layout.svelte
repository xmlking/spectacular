<script lang="ts">
	import { DarkMode } from '$lib/components';

	// HINT: added `right-4 top-24` to original `btnClass`
	let btnClass =
		'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-lg p-2.5 fixed right-4 top-24 z-50';
</script>

<DarkMode {btnClass} />

<div class="flex h-screen flex-col">
	<header class="border-b-4 p-5 text-center">
		<a class="btn" href="/play">Menu</a>
	</header>
	<main class="flex-grow px-3 pt-1">
		<slot />
	</main>
	<footer class="flex justify-center border-t-2 p-5"> Social links </footer>
</div>
