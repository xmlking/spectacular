<script lang="ts">
	import { page } from '$app/stores';
	import LogoAnim from '$lib/components/logos/LogoAnim.svelte';
</script>

{#if $page}
	<div class="flex h-full w-full items-center justify-center">
		<div class="space-y-4 text-center">
			<LogoAnim />
			<h2 class="h2">
				{$page.status}:{#if $page.error}
					{$page.error.message}
				{/if}
			</h2>
			<p>We're sorry, something went wrong.</p>
		</div>
	</div>
{/if}
