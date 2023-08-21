<script lang="ts">
	import { Listgroup } from 'flowbite-svelte';
	let links = [
		{ name: 'demo', href: '/play/demo' },
		{ name: 'Chat', href: '/play/chat' },
		{ name: 'Grid1', href: '/play/grid1' },
		{ name: 'Grid2', href: '/play/grid2' },
		{ name: 'Grid3', href: '/play/grid3' },
		{ name: 'Movies', href: '/play/movies' },
		{ name: 'Houdini', href: '/play/houdini?limit=2' },
		{ name: 'Houdini-page', href: '/play/houdini/demo' },
		{ name: 'HyperUI', href: '/play/hyperui' },
		{ name: 'panel', href: '/play/panel' },
		{ name: 'sverdle', href: '/play/sverdle' },
		{ name: 'metrics', href: '/play/metrics' },
		{ name: 'sub', href: '/play/sub' }
	];
</script>

<svelte:head>
	<title>Play</title>
	<meta name="description" content="Play Area" />
</svelte:head>

<h2 class="pb-2 text-2xl">Demos</h2>

<Listgroup active items={links} let:item class="w-48">
	{item.name}
</Listgroup>
