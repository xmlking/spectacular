<script lang="ts">
import { handleMessage } from '$lib/components/layout/toast-manager';
import * as Smart from '$lib/smart/components';
import { Support } from '$lib/smart/components';
import { getLoadingState } from '$lib/stores/loading';
import { DebugShell } from '$lib/ui/components';
import { Alerts } from '$lib/ui/components/form';
import { Logger } from '@repo/utils';
import { getToastStore } from '@skeletonlabs/skeleton';
import * as Form from 'formsnap';
import SuperDebug, { defaults, setError, setMessage, superForm } from 'sveltekit-superforms';
import { zod, zodClient } from 'sveltekit-superforms/adapters';
import { writingSchema } from './schema.js';

const log = new Logger('ai:writing:browser');

// Variables
const toastStore = getToastStore();
const loadingState = getLoadingState();

// form
const form = superForm(defaults(zod(writingSchema)), {
  id: 'writing-form',
  dataType: 'json',
  taintedMessage: null,
  syncFlashMessage: false,
  resetForm: true,
  delayMs: 100,
  timeoutMs: 4000,
  validators: zodClient(writingSchema),
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
      <h1 class="h1">Smart Writing Demo</h1>
    </header>

    <Support />
    <!-- Form -->
    <form method="POST" use:enhance class="card shadow-lg">
      <header class="card-header">
        <!-- Form Level Errors / Messages -->
        <Alerts errors={$errors._errors} message={$message} />
      </header>
      <section class="p-6 space-y-4">
        <div>
          <Form.Field {form} name="content">
            <Form.Control let:attrs>
              <Form.Label class="label">Writing Tools</Form.Label>
              <Smart.Textarea
                class="textarea data-[fs-error]:input-error"
                {...attrs}
                bind:value={$formData.content}
                {...$constraints.content}
                stream={true}
                placeholder="Write an email to my bank asking them to raise my credit limit from $1,000 to $10,000."
                context="I'm a long-standing customer."
              />
            </Form.Control>
            <Form.Description class="sr-only"
              >Put writing1 description here</Form.Description
            >
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
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
