<script lang="ts">
	import Page from '$lib/components/Page.svelte';
	/* All values defined in frontmatter are available as props.*/
	export let title;
	export let headline;
	export let keywords;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={title} />
</svelte:head>

<!-- Page markup-->
<Page>
	<div class="markdown-body">
		<!-- the mdsvex content will be slotted in here -->
		<slot />
	</div>
</Page>
