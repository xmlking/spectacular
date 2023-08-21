<script lang="ts">
	// Usage: To display Form-level message or errors
	import { page } from '$app/stores';
	import { Alert } from 'flowbite-svelte';

	export let message: string | undefined;
	export let errors: string[] | undefined;
</script>

{#if message || errors}
	<Alert color={$page.status >= 400 ? 'red' : 'blue'} dismissable={false} class="!items-start">
		<span slot="icon"
			><svg
				aria-hidden="true"
				class="h-5 w-5"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					fill-rule="evenodd"
					d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
					clip-rule="evenodd"
				/></svg
			>
			<span class="sr-only">{$page.status >= 400 ? 'Error' : 'Info'}</span>
		</span>
		<p class="font-medium">{message ?? 'Got Errors:'}</p>
		{#if errors}
			<ul class="ml-4 mt-1.5 list-inside list-disc">
				{#each errors as error, index}
					<li>{error}</li>
				{/each}
			</ul>
		{/if}
	</Alert>
{/if}
