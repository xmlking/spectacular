<script lang="ts">
import { getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell } from '@spectacular/skeleton/components';
import { Icon } from '@spectacular/skeleton/components/icons';
import { Logger } from '@spectacular/utils';
import { AlertTriangle, Github, Loader, MoreHorizontal } from 'lucide-svelte';
import { fade } from 'svelte/transition';
import SuperDebug, { superForm } from 'sveltekit-superforms';
import { isLoadingForm } from '$lib/stores/loading';
import { handleMessage } from '$lib/components/layout/toast-manager';
import * as m from '$i18n/messages';
import { page } from '$app/stores';

export let data;
const log = new Logger('auth:signin');
const toastStore = getToastStore();

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
  formId,
  capture,
  restore,
} = superForm(data.pwForm, {
  id: 'password-form',
  dataType: 'json',
  taintedMessage: null,
  syncFlashMessage: false,
  delayMs: 100,
  timeoutMs: 4000,
  onError({ result }) {
    // TODO:
    // message.set(result.error.message)
    log.error('signin password error:', { result });
  },
  onUpdated({ form }) {
    if (form.message) {
      handleMessage(form.message, toastStore);
    }
  },
});

export const snapshot = { capture, restore };

const {
  form: pwlForm,
  delayed: pwlDelayed,
  timeout: pwlTimeout,
  enhance: pwlEnhance,
  errors: pwlErrors,
  constraints: pwlConstraints,
  message: pwlMessage,
  tainted: pwlTainted,
  posted: pwlPosted,
  submitting: pwlSubmitting,
  formId: pwlFormId,
} = superForm(data.pwlForm, {
  id: 'passwordless-form',
  dataType: 'json',
  taintedMessage: null,
  syncFlashMessage: false,
  delayMs: 100,
  timeoutMs: 4000,
  onError({ result }) {
    // TODO:
    // message.set(result.error.message)
    log.error('signin passwordless error:', { result });
  },
  onUpdated({ form }) {
    if (form.message) {
      handleMessage(form.message, toastStore);
    }
  },
});

delayed.subscribe((v) => ($isLoadingForm = v));
pwlDelayed.subscribe((v) => ($isLoadingForm = v));
</script>

<svelte:head>
  <title>Datablocks | Signin</title>
  <meta name="description" content="Login Account" />
</svelte:head>

