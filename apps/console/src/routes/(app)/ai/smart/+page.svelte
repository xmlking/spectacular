<script lang="ts">
import { handleMessage } from '$lib/components/layout/toast-manager';
import { MagicSpellTextarea, SmartDatePicker } from '$lib/components/smart';
import { getLoadingState } from '$lib/stores/loading';
import { getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell } from '@spectacular/skeleton/components';
import { Alerts } from '@spectacular/skeleton/components/form';
import { Logger } from '@spectacular/utils';
import * as Form from 'formsnap';
import SuperDebug, { superForm } from 'sveltekit-superforms';

const log = new Logger('ai:ms:browser');
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
  posted,
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
      <h1 class="h1">Smart Components</h1>
    </header>

    <!-- Form Level Errors / Messages -->
    <Alerts errors={$errors._errors} message={$message} />
    <!-- Form -->
    <form method="POST" use:enhance>
      <div class="flex flex-col space-y-4">
        <Form.Field {form} name="commentOne">
          <Form.Control let:attrs>
            <Form.Label class="label">Comment One</Form.Label>
            <MagicSpellTextarea
              class="textarea data-[fs-error]:input-error"
              {...attrs}
              bind:value={$formData.commentOne}
              {...$constraints.commentOne}
              placeholder="It was a dark and stormy night..."
            />
          </Form.Control>
          <Form.FieldErrors class="data-[fs-error]:text-error-500" />
        </Form.Field>
        <Form.Field {form} name="commentTwo">
          <Form.Control let:attrs>
            <Form.Label class="label">Comment Two</Form.Label>
            <MagicSpellTextarea
              class="textarea data-[fs-error]:input-error"
              {...attrs}
              bind:value={$formData.commentTwo}
              {...$constraints.commentTwo}
              placeholder="It was a dark and stormy night..."
            />
          </Form.Control>
          <Form.FieldErrors class="data-[fs-error]:text-error-500" />
        </Form.Field>
        <Form.Field {form} name="commentThree">
          <Form.Control let:attrs>
            <Form.Label class="label">Comment Three</Form.Label>
            <MagicSpellTextarea
              class="textarea data-[fs-error]:input-error"
              {...attrs}
              bind:value={$formData.commentThree}
              {...$constraints.commentThree}
              placeholder="It was a dark and stormy night..."
            />
          </Form.Control>
          <Form.FieldErrors class="data-[fs-error]:text-error-500" />
        </Form.Field>
        <Form.Field {form} name="startData">
          <Form.Control let:attrs>
            <Form.Label class="label">Start Data</Form.Label>
            <SmartDatePicker
              class="textarea data-[fs-error]:input-error"
              {...attrs}
              bind:value={$formData.startData}
              {...$constraints.startData}
            />
          </Form.Control>
          <Form.FieldErrors class="data-[fs-error]:text-error-500" />
        </Form.Field>
        <button type="submit" class="variant-filled-primary btn w-full">submit</button>
      </div>
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
          posted: $posted,
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


