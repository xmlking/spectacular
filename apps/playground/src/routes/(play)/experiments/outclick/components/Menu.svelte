<script lang="ts">
	import { BarsSolid } from 'svelte-awesome-icons';
	import { OutClick } from '@spectacular/ui';
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/stores';

	const items = [
		{ title: 'HOME', href: '/experiments/outclick' },
		{ title: 'EXCLUDE', href: '/experiments/outclick/exclude' },
		{ title: 'HALF CLICK', href: '/experiments/outclick/half-click' }
	];

	let isOpen = false;
	let toggleBtn: HTMLButtonElement;

	beforeNavigate(() => (isOpen = false));
</script>

<button
	class="flex h-8 w-8 items-center justify-center rounded bg-gray-800 text-gray-400 duration-150 hover:bg-gray-700"
	bind:this={toggleBtn}
	on:click={() => (isOpen = !isOpen)}
>
	<BarsSolid />
</button>

<OutClick on:outclick={() => (isOpen = false)} excludeElements={toggleBtn}>
	<nav
		class="
			pointer-events-none invisible absolute inset-x-12 top-0 z-20 origin-top -translate-y-4 scale-0 overflow-hidden
			rounded bg-gray-200 opacity-0 duration-200 ease-in-out
			{isOpen && '!pointer-events-auto !visible !translate-y-0 !scale-100 !opacity-100'}
		"
	>
		<ul>
			{#each items as item}
				<li>
					<a
						class="block px-4 py-2.5 text-xs duration-150 hover:bg-gray-300
							{item.href === $page.url.pathname && '!bg-gray-200 text-gray-800 '}
						"
						href={item.href}
					>
						{item.title}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</OutClick>

<style lang="postcss">
	nav li:first-of-type a {
		@apply pt-3.5;
	}
	nav li:last-of-type a {
		@apply pb-3.5;
	}
</style>