<!-- Form Level Errors / Messages -->
{#if $message}
  <aside
    class="alert mt-6"
    class:variant-filled-success={$message.type == 'success'}
    class:variant-filled-error={$message.type == 'error'}
    class:variant-filled-warning={$message.type == 'warning'}
    transition:fade|local={{ duration: 200 }}
  >
    <!-- Icon -->
    <!-- <AlertTriangle /> -->
    <!-- Message -->
    <div class="alert-message">
      {#if $message}
        <p class="font-medium">{$message.message}</p>
      {/if}
    </div>
    <!-- Actions -->
    <!-- <div class="alert-actions">
			<button class="btn-icon variant-filled"><X /></button>
		</div> -->
  </aside>
{/if}
{#if $errors._errors}
  <aside class="alert mt-6" class:variant-filled-error={$page.status >= 400} transition:fade|local={{ duration: 200 }}>
    <div class="alert-message">
      <ul class="list">
        {#each $errors._errors as error}
          <li>
            <span><AlertTriangle /></span>
            <span class="flex-auto">{error}</span>
          </li>
        {/each}
      </ul>
    </div>
  </aside>
{/if}

<!-- Form Level Errors / Messages for Passwordless -->
{#if $pwlMessage}
  <aside
    class="alert mt-6"
    class:variant-filled-success={$pwlMessage.type == 'success'}
    class:variant-filled-error={$pwlMessage.type == 'error'}
    class:variant-filled-warning={$pwlMessage.type == 'warning'}
    transition:fade|local={{ duration: 200 }}
  >
    <div class="alert-message">
      {#if $pwlMessage}
        <p class="font-medium">{$pwlMessage.message}</p>
      {/if}
    </div>
  </aside>
{/if}
{#if $pwlErrors._errors}
  <aside class="alert mt-6" class:variant-filled-error={$page.status >= 400} transition:fade|local={{ duration: 200 }}>
    <div class="alert-message">
      <ul class="list">
        {#each $pwlErrors._errors as error}
          <li>
            <span><AlertTriangle /></span>
            <span class="flex-auto">{error}</span>
          </li>
        {/each}
      </ul>
    </div>
  </aside>
{/if}

<!-- Signin with email/password -->
<form method="POST" action="/signin?/password" use:enhance>
  <input type="hidden" name="__superform_id" bind:value={$formId} />
  <div class="mt-6">
    <label class="label">
      <span class="sr-only">{m.auth_forms_email_label()}</span>
      <input
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
    <button type="submit" class="variant-filled-primary btn w-full">
      {#if $timeout}
        <MoreHorizontal class="animate-ping" />
      {:else if $delayed}
        <Loader class="animate-spin" />
      {:else}
        {m.auth_labels_signin()}
      {/if}
    </button>
  </div>
</form>

<div class="mt-5 flex flex-row items-center justify-center">
  <a href="/password-reset" class="font-semibold">{m.auth_labels_forgot_password()}</a>
</div>

<!-- Divider -->
<div class="my-8 flex items-center">
  <div class="grow border-b border-slate-400"></div>
  <span class="shrink px-1 pb-1 text-xs uppercase text-gray-500">Or</span>
  <div class="grow border-b border-slate-400"></div>
</div>

<!-- Signin with email : Magic Link Passwordless Authentication -->
<form method="POST" action="/signin?/passwordless" use:pwlEnhance>
  <input type="hidden" name="__superform_id" bind:value={$pwlFormId} />
  <div class="mt-6">
    <label class="label">
      <span class="sr-only">{m.auth_forms_email_label()}</span>
      <input
        name="email"
        type="email"
        class="input"
        autocomplete="email"
        placeholder={m.auth_forms_email_placeholder()}
        data-invalid={$pwlErrors.email}
        bind:value={$pwlForm.email}
        class:input-error={$pwlErrors.email}
        {...$pwlConstraints.email}
      />
      {#if $pwlErrors.email}
        <small>{$pwlErrors.email}</small>
      {/if}
    </label>
  </div>
  <div class="mt-6">
    <button type="submit" class="variant-filled-primary btn w-full">
      {#if $pwlTimeout}
        <MoreHorizontal class="animate-ping" />
      {:else if $pwlDelayed}
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

<!-- Signin with social -->
<form method="POST">
  <div class="flex flex-row justify-evenly">
    <button type="submit" formaction="/signin?/google" class="variant-filled-warning btn-icon"
      ><Icon name="google" /></button
    >
    <button type="submit" formaction="/signin?/github" class="variant-filled-secondary btn-icon"><Github /></button>
    <button type="submit" formaction="/signin?/azuread" class="variant-filled-error btn-icon"
      ><Icon name="microsoft" /></button
    >
  </div>
</form>

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
		<button type="button" class="btn variant-filled-error">
		<span><Icon name="microsoft" /></span>
		<span>PingID</span>
	</button>
</div>
-->

<DebugShell>
  <SuperDebug
    label="Password Miscellaneous"
    status={false}
    data={{
      message: $message,
      submitting: $submitting,
      delayed: $delayed,
      timeout: $timeout,
      posted: $posted,
    }}
  />
  <br />
  <SuperDebug label="Password Form" data={$form} />
  <br />
  <SuperDebug label="Tainted" status={false} data={$tainted} />
  <br />
  <SuperDebug label="Errors" status={false} data={$errors} />
  <br />
  <SuperDebug label="Constraints" status={false} data={$constraints} />
  <!-- <br />
 	<SuperDebug label="$page data" status={false} data={$page} /> -->
  <br />
  <SuperDebug
    label="Passwordless Miscellaneous"
    status={false}
    data={{
      message: $pwlMessage,
      submitting: $pwlSubmitting,
      delayed: $pwlDelayed,
      timeout: $pwlTimeout,
      posted: $pwlPosted,
    }}
  />
  <br />
  <SuperDebug label="Passwordless Form" data={$pwlForm} />
  <br />
  <SuperDebug label="Passwordless Tainted" status={false} data={$pwlTainted} />
  <br />
  <SuperDebug label="Passwordless Errors" status={false} data={$pwlErrors} />
  <br />
  <SuperDebug label="Passwordless Constraints" status={false} data={$pwlConstraints} />
</DebugShell>
