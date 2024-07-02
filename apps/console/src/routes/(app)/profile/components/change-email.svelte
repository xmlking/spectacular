<script lang="ts">
import { handleMessage } from '$lib/components/layout/toast-manager';
import { type ChangeEmail, changeEmailSchema } from '$lib/schema/user';
import { getLoadingState } from '$lib/stores/loading';
import { nhost } from '$lib/stores/user';
import { getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell } from '@spectacular/skeleton';
import { Button } from '@spectacular/skeleton/components/button';
import { Alerts } from '@spectacular/skeleton/components/form';
import { Logger, sleep } from '@spectacular/utils';
import * as Form from 'formsnap';
import SuperDebug, { defaults, setError, setMessage, superForm, type ErrorStatus } from 'sveltekit-superforms';
import { zod, zodClient } from 'sveltekit-superforms/adapters';

export let initialData: ChangeEmail;
// Variables
const log = new Logger('profile:password:browser');
const toastStore = getToastStore();
const loadingState = getLoadingState();

const form = superForm(defaults(initialData, zod(changeEmailSchema)), {
  SPA: true,
  dataType: 'json',
  taintedMessage: null,
  clearOnSubmit: 'errors-and-message',
  delayMs: 100,
  timeoutMs: 4000,
  resetForm: true,
  invalidateAll: false, // this is key for avoid calling the load function on server side
  validators: zodClient(changeEmailSchema),
  async onUpdate({ form }) {
    if (form.valid) {
      await sleep(4500);
      const newEmail = form.data.email;
      const { error } = await nhost.auth.changeEmail({ newEmail });
      if (error) {
        log.error('Error occurred while changing the email:', error.error);
        setError(form, '', error.error, {
          status: error.status as ErrorStatus,
        });
        return;
      }
      const message = {
        message: `Email changed to: ${newEmail}`,
        hideDismiss: true,
        timeout: 10000,
        type: 'success',
      } as const;
      setMessage(form, message);
      handleMessage(message, toastStore);
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
    <header class="card-header">Change Email</header>
    <section class="p-4 space-y-2">
      <Form.Field {form} name="email">
        <Form.Control let:attrs>
          <Form.Label class="label">Email</Form.Label>
          <input
            type="email"
            class="input data-[fs-error]:input-error"
            {...attrs}
            bind:value={$formData.email}
          />
        </Form.Control>
        <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">
          This is your primiary email used for security communicaations.
        </Form.Description>
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
