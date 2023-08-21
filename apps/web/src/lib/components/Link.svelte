<script lang="ts">
	import { A } from 'flowbite-svelte';

	export let url: string;
	export let content: string;
	export let title: string | null = null;
</script>

<A class="font-medium" href={url} {title}>{content}</A>
