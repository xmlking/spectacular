<script lang="ts">
	import { clsx } from 'clsx';
	export let error: string | undefined;
</script>

{#if error}
	<p
		{...$$restProps}
		class={clsx('mt-2 text-xs font-normal text-red-700 dark:text-red-500', $$props.class)}
	>
		<span class="font-medium">Oh, snapp!</span> {error}</p
	>
{/if}
