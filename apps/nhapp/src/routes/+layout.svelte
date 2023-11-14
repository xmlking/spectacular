<script>
	import Navigation from '$lib/components/Navigation.svelte';
	import './styles.css';

	export let data;
</script>

<div class="app">
	<Navigation user={data?.user} />

	<div class="container mx-auto mt-8 p-4 antialiased">
		<slot />
	</div>
</div>
