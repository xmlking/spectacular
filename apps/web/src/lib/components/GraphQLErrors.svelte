<script lang="ts">
	import type { GraphQLError } from 'graphql';

	export let errors: GraphQLError[];
</script>

{#if errors.length}
	<p
		><span class="font-bold">Error:</span>
		<span class="text-ellipsis">{errors[0].message}</span></p
	>
	<!-- <p><span class="font-bold">Extensions:</span> <span class="text-ellipsis">{JSON.stringify(errors[0].extensions)}</span></p> -->
	<details>
		<summary>Raw Errors </summary>
		<pre>
			{JSON.stringify(errors, null, 2)}
		</pre>
	</details>
{/if}
