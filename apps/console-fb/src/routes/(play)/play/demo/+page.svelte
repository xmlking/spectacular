<script lang="ts">
	import thisPage from './+page.svelte?raw';
</script>

<svelte:head>
	<title>Demo</title>
	<meta name="description" content="Demo page" />
</svelte:head>

<section class="w-full md:w-9/12 xl:w-8/12">
	<span class="font-bold uppercase tracking-widest">Atomic</span>
	<h1 class="text-3xl font-bold text-pink-500 lg:text-5xl">
		Tail<br />Design
	</h1>
	<p class="mb-1 font-bold">The Design is in the des...</p>
	<p>Lorem ipsum dolor sit amet...</p>
	<br />
	<h2>Demo Vite Raw Import</h2>
	<div class="mockup-code text-primary-content">
		<pre><code>{thisPage}</code></pre>
	</div>
</section>
