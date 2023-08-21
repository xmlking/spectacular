<script lang="ts">
	import { sidebarOpen } from '$lib/stores/sidebar.store';

	const toggle = () => {
		sidebarOpen.update((n) => (n = !n));
	};
	export let hamburgerClass =
		'text-gray-500 hover:text-gray-700 cursor-pointer border-none focus:outline-none dark:text-white hidden sm:block';
</script>

<button
	id="hamburgerBtn"
	class={hamburgerClass}
	class:open={$sidebarOpen}
	on:click={toggle}
	aria-label="Sidebar"
>
	<svg width="32" height="24">
		<line id="top" x1="0" y1="2" x2="32" y2="2" />
		<line id="middle" x1="0" y1="12" x2="24" y2="12" />
		<line id="bottom" x1="0" y1="22" x2="32" y2="22" />
	</svg>
</button>

<style lang="postcss">
	svg {
		min-height: 24px;
		transition: transform 0.3s ease-in-out;
	}
	svg line {
		stroke: currentColor;
		stroke-width: 3;
		transition: transform 0.3s ease-in-out;
	}
	button {
		z-index: 20;
	}
	.open svg {
		transform: scale(0.7);
	}
	.open #top {
		transform: translate(6px, 0px) rotate(45deg);
	}
	.open #middle {
		opacity: 0;
	}
	.open #bottom {
		transform: translate(-12px, 9px) rotate(-45deg);
	}
</style>
