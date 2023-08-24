<script lang="ts">
	import { default as Frame } from '$lib/components/utils/Frame.svelte';
	import { clsx } from 'clsx';
	import { CloseButton } from 'flowbite-svelte';
	import { IconOutline, IconSolid } from 'svelte-heros-v2';
	import { slide } from 'svelte/transition';
	import { ToastLevel, dismissToast, toasts } from './store';

	export let divClass = 'w-full max-w-xs p-4 ';

	export let placement:
		| 'top-left'
		| 'top-center'
		| 'top-right'
		| 'center'
		| 'bottom-left'
		| 'bottom-center'
		| 'bottom-right' = 'center';
	const placements = {
		'top-left': 'absolute top-0 left-0',
		'top-center': 'absolute top-0 left-1/2 -translate-x-1/2',
		'top-right': 'absolute top-0 right-0',
		center: 'absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2',
		'bottom-left': 'absolute bottom-0 left-0',
		'bottom-center': 'absolute bottom-0 left-1/2 -translate-x-1/2',
		'bottom-right': 'absolute bottom-0 right-0'
	};

	let toastsClass: string;
	$: toastsClass = clsx(divClass, placements[placement], $$props.class);

	let iconClass: string;
	$: iconClass = clsx('inline-flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3');
</script>

{#if $toasts}
	<section class={toastsClass}>
		{#each $toasts as toast (toast.id)}
			<Frame
				rounded
				border
				transition={slide}
				class="mb-2 w-full max-w-xs p-4"
				{...$$restProps}
				role="alert"
			>
				<div class="flex items-center">
					<Frame color={toast.type} rounded class={iconClass}>
						{#if toast.type === ToastLevel.Success}
							<IconSolid name="check-solid" width="10" height="10" ariaLabel="Success icon" />
						{:else if toast.type === ToastLevel.Error}
							<IconOutline name="exclamation-triangle-outline" width="10" height="10" ariaLabel="Error icon" />
						{:else if toast.type === ToastLevel.Warning}
							<IconOutline name="hand-raised-outline"  width="10" height="10" ariaLabel="Warning icon" />
						{:else}
							<IconOutline name="information-circle-outline"  width="10" height="10" ariaLabel="Info icon" />
						{/if}
					</Frame>
					<div class="w-full text-sm font-normal">
						{toast.message}
					</div>
					{#if toast.dismissible}
						<CloseButton aria-label="Close" on:click={() => dismissToast(toast.id)} />
					{/if}
				</div>
			</Frame>
		{/each}
	</section>
{/if}
