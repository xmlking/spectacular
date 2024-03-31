<script lang="ts">
	import { TableOfContents, tocCrawler } from '@skeletonlabs/skeleton';

	// Props
	export let sidebar = true;
	export let tocKey: unknown = undefined;

	// Classes
	const cBase = 'page-padding flex items-start gap-10';
	// const cColLeft = 'page-container-aside';
	const cColLeft = 'page-container';
	const cColRight = 'sticky top-10 hidden xl:block space-y-4 w-72';

	// Reactive
	$: classesBase = `${cBase} ${$$props.class ?? ''}`;
	$: classesColLeft = `${cColLeft}`;
	$: classesColRight = `${cColRight}`;
</script>

<div class={classesBase}>
	<!-- Content -->
	<div
		class={classesColLeft}
		use:tocCrawler={{ mode: 'generate', scrollTarget: '#page', key: tocKey }}
	>
		<slot />
	</div>
	<!-- Aside -->
	{#if sidebar}
		<!-- Ad Position -->
		<aside class="layout-cols-aside {classesColRight}">
			<!-- Table of Contents -->
			<TableOfContents>On the Page</TableOfContents>
		</aside>
	{/if}
</div>
