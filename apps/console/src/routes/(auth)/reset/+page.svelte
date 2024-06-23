<script lang="ts">
import { page } from '$app/stores';
import * as m from '$i18n/messages';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { resetPasswordSchema } from '$lib/schema/user';
import { isLoadingForm } from '$lib/stores/loading';
import { getToastStore } from '@skeletonlabs/skeleton';
// import { ConicGradient } from '@skeletonlabs/skeleton';
// import type { ConicStop } from '@skeletonlabs/skeleton';
import { DebugShell } from '@spectacular/skeleton/components';
import { Logger } from '@spectacular/utils';
import { AlertTriangle, Loader, MoreHorizontal } from 'lucide-svelte';
import { fade } from 'svelte/transition';
import SuperDebug, { superForm } from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';

export let data;
const log = new Logger('auth:reset:browser');
const toastStore = getToastStore();

const { form, delayed, timeout, enhance, errors, constraints, message, tainted, posted, submitting, capture, restore } =
  superForm(data.form, {
    dataType: 'json',
    taintedMessage: null,
    syncFlashMessage: false,
    delayMs: 100,
    timeoutMs: 4000,
    validators: zodClient(resetPasswordSchema),
    onError({ result }) {
      // TODO:
      // message.set(result.error.message)
      log.error('reset password error:', { result });
    },
    onUpdated({ form }) {
      if (form.message) {
        handleMessage(form.message, toastStore);
      }
    },
  });

export const snapshot = { capture, restore };

// Reactivity
delayed.subscribe((v) => ($isLoadingForm = v));

// const conicStops: ConicStop[] = [
//   { color: 'transparent', start: 0, end: 25 },
//   { color: 'rgb(var(--color-primary-900))', start: 75, end: 100 }
// ];
</script>

<svelte:head>
  <title>Datablocks | Reset</title>
  <meta name="description" content="Reset Password" />
</svelte:head>

<h3 class="h3 pt-5">{m.auth_messages_reset_password_healding()}</h3>
<small class="text-gray-500">{m.auth_messages_reset_password_subheading()}</small>

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
      <h3 class="h3">{m.auth_labels_reset_password_problem()}</h3>
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
    <button type="submit" class="variant-filled-primary btn w-full">
      {#if $timeout}
        <MoreHorizontal class="animate-ping" />
      {:else if $delayed}
        <Loader class="animate-spin" />
        <!-- <ConicGradient stops={conicStops} spin width="w-6" /> -->
      {:else}
        {m.auth_labels_reset_password()}
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
