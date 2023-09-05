<script lang="ts">
	import { page } from '$app/stores';
	import LogoAnim from '$lib/components/logos/LogoAnim.svelte';
</script>

{#if $page}
	<div class="w-full h-full flex justify-center items-center">
		<div class="text-center space-y-4">
			<LogoAnim />
			<h2 class="h2">
				{$page.status}:{#if $page.error} {$page.error.message} {/if}
			</h2>
			<p>We're sorry, something went wrong.</p>
		</div>
	</div>
{/if}
