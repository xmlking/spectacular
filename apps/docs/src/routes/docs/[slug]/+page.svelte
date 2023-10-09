<script lang="ts">
	export let data;
</script>

<svelte:head>
	<title>{data.metadata.title}</title>
</svelte:head>

<article class="mt-8 prose prose-lg lg:prose-xl dark:prose-invert w-full">
	<hgroup>
		<h1 class="text-center">{data.metadata.title}</h1>
        <p>Published {data.metadata.date}</p>
	</hgroup>
	<svelte:component this={data.content} />
</article>
