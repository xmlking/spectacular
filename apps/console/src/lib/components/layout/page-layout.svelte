<script lang="ts">
import { TableOfContents, tocCrawler } from '@skeletonlabs/skeleton';

// Classes
const cBase = 'page-container';

// Reactive
$: classesBase = `${cBase} ${$$props.class ?? ''}`;
</script>

<div class={classesBase}>
	<!-- Content -->
	<slot />
</div>
