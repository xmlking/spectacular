<script lang="ts">
	import { onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	export let labelClass =
		'flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600/80';

	let darkMode = false;

	function handleSwitchDarkMode() {
		darkMode = !darkMode;

		localStorage.setItem('theme', darkMode ? 'dark' : 'light');

		darkMode
			? document.documentElement.classList.add('dark')
			: document.documentElement.classList.remove('dark');
	}

	onMount(() => {
		if (
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) &&
				window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.classList.add('dark');
			darkMode = true;
		} else {
			document.documentElement.classList.remove('dark');
			darkMode = false;
		}
	});
</script>

<div>
	<input
		checked={darkMode}
		on:click={handleSwitchDarkMode}
		type="checkbox"
		name="light-switch"
		id="light-switch"
		class="light-switch sr-only"
	/>
	<label class={twMerge(labelClass, $$props.class)} for="light-switch">
		<svg class="h-4 w-4 dark:hidden" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
			<path
				class="fill-current text-slate-400"
				d="M7 0h2v2H7V0Zm5.88 1.637 1.414 1.415-1.415 1.413-1.414-1.414 1.415-1.414ZM14 7h2v2h-2V7Zm-1.05 7.433-1.415-1.414 1.414-1.414 1.415 1.413-1.414 1.415ZM7 14h2v2H7v-2Zm-4.02.363L1.566 12.95l1.415-1.414 1.414 1.415-1.415 1.413ZM0 7h2v2H0V7Zm3.05-5.293L4.465 3.12 3.05 4.535 1.636 3.121 3.05 1.707Z"
			/>
			<path
				class="fill-current text-slate-500"
				d="M8 4C5.8 4 4 5.8 4 8s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4Z"
			/>
		</svg>
		<svg
			class="hidden h-4 w-4 dark:block"
			width="16"
			height="16"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				class="fill-current text-slate-400"
				d="M6.2 2C3.2 2.8 1 5.6 1 8.9 1 12.8 4.2 16 8.1 16c3.3 0 6-2.2 6.9-5.2C9.7 12.2 4.8 7.3 6.2 2Z"
			/>
			<path
				class="fill-current text-slate-500"
				d="M12.5 6a.625.625 0 0 1-.625-.625 1.252 1.252 0 0 0-1.25-1.25.625.625 0 1 1 0-1.25 1.252 1.252 0 0 0 1.25-1.25.625.625 0 1 1 1.25 0c.001.69.56 1.249 1.25 1.25a.625.625 0 1 1 0 1.25c-.69.001-1.249.56-1.25 1.25A.625.625 0 0 1 12.5 6Z"
			/>
		</svg>
		<span class="sr-only">Switch to light / dark version</span>
	</label>
</div>
