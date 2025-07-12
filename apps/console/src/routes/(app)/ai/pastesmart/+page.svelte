<script lang="ts">
import * as m from '$i18n/messages';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { smartPaste } from '$lib/smart/actions';
import { SmartSupport } from '$lib/smart/components';
import { getLoadingState } from '$lib/stores/loading';
import { DebugShell } from '$lib/ui/components';
import { Alerts, ErrorMessage } from '$lib/ui/components/form';
import { Logger } from '@repo/utils';
import { getToastStore, SlideToggle } from '@skeletonlabs/skeleton';
import * as Form from 'formsnap';
import { Loader, MoreHorizontal, Sparkles } from 'lucide-svelte';
import { writable } from 'svelte/store';
import SuperDebug, { defaults, setError, superForm } from 'sveltekit-superforms';
import { zod4, zod4Client } from 'sveltekit-superforms/adapters';
import Sample from './sample.svelte';
import { personJsonSchema as jsonSchema, type Person, personSchema } from './schema.js';

const log = new Logger('ai:smart:browser');
export let data;

// Variables
const toastStore = getToastStore();
const loadingState = getLoadingState();
let loading = writable(false);
let smartError = writable<string>();
let useLocal = false;

// Search form
// const form = superForm(defaults(schemasafe(personSchema)), {
const form = superForm(defaults(zod4(personSchema)), {
  id: 'smart-past-form',
  dataType: 'json',
  taintedMessage: null,
  syncFlashMessage: false,
  delayMs: 100,
  timeoutMs: 4000,
  validators: zod4Client(personSchema),
  // validators: schemasafe(personSchema),
  onError({ result }) {
    // TODO:
    // message.set(result.error.message)
    log.error('form submit error:', { result });
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
  formId,
  enhance,
  capture,
  restore,
} = form;

export const snapshot = { capture, restore };

// Functions
function handlePaste(event: CustomEvent<Person>) {
  const { detail } = event;
  $formData.firstName = detail.firstName;
  $formData.lastName = detail.lastName;
  $formData.phoneNumber = detail.phoneNumber;
  $formData.email = detail.email;
  $formData.line1 = detail.line1;
  $formData.line2 = detail.line2;
  $formData.city = detail.city;
  $formData.state = detail.state;
  $formData.zip = detail.zip;
  $formData.country = detail.country;
}

function handleError(event: CustomEvent<Error>) {
  log.error(event.detail.message);
  $smartError = event.detail.message;
}

// Reactivity
$: loadingState.setFormLoading($delayed);
$: loadingState.setFormLoading($loading);
</script>

<div class="page-container">
  <div class="page-section">
    <header class="flex justify-between">
      <h1 class="h1">Smart Paste Demo</h1>
    </header>

    <SmartSupport />

    <!-- Form -->
    <form
      method="POST"
      class="card shadow-lg"
      use:enhance
      on:smartPaste={handlePaste}
      on:smartError={handleError}
      use:smartPaste={{api: '/api/smartpaste', loading, jsonSchema, useLocal }}
    >
      <header class="card-header">
        <!-- Form Level Errors / Messages -->
        <Alerts errors={$errors._errors} message={$message} />
        <ErrorMessage error={$smartError} />
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
                  <Form.FieldErrors class="data-[fs-error]:text-error-500" />
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
            <Form.Field {form} name="email">
              <Form.Control let:attrs>
                <div class="grid gap-2">
                  <Form.Label>Email</Form.Label>
                  <input
                    class="input"
                    {...attrs}
                    bind:value={$formData.email}
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
      </section>
      <hr class="opacity-50" />
      <footer class="p-4 card-footer flex justify-between items-center space-x-4">
        <div class="flex items-center space-x-2">
          <Sparkles class="inline-block" />
          <span>
            <strong>Smart Fill</strong>
            <span class="text-sm text-gray-500">
              Press <kbd class="kbd">⌘ + C</kbd> to copy any text, then <kbd class="kbd">⌘ + V</kbd> anywhere in the form.
            </span>
          </span>
          <SlideToggle name="slide" bind:checked={useLocal} size="sm" disabled={!("aibrow" in window)}>Use Local</SlideToggle>
        </div>
        <!-- Form Action Buttons -->
         <section>
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
          type="submit"
          class="variant-ghost-success btn"
          disabled={!$tainted || $submitting}
        >
          {#if $timeout}
            <MoreHorizontal class="m-2 h-4 w-4 animate-ping" />
          {:else if $delayed}
            <Loader class="m-2 h-4 w-4 animate-spin" />
          {:else}
            {m.buttons_create()}
          {/if}
      </button>

        </section>
      </footer>
    </form>
    <!-- samples -->
    <Sample header="sample text to copy" content="my name is Simon	Villarreal, my phone number is (904) 333-3212, email: simon.villarreal@youtube.com my address is : 334 Four Winds, Riverside, CA 92501, USA" />
    <Sample header="sample text to copy" content="Dear Sir/Madam,

I hope this message finds you well. My name is Alan Davies, and I am reaching out to introduce my web development services that can help elevate your business's online presence.

In today's digital age, a robust and user-friendly website is crucial for any business looking to stand out and succeed. I specialize in creating custom, responsive, and aesthetically pleasing websites tailored to meet your specific business needs and goals. Whether you're looking to revamp your existing website or build a new one from scratch, I am here to help.

What I Offer:
* Custom Web Design: Tailored layouts that reflect your brand image
* Responsive Design: Ensures your website looks great on all devices
* E-commerce Solutions: Seamless online shopping experiences
* SEO Optimization: Enhance your visibility on search engines
* Ongoing Support & Maintenance: Reliable, ongoing services to keep your website running smoothly.
* I would love the opportunity to discuss how I can contribute to your business's success by creating or improving your online presence.

Please feel free to contact me at alan@mydemocorp.io or (555) 555-1234 to arrange a convenient time for a consultation.

Thank you for considering my services. I look forward to the possibility of working together to achieve your online goals.

Warm regards,

Alan,

MyDemoCorp
132 My Street, Kingston, New York 12401" />
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
          timeout: $timeout,
          formId: $formId,
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
      <br />
    </DebugShell>
  </div>
</div>
