<script lang="ts">
import { page } from '$app/stores';
import { PUBLIC_DEFAULT_ORGANIZATION } from '$env/static/public';
import * as m from '$i18n/messages';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { isLoadingForm } from '$lib/stores/loading';
import { getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell } from '@spectacular/skeleton/components';
import { Logger } from '@spectacular/utils';
import { AlertTriangle, Loader, MoreHorizontal } from 'lucide-svelte';
import { fade } from 'svelte/transition';
import SuperDebug, { superForm } from 'sveltekit-superforms';

export let data;
const log = new Logger('auth:signup');
const organizations = data.organizations ?? [PUBLIC_DEFAULT_ORGANIZATION];
const toastStore = getToastStore();

const { form, delayed, timeout, enhance, errors, constraints, message, tainted, posted, submitting, capture, restore } =
  superForm(data.form, {
    dataType: 'json',
    taintedMessage: null,
    syncFlashMessage: false,
    delayMs: 150,
    timeoutMs: 4000,
    onError({ result }) {
      // TODO:
      // message.set(result.error.message)
      log.error('signup error:', { result });
    },
    onUpdated({ form }) {
      if (form.message) {
        handleMessage(form.message, toastStore);
      }
    },
  });

export const snapshot = { capture, restore };

// Reactivity
// Used in apps/console/src/lib/components/layout/page-load-spinner.svelte
delayed.subscribe((v) => ($isLoadingForm = v));

$form.redirectTo = $page.url.searchParams.get('redirectTo') ?? $form.redirectTo;
// $: termsValue = $form.terms as Writable<boolean>;
</script>

<svelte:head>
  <title>Datablocks | Signup</title>
  <meta name="description" content="Create Account" />
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

<form method="POST" use:enhance>
  <div class="mt-6">
    <label class="label">
      <span class="sr-only">{m.auth_forms_first_organization_label()}</span>
      <select
        name="organization"
        class="select"
        placeholder={m.auth_forms_first_organization_placeholder()}
        data-invalid={$errors.organization}
        class:input-error={$errors.organization}
        bind:value={$form.organization}
        {...$constraints.organization}
      >
        <option value="">Select Organization</option>
        {#each organizations as org}
          <option value={org}>{org}</option>
        {/each}
      </select>
      {#if $errors.organization}
        <small>{$errors.organization}</small>
      {/if}
    </label>
  </div>
  <div class="mt-6">
    <label class="label">
      <span class="sr-only">{m.auth_forms_first_name_label()}</span>
      <input
        name="firstName"
        type="text"
        class="input"
        autocomplete="given-name"
        placeholder={m.auth_forms_first_name_placeholder()}
        data-invalid={$errors.firstName}
        bind:value={$form.firstName}
        class:input-error={$errors.firstName}
        {...$constraints.firstName}
      />
      {#if $errors.firstName}
        <small>{$errors.firstName}</small>
      {/if}
    </label>
  </div>
  <div class="mt-6">
    <label class="label">
      <span class="sr-only">{m.auth_forms_last_name_label()}</span>
      <input
        name="lastName"
        type="text"
        class="input"
        autocomplete="family-name"
        placeholder={m.auth_forms_last_name_placeholder()}
        data-invalid={$errors.lastName}
        bind:value={$form.lastName}
        class:input-error={$errors.lastName}
        {...$constraints.lastName}
      />
      {#if $errors.lastName}
        <small>{$errors.lastName}</small>
      {/if}
    </label>
  </div>
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
    <label class="label">
      <span class="sr-only">{m.auth_forms_confirm_password_label()}</span>
      <input
        name="confirmPassword"
        type="password"
        class="input"
        placeholder={m.auth_forms_confirm_password_placeholder()}
        data-invalid={$errors.confirmPassword}
        bind:value={$form.confirmPassword}
        class:input-error={$errors.password}
        {...$constraints.confirmPassword}
      />
      {#if $errors.confirmPassword}
        <small>{$errors.confirmPassword}</small>
      {/if}
    </label>
  </div>
  <div class="mt-6">
    <label for="terms" class="label">
      <input
        name="terms"
        type="checkbox"
        class="checkbox"
        data-invalid={$errors.terms}
        bind:checked={$form.terms}
        class:input-error={$errors.terms}
        {...$constraints.terms}
      />
      <span class="ml-2">
        I accept the
        <a href="/terms" class="text-primaryHover underline">terms</a>
        and
        <a href="/privacy" class="text-primaryHover underline">privacy policy</a>
        {#if $errors.terms}
          <small class="text-error-500">{$errors.terms}</small>
        {/if}
      </span>
    </label>
  </div>
  <div class="mt-6">
    <button type="submit" disabled={!$form.terms} class="variant-filled-primary btn w-full">
      {#if $timeout}
        <MoreHorizontal class="animate-ping" />
      {:else if $delayed}
        <Loader class="animate-spin" />
      {:else}
        {m.auth_labels_signup()}
      {/if}
    </button>
  </div>
</form>

<DebugShell>
  <SuperDebug
    label="Miscellaneous"
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
  <SuperDebug label="Form" data={$form} />
  <br />
  <SuperDebug label="Tainted" status={false} data={$tainted} />
  <br />
  <SuperDebug label="Errors" status={false} data={$errors} />
  <br />
  <SuperDebug label="Constraints" status={false} data={$constraints} />
  <!-- <br />
 	<SuperDebug label="$page data" status={false} data={$page} /> -->
</DebugShell>
