<script lang="ts">
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import * as m from '$i18n/messages';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { NHOST_SESSION_KEY } from '$lib/constants.js';
import { pwSchema, pwlSchema } from '$lib/schema/user';
import { isLoadingForm } from '$lib/stores/loading';
import { nhost } from '$lib/stores/user';
import { getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell } from '@spectacular/skeleton/components';
import { Icon } from '@spectacular/skeleton/components/icons';
import { Logger } from '@spectacular/utils';
// import { SiGithub } from "@icons-pack/svelte-simple-icons";
import { AlertTriangle, Fingerprint, Github, Loader, Mail, MoreHorizontal } from 'lucide-svelte';
import { fade } from 'svelte/transition';
import SuperDebug, { setError, setMessage, superForm } from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';

export let data;
const log = new Logger('auth:signin:browser');
const toastStore = getToastStore();

const {
  form: pwForm,
  delayed: pwDelayed,
  timeout: pwTimeout,
  enhance: pwEnhance,
  errors: pwErrors,
  constraints: pwConstraints,
  message: pwMessage,
  tainted: pwTainted,
  posted: pwPosted,
  submitting: pwSubmitting,
  formId: pwFormId,
  capture,
  restore,
} = superForm(data.pwForm, {
  id: 'password-form',
  dataType: 'json',
  taintedMessage: null,
  syncFlashMessage: false,
  delayMs: 100,
  timeoutMs: 4000,
  validators: zodClient(pwSchema),
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
  clearOnSubmit: 'errors-and-message',
  delayMs: 100,
  timeoutMs: 4000,
  validators: zodClient(pwlSchema),
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

async function waSignin() {
  if ($pwlErrors.email) {
    handleMessage({ type: 'error', message: 'Invalid email' } as const, toastStore);
  } else {
    const { session, error: signInError } = await nhost.auth.signIn({ email: $pwlForm.email, securityKey: true });
    if (session) {
      goto('/dashboard');
      handleMessage({ type: 'success', message: 'Signin sucessfull 😎' } as const, toastStore);
    } else {
      log.error(signInError);
      handleMessage({ type: 'error', message: `Signin failed: ${signInError?.message}` } as const, toastStore);
    }
  }
}
// Reactivity
pwDelayed.subscribe((v) => ($isLoadingForm = v));
pwlDelayed.subscribe((v) => ($isLoadingForm = v));

$pwForm.redirectTo = $page.url.searchParams.get('redirectTo') ?? $pwForm.redirectTo;
$pwlForm.redirectTo = $page.url.searchParams.get('redirectTo') ?? $pwlForm.redirectTo;
</script>

<svelte:head>
  <title>Datablocks | Signin</title>
  <meta name="description" content="Login Account" />
</svelte:head>

<!-- Form Level Errors / Messages -->
{#if $pwMessage}
  <aside
    class="alert mt-6"
    class:variant-filled-success={$pwMessage.type == 'success'}
    class:variant-filled-error={$pwMessage.type == 'error'}
    class:variant-filled-warning={$pwMessage.type == 'warning'}
    transition:fade|local={{ duration: 200 }}
  >
    <!-- Icon -->
    <!-- <AlertTriangle /> -->
    <!-- Message -->
    <div class="alert-message">
      {#if $pwMessage}
        <p class="font-medium">{$pwMessage.message}</p>
      {/if}
    </div>
    <!-- Actions -->
    <!-- <div class="alert-actions">
			<button class="btn-icon variant-filled"><X /></button>
		</div> -->
  </aside>
{/if}
{#if $pwErrors._errors}
  <aside class="alert mt-6" class:variant-filled-error={$page.status >= 400} transition:fade|local={{ duration: 200 }}>
    <div class="alert-message">
      <ul class="list">
        {#each $pwErrors._errors as error}
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
<form method="POST" action="/signin?/password" use:pwEnhance>
  <input type="hidden" name="__superform_id" bind:value={$pwFormId} />
  <div class="mt-6">
    <label class="label">
      <span class="sr-only">{m.auth_forms_email_label()}</span>
      <input
        name="email"
        type="email"
        class="input"
        autocomplete="email"
        placeholder={m.auth_forms_email_placeholder()}
        data-invalid={$pwErrors.email}
        bind:value={$pwForm.email}
        class:input-error={$pwErrors.email}
        {...$pwConstraints.email}
      />
      {#if $pwErrors.email}
        <small>{$pwErrors.email}</small>
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
        data-invalid={$pwErrors.password}
        bind:value={$pwForm.password}
        class:input-error={$pwErrors.password}
        {...$pwConstraints.password}
      />
      {#if $pwErrors.password}
        <small>{$pwErrors.password}</small>
      {/if}
    </label>
  </div>
  <div class="mt-6">
    <button type="submit" class="variant-filled-primary btn w-full">
      {#if $pwTimeout}
        <MoreHorizontal class="animate-ping" />
      {:else if $pwDelayed}
        <Loader class="animate-spin" />
      {:else}
        {m.auth_labels_signin()}
      {/if}
    </button>
  </div>
</form>

<div class="mt-5 flex flex-row items-center justify-center">
  <a href="/reset" class="anchor font-semibold">{m.auth_labels_forgot_password()}</a>
</div>

<!-- Divider -->
<div class="my-8 flex items-center">
  <div class="grow border-b border-slate-400"></div>
  <span class="shrink px-1 pb-1 text-xs uppercase text-gray-500">Or</span>
  <div class="grow border-b border-slate-400"></div>
</div>

<!-- Signin with email : Magic Link Passwordless Authentication -->
<form method="POST" use:pwlEnhance>
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
  <div class="mt-6 flex justify-between">
    <button type="submit" formaction="/signin?/passwordless" class="variant-filled-primary btn">
      {#if $pwlTimeout}
        <MoreHorizontal class="animate-ping" />
      {:else if $pwlDelayed}
        <Loader class="animate-spin" />
      {:else}
        {m.auth_labels_signin_with_email()} <Mail class="pl-2" />
      {/if}
    </button>
    <button type="button" formaction="/signin?/webauthn" on:click|preventDefault={waSignin} class="variant-filled-primary btn">
        {m.auth_labels_signin_with_webauthn()} <Fingerprint class="pl-2"/>
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
      message: $pwMessage,
      submitting: $pwSubmitting,
      delayed: $pwDelayed,
      timeout: $pwTimeout,
      posted: $pwPosted,
    }}
  />
  <br />
  <SuperDebug label="Password Form" data={$pwForm} />
  <br />
  <SuperDebug label="Tainted" status={false} data={$pwTainted} />
  <br />
  <SuperDebug label="Errors" status={false} data={$pwErrors} />
  <br />
  <SuperDebug label="Constraints" status={false} data={$pwConstraints} />
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
