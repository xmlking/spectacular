<script lang="ts">
import { handleMessage } from '$lib/components/layout/toast-manager';
import * as Smart from '@spectacular/smart';
import { getLoadingState } from '$lib/stores/loading';
import { getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell } from '@spectacular/skeleton/components';
import { Alerts } from '@spectacular/skeleton/components/form';
import { Logger } from '@spectacular/utils';
import * as Form from 'formsnap';
import SuperDebug, { superForm } from 'sveltekit-superforms';
import { onMount } from 'svelte';
import { SPECIALIZATIONS } from '$lib/constants.js';
// import { zodClient } from 'sveltekit-superforms/adapters';
// import { aiSchema } from './schema.js';

const log = new Logger('ai:smart:browser');
export let data;

// Variables
const toastStore = getToastStore();
const loadingState = getLoadingState();

// Search form
const form = superForm(data.form, {
  id: 'ai-form',
  dataType: 'json',
  taintedMessage: null,
  syncFlashMessage: false,
  delayMs: 100,
  timeoutMs: 4000,
  // validators: zodClient(aiSchema),
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
  delayed,
  timeout,
  enhance,
  errors,
  constraints,
  message,
  tainted,
  submitting,
  formId,
  capture,
  restore,
} = form;

export const snapshot = { capture, restore };

// Reactivity
$: loadingState.setFormLoading($delayed);
</script>

<div class="page-container">
  <div class="page-section">
    <header class="flex justify-between">
      <h1 class="h1">Smart Components Demo</h1>
    </header>

    <Smart.Support />

    <!-- Form -->
    <form method="POST" use:enhance class="card shadow-lg">
      <header class="card-header">
        <!-- Form Level Errors / Messages -->
        <Alerts errors={$errors._errors} message={$message} />
      </header>
      <section class="p-6 space-y-4">
        <div>
          <Form.Field {form} name="commentOne">
            <Form.Control let:attrs>
              <Form.Label class="label">Comment One</Form.Label>
              <Smart.MagicSpellTextarea
                class="textarea data-[fs-error]:input-error"
                {...attrs}
                bind:value={$formData.commentOne}
                {...$constraints.commentOne}
                placeholder="It was a dark and stormy night..."
              />
            </Form.Control>
            <Form.Description class="sr-only"
              >Put Comment One description here</Form.Description
            >
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div>
          <Form.Field {form} name="commentTwo">
            <Form.Control let:attrs>
              <Form.Label class="label">Comment Two</Form.Label>
              <Smart.MagicSpellTextarea
                class="textarea data-[fs-error]:input-error"
                {...attrs}
                bind:value={$formData.commentTwo}
                {...$constraints.commentTwo}
                placeholder="It was a dark and stormy night..."
              />
            </Form.Control>
            <Form.Description class="sr-only"
              >Put Comment Two description here</Form.Description
            >
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div>
          <Form.Field {form} name="commentThree">
            <Form.Control let:attrs>
              <Form.Label class="label">Comment Three</Form.Label>
              <Smart.MagicSpellTextarea
                class="textarea data-[fs-error]:input-error"
                {...attrs}
                bind:value={$formData.commentThree}
                {...$constraints.commentThree}
                placeholder="It was a dark and stormy night..."
              />
            </Form.Control>
            <Form.Description class="sr-only"
              >Put Comment Three description here</Form.Description
            >
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
        <div class="grid gap-6 md:grid-cols-3">
          <div>
            <Form.Field {form} name="startDate">
              <Form.Control let:attrs>
                <Form.Label class="label">Start Date</Form.Label>
                <Smart.Date
                  class="textarea data-[fs-error]:input-error"
                  {...attrs}
                  bind:value={$formData.startDate}
                  {...$constraints.startDate}
                />
              </Form.Control>
              <Form.Description class="sr-only"
                >Start Date Desc</Form.Description
              >
              <Form.FieldErrors class="data-[fs-error]:text-error-500" />
            </Form.Field>
          </div>
          <div>
            <Form.Field {form} name="endDate">
              <Form.Control let:attrs>
                <Form.Label class="label">End Date</Form.Label>
                <Smart.DatePicker
                  class="textarea data-[fs-error]:input-error"
                  {...attrs}
                  bind:startDate={$formData.endDate}
                  {...$constraints.endDate}
                />
              </Form.Control>
              <Form.Description class="sr-only">End Date Desc</Form.Description>
              <Form.FieldErrors class="data-[fs-error]:text-error-500" />
            </Form.Field>
          </div>
          <div>
            <Form.Field {form} name="specialization">
              <Form.Control let:attrs>
                <Form.Label class="label">Provider Specialization</Form.Label>
                <Smart.ComboBox
                  items={SPECIALIZATIONS}
                  debounceWait={300}
                  bind:value={$formData.specialization}
                  {...$constraints.specialization}
                />
              </Form.Control>
              <Form.Description class="sr-only"
                >Provider Specialization Desc</Form.Description
              >
              <Form.FieldErrors class="data-[fs-error]:text-error-500" />
            </Form.Field>
          </div>
        </div>
      </section>
      <hr class="opacity-50" />
      <footer class="p-4 card-footer flex justify-end items-center space-x-4">
        <button type="submit" class="variant-filled-primary btn">submit</button>
      </footer>
    </form>
    <!-- Debug -->
    <DebugShell label="AI Form">
      <SuperDebug
        label="Miscellaneous"
        status={false}
        data={{
          message: $message,
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
