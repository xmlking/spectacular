<script lang="ts">
import { changePasswordSchema } from '$lib/schema/user';
import { getLoadingState } from '$lib/stores/loading';
import { DebugShell } from '@spectacular/skeleton';
import { Alerts } from '@spectacular/skeleton/components/form';
import { sleep } from '@spectacular/utils';
import * as Form from 'formsnap';
import SuperDebug, { defaults, superForm } from 'sveltekit-superforms';
import { zod, zodClient } from 'sveltekit-superforms/adapters';

// Variables
const loadingState = getLoadingState();
const form = superForm(defaults(zod(changePasswordSchema)), {
  SPA: true,
  dataType: 'json',
  taintedMessage: null,
  clearOnSubmit: 'errors-and-message',
  delayMs: 100,
  timeoutMs: 4000,
  resetForm: true,
  invalidateAll: false, // this is key for avoid calling the load function on server side
  validators: zodClient(changePasswordSchema),
  async onUpdate({ form }) {
    if (form.valid) {
      await sleep(8000);
      // TODO: Call an external API with form.data, await the result and update form
    }
  },
});

const {
  form: formData,
  errors,
  message,
  submitting,
  constraints,
  delayed,
  timeout,
  tainted,
  posted,
  allErrors,
  enhance,
} = form;

// Reactivity
$: valid = $allErrors.length === 0;
$: loadingState.setFormLoading($delayed);
</script>

<!-- Form Level Errors / Messages -->
<Alerts errors={$errors._errors} message={$message} />
<!-- Form -->
<form method="POST" use:enhance>
  <div class="card">
    <header class="card-header">Change Password</header>
    <section class="p-4 space-y-2">
      <Form.Field {form} name="password">
        <Form.Control let:attrs>
          <!-- <Form.Label class="label data-[fs-error]:text-error-500">Password</Form.Label> -->
          <Form.Label class="label">Password</Form.Label>
          <input
            type="password"
            class="input data-[fs-error]:input-error"
            {...attrs}
            bind:value={$formData.password}
          />
        </Form.Control>
        <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">
          Enter the new password.
        </Form.Description>
        <Form.FieldErrors class="data-[fs-error]:text-error-500" />
      </Form.Field>
      <Form.Field {form} name="confirmPassword">
        <Form.Control let:attrs>
          <Form.Label>Confirm Password</Form.Label>
          <input
            type="password"
            class="input data-[fs-error]:input-error"
            {...attrs}
            bind:value={$formData.confirmPassword}
          />
        </Form.Control>
        <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500"
          >Re-enter the new password</Form.Description
        >
        <Form.FieldErrors class="data-[fs-error]:text-error-500" />
      </Form.Field>
    </section>
    <footer class="card-footer flex justify-end">
      <button
        type="submit"
        class="btn variant-filled-secondary"
        disabled={!$tainted || !valid || $submitting}
      >
        Submit
      </button>
    </footer>
  </div>
</form>
<!-- Debug -->
<DebugShell>
  <SuperDebug
    data={{
      message: $message,
      submitting: $submitting,
      delayed: $delayed,
      timeout: $timeout,
      posted: $posted,
      formData: $formData,
      errors: $errors,
      constraints: $constraints,
    }}
    theme="vscode"
    --sd-code-date="lightgreen"
  />
</DebugShell>