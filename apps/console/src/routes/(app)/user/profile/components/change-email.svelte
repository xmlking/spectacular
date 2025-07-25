<script lang="ts">
import { Logger, sleep } from '@repo/utils';
import { getToastStore } from '@skeletonlabs/skeleton';
import * as Form from 'formsnap';
import { Loader, MoreHorizontal } from 'lucide-svelte';
import SuperDebug, { defaults, type ErrorStatus, setError, setMessage, superForm } from 'sveltekit-superforms';
import { zod4, zod4Client } from 'sveltekit-superforms/adapters';
import * as m from '$i18n/messages';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { type ChangeEmail, changeEmailSchema } from '$lib/schema/user';
import { getLoadingState } from '$lib/stores/loading';
import { getNhostClient } from '$lib/stores/nhost';
import { DebugShell } from '$lib/ui/components';
import { Alerts } from '$lib/ui/components/form';

export let initialData: ChangeEmail;
// Variables
const log = new Logger('user:profile:email:browser');
const toastStore = getToastStore();
const loadingState = getLoadingState();
const nhost = getNhostClient();

const form = superForm(defaults(initialData, zod4(changeEmailSchema)), {
  SPA: true,
  dataType: 'json',
  taintedMessage: null,
  clearOnSubmit: 'errors-and-message',
  delayMs: 100,
  timeoutMs: 4000,
  resetForm: true,
  invalidateAll: false, // this is key to avoid unnecessary data fetch call while using houdini smart cache.
  validators: zod4Client(changeEmailSchema),
  async onUpdate({ form, cancel }) {
    if (!form.valid) return;
    // First, check if elevate is required
    const error = await nhost.elevate();
    if (error) {
      log.error('Error elevating user', { error });
      setError(form, '', error.message, {
        status: error.status as ErrorStatus,
      });
      return;
    }
    // Second, change email via nhost auth API
    const newEmail = form.data.email;
    const { error: changeEmailError } = await nhost.auth.changeEmail({ newEmail });
    if (changeEmailError) {
      log.error('Error occurred while changing the email:', { error: changeEmailError });
      setError(form, '', changeEmailError.error, {
        status: changeEmailError.status as ErrorStatus,
      });
      return;
    }
    // Finally notify user: that an email is send to old email to verify and conform.
    const message = {
      message: `Email change request from: ${initialData.email} to: ${newEmail} is submited. \ncheck your email inbox`,
      hideDismiss: true,
      timeout: 10000,
      type: 'success',
    } as const;
    setMessage(form, message);
    handleMessage(message, toastStore);
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
  isTainted,
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
<div class="card">
  <header class="card-header">
    <div class="text-xl">Change Email</div>
    <!-- <div>To update your password, enter password and conformPassword and submit</div> -->
  </header>
  <section class="p-4">
    <form method="POST" use:enhance>
      <Form.Field {form} name="email">
        <Form.Control let:attrs>
          <!-- <Form.Label class="label">Email</Form.Label> -->
          <div class="input-group input-group-divider grid-cols-[1fr_auto]">
            <input
              type="email"
              class="input data-[fs-error]:input-error"
              {...attrs}
              bind:value={$formData.email}
              placeholder={m.profile_forms_change_email_placeholder()}
            />
            <button
              class="variant-filled"
              disabled={!$tainted || !valid || $submitting}
            >
              {#if $timeout}
                <MoreHorizontal class="m-2 h-4 w-4 animate-ping" />
              {:else if $delayed}
                <Loader class="m-2 h-4 w-4 animate-spin" />
              {:else}
                {m.buttons_update()}
              {/if}
            </button>
          </div>
        </Form.Control>
        <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">
          {m.profile_forms_change_email_description()}
        </Form.Description>
        <Form.FieldErrors class="data-[fs-error]:text-error-500" />
      </Form.Field>
    </form>
  </section>
</div>

<!-- Debug -->
<DebugShell label="change-email-form-data">
  <SuperDebug
    label="Miscellaneous"
    status={false}
    data={{
      message: $message,
      isTainted: isTainted,
      submitting: $submitting,
      delayed: $delayed,
      timeout: $timeout,
    }}
    theme="vscode"
    --sd-code-date="lightgreen"
  />
  <br />
  <SuperDebug label="Form" data={$formData} />
  <br />
  <SuperDebug label="Tainted" status={false} data={$tainted} />
  <br />
  <SuperDebug label="Errors" status={false} data={$errors} />
  <br />
  <SuperDebug label="Constraints" status={false} data={$constraints} />
  <!-- <br />
  <SuperDebug label="$page data" status={false} data={$page} /> -->
</DebugShell>
