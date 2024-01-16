<script lang="ts">
	import { fade } from 'svelte/transition';
	import { AlertTriangle, Loader, Github, MoreHorizontal } from 'lucide-svelte';
	import Icon from '@spectacular/skeleton/components/icons/Icon.svelte';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { Logger } from '@spectacular/utils';
	import { page } from '$app/stores';
	import * as m from '$i18n/messages';
	import { dev } from '$app/environment';

	export let data;
	const log = new Logger('auth:signin');

	const {
		form,
		delayed,
		timeout,
		enhance,
		errors,
		constraints,
		message,
		tainted,
		posted,
		submitting,
		capture,
		restore
	} = superForm(data.form, {
		dataType: 'json',
		taintedMessage: null,
		syncFlashMessage: false,
		delayMs: 100,
		timeoutMs: 4000,
		onError({ result }) {
			// TODO:
			// message.set(result.error.message)
			log.error('superForm', { result });
		}
	});

	export const snapshot = { capture, restore };
</script>

<svelte:head>
	<title>Datablocks | Signin</title>
	<meta name="description" content="Login Account" />
</svelte:head>

<!-- Form Level Errors / Messages -->
{#if $message || $errors._errors}
	<aside class="alert variant-filled-error mt-6" transition:fade|local={{ duration: 200 }}>
		<!-- Icon -->
		<!-- <AlertTriangle /> -->
		<!-- Message -->
		<div class="alert-message" class:invalid={$page.status >= 400}>
			{#if $message}
				<p class="font-medium" class:invalid={$page.status >= 400}>{$message.message}</p>
			{/if}
			{#if $errors._errors}
				<ul class="list">
					{#each $errors._errors as error}
						<li>
							<span><AlertTriangle /></span>
							<span class="flex-auto">{error}</span>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
		<!-- Actions -->
		<!-- <div class="alert-actions">
		<button class="btn-icon variant-filled"><X /></button>
	</div> -->
	</aside>
{/if}

<form method="POST" use:enhance>
	<div class="mt-6">
		<label class="label">
			<span class="sr-only">{m.auth_forms_email_label()}</span>
			<input
				id="email"
				name="email"
				type="email"
				class="input"
				autocomplete="email"
				placeholder={m.auth_forms_email_placeholder()}
				data-invalid={$errors.email}
				bind:value={$form.email}
				class:input-error={$errors.email}
				{...$constraints.email}
			/>
			{#if $errors.email}
				<small>{$errors.email}</small>
			{/if}
		</label>
	</div>

	<div class="mt-6">
		<label class="label">
			<span class="sr-only">{m.auth_forms_password_label()}</span>
			<input
				id="password"
				name="password"
				type="password"
				class="input"
				placeholder={m.auth_forms_password_placeholder()}
				data-invalid={$errors.password}
				bind:value={$form.password}
				class:input-error={$errors.password}
				{...$constraints.password}
			/>
			{#if $errors.password}
				<small>{$errors.password}</small>
			{/if}
		</label>
	</div>
	<div class="mt-6">
		<button type="submit" class="variant-filled-primary btn w-full"
			>{m.auth_labels_signin()}</button
		>
	</div>
</form>

<!-- Divider -->
<div class="my-8 flex items-center">
	<div class="grow border-b border-slate-400"></div>
	<span class="shrink px-1 pb-1 text-xs uppercase text-gray-500">Or</span>
	<div class="grow border-b border-slate-400"></div>
</div>

<form method="POST" action="/auth/sign-in">
	<div class="mt-6">
		<label class="label">
			<span class="sr-only">{m.auth_forms_email_label()}</span>
			<input
				id="email"
				name="email"
				type="email"
				placeholder={m.auth_forms_email_placeholder()}
				autocomplete="email"
				class="input"
			/>
		</label>
	</div>
	<div class="mt-6">
		<button type="submit" class="variant-filled-primary btn w-full">
			{#if $timeout}
				<MoreHorizontal class="animate-ping" />
			{:else if $delayed}
				<Loader class="animate-spin" />
			{:else}
				{m.auth_labels_signin_with_email()}
			{/if}
		</button>
	</div>
</form>

<!-- Divider -->
<div class="my-8 flex items-center">
	<div class="grow border-b border-slate-400"></div>
	<span class="shrink px-1 pb-1 text-xs uppercase text-gray-500">Or continue with</span>
	<div class="grow border-b border-slate-400"></div>
</div>

<div class="flex flex-row justify-evenly">
	<button type="button" class="variant-filled-warning btn-icon"><Icon name="google" /></button>
	<button type="button" class="variant-filled-secondary btn-icon"><Github /></button>
	<button type="button" class="variant-filled-error btn-icon"><Icon name="microsoft" /></button>
</div>

<!--
<div class="flex flex-col md:flex-row justify-evenly space-x-1 space-y-4">
	<button type="button" class="btn variant-filled-warning">
		<span><Icon name="google" /></span>
		<span>Google</span>
	</button>
	<button type="button" class="btn variant-filled-success">
		<span><Github /></span>
		<span>GitHub</span>
	</button>
		<button type="button" class="btn variant-filled-error">
		<span><Icon name="microsoft" /></span>
		<span>AzureAD</span>
	</button>
	</button>
		<button type="button" class="btn variant-filled-error">
		<span><Icon name="microsoft" /></span>
		<span>PingID</span>
	</button>
</div>
 -->

<div class="mt-10 flex flex-row items-center justify-center">
	<a href="/auth/password/reset" class="font-semibold">{m.auth_labels_forgot_password()}</a>
</div>

{#if dev}
	<br />
	<SuperDebug
		label="Miscellaneous"
		status={false}
		data={{
			message: $message,
			submitting: $submitting,
			delayed: $delayed,
			timeout: $timeout,
			posted: $posted
		}}
	/>
	<br />
	<SuperDebug label="Form" data={$form} />
	<br />
	<SuperDebug label="Tainted" status={false} data={$tainted} />
	<br />
	<SuperDebug label="Errors" status={false} data={$errors} />
	<br />
	<SuperDebug label="Constraints" status={false} data={$constraints} />
	<!-- <br />
 	<SuperDebug label="$page data" status={false} data={$page} /> -->
{/if}
