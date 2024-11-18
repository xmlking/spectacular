<script lang="ts">
import { handleMessage } from '$lib/components/layout/toast-manager';
import { SmartPaste } from '@spectacular/smart';
import { getLoadingState } from '$lib/stores/loading';
import { getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell } from '@spectacular/skeleton/components';
import { Alerts } from '@spectacular/skeleton/components/form';
import { Logger } from '@spectacular/utils';
import * as Form from 'formsnap';
import { fade } from 'svelte/transition';
import SuperDebug, { superForm } from 'sveltekit-superforms';
import { onMount } from 'svelte';

const log = new Logger('ai:smart:browser');
export let data;

// Variables
const toastStore = getToastStore();
const loadingState = getLoadingState();

const form = superForm(data.form, {
  id: 'ai-form',
  dataType: 'json',
  taintedMessage: null,
  syncFlashMessage: false,
  delayMs: 100,
  timeoutMs: 4000,
  onError({ result }) {
    // TODO:
    // message.set(result.error.message)
    log.error('ai error:', { result });
  },
  onUpdated({ form }) {
    if (form.message) {
      handleMessage(form.message, toastStore);
    }
  },
});

const {
  form: formData,
  message,
  errors,
  tainted,
  reset,
  isTainted,
  submitting,
  delayed,
  timeout,
  constraints,
  enhance,
  capture,
  restore,
} = form;

export const snapshot = { capture, restore };
function handlePasted(event: CustomEvent) {
  const content = event.detail;
  $formData.firstName = content.firstName;
  $formData.lastName = content.lastName;
  $formData.phoneNumber = content.phoneNumber;
  $formData.line1 = content.line1;
  $formData.line2 = content.line2;
  $formData.city = content.city;
  $formData.state = content.state;
  $formData.zip = content.zip;
  $formData.country = content.country;
}

// Functions
const handlePaste = async (event: ClipboardEvent) => {
  event.preventDefault();
  const clipboard = event.clipboardData;
  if (!clipboard) return;
  const data = clipboard.getData('text/plain').trim();
  console.log('Clipboard Data:', data);
};

// Reactivity
$: loadingState.setFormLoading($delayed);
</script>

<svelte:window on:paste={handlePaste} />

<div class="page-container">
  <div class="page-section">
    <header class="flex justify-between">
      <h1 class="h1">Smart Paste Demo</h1>
    </header>
    <!-- Form -->
    <form method="POST" use:enhance class="card shadow-lg">
      <header class="card-header">
        <!-- Form Level Errors / Messages -->
        <Alerts errors={$errors._errors} message={$message} />
      </header>
      <section class="p-6 space-y-4">
        <div class="md:grid-cols-col-span-3 mb-6 grid gap-6 lg:grid-cols-6">
          <div class="col-span-3">
            <Form.Field {form} name="firstName">
              <Form.Control let:attrs>
                <div class="grid gap-2">
                  <Form.Label>First Name</Form.Label>
                  <input
                    {...attrs}
                    class="input"
                    bind:value={$formData.firstName}
                  />
                  <Form.FieldErrors class="data-fs-[error=true]:bg-red-200" />
                </div>
              </Form.Control>
            </Form.Field>
          </div>
          <div class="col-span-3">
            <Form.Field {form} name="lastName">
              <Form.Control let:attrs>
                <div class="grid gap-2">
                  <Form.Label>Last Name</Form.Label>
                  <input
                    class="input"
                    {...attrs}
                    bind:value={$formData.lastName}
                  />
                </div>
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          </div>
          <div class="col-span-3">
            <Form.Field {form} name="phoneNumber">
              <Form.Control let:attrs>
                <div class="grid gap-2">
                  <Form.Label>Phone Number</Form.Label>
                  <input
                    class="input"
                    {...attrs}
                    bind:value={$formData.phoneNumber}
                  />
                </div>
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          </div>
          <div class="col-span-3">
            <Form.Field {form} name="line1">
              <Form.Control let:attrs>
                <div class="grid gap-2">
                  <Form.Label>Line 1</Form.Label>
                  <input
                    class="input"
                    {...attrs}
                    bind:value={$formData.line1}
                  />
                </div>
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          </div>
          <div class="col-span-3">
            <Form.Field {form} name="line2">
              <Form.Control let:attrs>
                <div class="grid gap-2">
                  <Form.Label>Line 2</Form.Label>
                  <input
                    class="input"
                    {...attrs}
                    bind:value={$formData.line2}
                  />
                </div>
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          </div>
          <div class="col-span-3">
            <Form.Field {form} name="city">
              <Form.Control let:attrs>
                <div class="grid gap-2">
                  <Form.Label>City</Form.Label>
                  <input class="input" {...attrs} bind:value={$formData.city} />
                </div>
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          </div>
          <div class="col-span-3">
            <Form.Field {form} name="state">
              <Form.Control let:attrs>
                <div class="grid gap-2">
                  <Form.Label>State</Form.Label>
                  <input
                    class="input"
                    {...attrs}
                    bind:value={$formData.state}
                  />
                </div>
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          </div>
          <div class="col-span-3">
            <Form.Field {form} name="zip">
              <Form.Control let:attrs>
                <div class="grid gap-2">
                  <Form.Label class="label">Zip</Form.Label>
                  <input class="input" {...attrs} bind:value={$formData.zip} />
                </div>
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          </div>
          <div class="col-span-3">
            <Form.Field {form} name="country">
              <Form.Control let:attrs>
                <div class="grid gap-2">
                  <Form.Label class="label">Country</Form.Label>
                  <input
                    class="input"
                    {...attrs}
                    bind:value={$formData.country}
                  />
                </div>
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          </div>
        </div>
        <!-- Form Action Buttons -->
        <button
          type="button"
          class="variant-ghost-secondary btn"
          on:click={() => history.back()}>Back</button
        >
        <button
          type="button"
          class="variant-ghost-warning btn"
          disabled={!$tainted}
          on:click={() => reset()}
        >
          Reset
        </button>

        <button
          class="variant-ghost-success btn"
          type="submit"
          disabled={!$tainted || $submitting}
        >
          {#if $submitting}
            <aside
              class="alert rounded-sm"
              transition:fade|local={{ duration: 400 }}
            >
              Saving..
            </aside>
          {:else}
            Create
          {/if}
        </button>
      </section>
      <hr class="opacity-50" />
      <footer class="p-4 card-footer flex justify-end items-center space-x-4">
        <p class="text-xs">
          On-Device AI: <span class="text-error-500 uppercase"
            >{window.ai?.languageModel !== undefined}</span
          >
        </p>
        <SmartPaste on:pasted={handlePasted} />
      </footer>
    </form>
    <!-- Debug -->
    <DebugShell label="AI Form">
      <SuperDebug
        label="Miscellaneous"
        status={false}
        data={{
          message: $message,
          isTainted: isTainted,
          submitting: $submitting,
          delayed: $delayed,
          timeout: $timeout
        }}
      />
      <br />
      <SuperDebug label="Form" data={$formData} />
      <br />
      <SuperDebug label="Tainted" status={false} data={$tainted} />
      <br />
      <SuperDebug label="Errors" status={false} data={$errors} />
      <br />
      <SuperDebug label="Constraints" status={false} data={$constraints} />
    </DebugShell>
  </div>
</div>
