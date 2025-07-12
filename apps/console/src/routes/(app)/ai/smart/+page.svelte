<script lang="ts">
import { handleMessage } from '$lib/components/layout/toast-manager';
import { SPECIALIZATIONS } from '$lib/constants.js';
import * as Smart from '$lib/smart/components';
import { getLoadingState } from '$lib/stores/loading';
import { DebugShell } from '$lib/ui/components';
import { Alerts } from '$lib/ui/components/form';
import { Logger } from '@repo/utils';
import { getToastStore } from '@skeletonlabs/skeleton';
import * as Form from 'formsnap';
import SuperDebug, { dateProxy, defaults, setError, setMessage, superForm } from 'sveltekit-superforms';
import { zod4, zod4Client } from 'sveltekit-superforms/adapters';
import { aiSchema } from './schema.js';

const log = new Logger('ai:smart:browser');
export let data;

// Variables
const toastStore = getToastStore();
const loadingState = getLoadingState();

// Search form
const form = superForm(defaults(zod4(aiSchema)), {
  id: 'smart-form',
  dataType: 'json',
  taintedMessage: null,
  syncFlashMessage: false,
  delayMs: 100,
  timeoutMs: 4000,
  validators: zod4Client(aiSchema),
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
  isTainted,
  capture,
  restore,
} = form;

export const snapshot = { capture, restore };

// Reactivity
const startDate = dateProxy(form, 'startDate', { format: 'datetime-local' });
const endDate = dateProxy(form, 'endDate', { format: 'datetime-local' });
$: loadingState.setFormLoading($delayed);
</script>

<div class="page-container">
  <div class="page-section">
    <header class="flex justify-between">
      <h1 class="h1">Smart Components Demo</h1>
    </header>

    <Smart.Support />

    <!-- Form -->
    <form method="POST" class="card shadow-lg" use:enhance>
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
                  class="input data-[fs-error]:input-error"
                  {...attrs}
                  bind:value={$startDate}
                />
              <!-- <input
                type="datetime-local"
                class="input data-[fs-error]:input-error"
                {...attrs}
                bind:value={$startDate}
              /> -->
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
                <Smart.Date
                  class="input data-[fs-error]:input-error"
                  {...attrs}
                  bind:value={$endDate}
                  {...$constraints.endDate}
                />
                <!-- <Smart.DatePicker
                  class="input data-[fs-error]:input-error"
                  {...attrs}
                  bind:startDate={$endDate}
                  {...$constraints.endDate}
                /> -->
              <!-- <input
                type="datetime-local"
                class="input data-[fs-error]:input-error"
                {...attrs}
                bind:value={$endDate}
              /> -->
              </Form.Control>
              <Form.Description class="sr-only"
                >End Date Desc</Form.Description
              >
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

<!--Smart-Chat-->
<!--<Smart.Chat />-->
