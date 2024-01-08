<script lang="ts">
	// https://github.com/delay/sveltekit-auth-starter/blob/main/src/lib/components/sign-in.svelte
	import { Loader2, Github } from 'lucide-svelte';
	import { cn } from '@spectacular/skeleton/utils';

	let className: string | undefined | null = undefined;
	export { className as class };

	let isLoading = false;
	async function onSubmit() {
		console.log('onSubmit');
		isLoading = true;

		setTimeout(() => {
			isLoading = false;
		}, 3000);
	}
</script>

<div class={cn('grid gap-6', className)} {...$$restProps}>
	<form on:submit|preventDefault={onSubmit}>
		<div class="grid gap-2">
			<div class="grid gap-1">
				<label class="label">
					<span class="sr-only">Email</span>
					<input
						class="input"
						id="email"
						name="email"
						placeholder="name@example.com"
						type="email"
						autocapitalize="none"
						autocomplete="email"
						autocorrect="off"
						disabled={isLoading}
					/>
				</label>
			</div>
			<button type="submit" class="variant-filled-primary btn w-full" disabled={isLoading}>
				{#if isLoading}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Sign In with Email
			</button>
		</div>
	</form>
	<div class="flex items-center">
		<div class="grow border-b border-slate-400"></div>
		<span class="shrink px-1 pb-1 text-xs uppercase text-gray-500">Or continue with</span>
		<div class="grow border-b border-slate-400"></div>
	</div>
	<button type="button" class="variant-ringed btn" disabled={isLoading}>
		{#if isLoading}
			<Loader2 class="mr-2 h-4 w-4 animate-spin" />
		{:else}
			<Github class="mr-2 h-4 w-4" />
		{/if}
		{' '}
		GitHub
	</button>
</div>
