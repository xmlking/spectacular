<!--
	STICKY glass HEADER  with  Tailwind
	https://www.youtube.com/watch?v=nSePFH5W1Wo
	Credit: Johnny Magrippis - https://magrippis.com/
	Source code: https://github.com/jmagrippis/with-svelte
-->
<script lang="ts">
	let previousY: number;
	let currentY: number;
	let clientHeight: number;
	const deriveDirection = (y: number) => {
		const direction = !previousY || previousY < y ? 'down' : 'up';
		previousY = y;
		return direction;
	};
	$: scrollDirection = deriveDirection(currentY);
	$: offscreen = scrollDirection === 'down' && currentY > clientHeight * 4;
</script>

<svelte:window bind:scrollY={currentY} />

<header
	class="bg-surface-1/50 body-font sticky top-0 flex h-[var(--header-height)] items-center px-2 text-lg text-gray-600 backdrop-blur-sm transition-transform ease-in dark:bg-gray-900 dark:text-gray-400 md:px-0"
	class:motion-safe:-translate-y-full={offscreen}
	bind:clientHeight
>
	<div class="container mx-auto flex flex-col flex-wrap items-center p-5 md:flex-row">
		<a
			href="/#"
			class="title-font mb-4 flex items-center font-medium text-gray-900 dark:text-white md:mb-0"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				class="h-10 w-10 rounded-full bg-indigo-500 p-2 text-white"
				viewBox="0 0 24 24"
			>
				<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
			</svg>

			<span class="ml-3 text-xl">Datablocks</span>
		</a>
		<nav class="flex flex-wrap items-center justify-center text-base md:ml-auto">
			<a href="/faq" class="mr-5 hover:text-gray-900 dark:hover:text-white">Product</a>
			<a href="/features" class="mr-5 hover:text-gray-900 dark:hover:text-white">Features</a>
			<a href="/blog" class="mr-5 hover:text-gray-900 dark:hover:text-white">Blog</a>
			<a href="/about" class="mr-5 hover:text-gray-900 dark:hover:text-white">About us</a>
		</nav>
	</div>
</header>
