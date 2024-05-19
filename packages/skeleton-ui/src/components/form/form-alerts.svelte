<script lang="ts">
	import { fade } from 'svelte/transition';
	import { AlertTriangle } from 'lucide-svelte';
	import { page } from '$app/stores';

	// eslint-disable-next-line no-undef
	export let message: App.Superforms.Message | undefined;
	export let errors: string[] | undefined;
</script>

<!-- Form Level Errors / Messages -->
{#if message}
	<aside
		class="alert mt-6"
		class:variant-filled-success={message.type == 'success'}
		class:variant-filled-error={message.type == 'error'}
		class:variant-filled-warning={message.type == 'warning'}
		transition:fade|local={{ duration: 200 }}
	>
		<!-- Icon -->
		<!-- <AlertTriangle /> -->
		<!-- Message -->
		<div class="alert-message">
			{#if message}
				<p class="font-medium">{message.message}</p>
			{/if}
		</div>
		<!-- Actions -->
		<!-- <div class="alert-actions">
			<button class="btn-icon variant-filled"><X /></button>
		</div> -->
	</aside>
{/if}
{#if errors}
	<aside
		class="alert mt-6"
		class:variant-filled-error={$page.status >= 400}
		transition:fade|local={{ duration: 200 }}
	>
		<div class="alert-message">
			<ul class="list">
				{#each errors as error}
					<li>
						<span><AlertTriangle /></span>
						<span class="flex-auto">{error}</span>
					</li>
				{/each}
			</ul>
		</div>
	</aside>
{/if}
