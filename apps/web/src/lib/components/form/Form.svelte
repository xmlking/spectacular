<script lang="ts">
	import { page } from '$app/stores';
	import { Alert, Button, ButtonGroup, Modal, Spinner } from 'flowbite-svelte';
	import { setContext } from 'svelte';
	import { IconOutline } from 'svelte-heros-v2';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { ZodValidation } from 'sveltekit-superforms/index';
	import type { AnyZodObject } from 'zod';
	import { FORM_KEY, type FormContext } from './forms';
	interface $$restProps extends HTMLFormAttributes {}

	// eslint-disable-next-line no-undef
	type T = $$Generic<AnyZodObject>;
	export let superform: SuperForm<ZodValidation<T>, unknown>;
	export let showButtons = true;
	export let showAlerts = true;
	export let submitButtonText = 'Submit';
	export let resetButtonText = 'Reset';
	export let backButtonText = 'Back';
	export let className = 'space-y-6';

	const {
		posted,
		allErrors,
		form,
		errors,
		enhance,
		delayed,
		message,
		reset,
		tainted,
		submitting
	} = superform;
	setContext<FormContext<T>>(FORM_KEY, { superform });
</script>

<form class={className} method="post" {...$$restProps} use:enhance>
	<slot />

	{#if showAlerts && ($message || $errors._errors)}
		<Alert
			color={$page.status >= 400 ? 'red' : 'blue'}
			dismissable={false}
			class="!items-start"
		>
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
			<p class="font-medium">{$message ?? 'Got Errors:'}</p>
			{#if $errors._errors}
				<ul class="ml-4 mt-1.5 list-inside list-disc">
					{#each $errors._errors as error, index}
						<li>{error}</li>
					{/each}
				</ul>
			{/if}
		</Alert>
	{/if}

	{#if showButtons}
		<ButtonGroup>
			<Button outline on:click={() => history.back()}>
				<IconOutline name="arrow-left-outline"
					width="18" height="18"
					class="mr-2 text-blue-500 dark:text-green-500"
				/>{backButtonText}
			</Button>
			<Button outline disabled={!$tainted} on:click={() => reset()}>
				<IconOutline name="adjustments-horizontal-outline"
					width="18" height="18"
					class="mr-2 text-blue-500 dark:text-green-500"
				/>{resetButtonText}
			</Button>
			<!-- <Button outline type="submit" disabled={!$tainted || $errors || $submitting}></Button> -->
			<Button outline type="submit" disabled={!$tainted || $submitting}>
				{#if $submitting}
					<Spinner class="mr-3" size="4" color="white" />Saveing ...
				{:else}
					<IconOutline name="cloud-arrow-down-outline"
						size="18"
						class="mr-2 text-blue-500 dark:text-green-500"
					/>{submitButtonText}
				{/if}
			</Button>
		</ButtonGroup>
	{/if}
	<slot name="action" />

	{#if $delayed}
		<div class="m-0 p-0">
			<Modal open={$delayed} permanent>
				<Spinner />
			</Modal>
		</div>
	{/if}
</form>
