<script lang="ts">
import { Logger } from '@repo/utils';
import { getToastStore } from '@skeletonlabs/skeleton';
import * as Form from 'formsnap';
import { Loader, MoreHorizontal } from 'lucide-svelte';
import SuperDebug, { defaults, type ErrorStatus, setError, setMessage, superForm } from 'sveltekit-superforms';
import { zod4, zod4Client } from 'sveltekit-superforms/adapters';
import * as m from '$i18n/messages';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { changePasswordSchema } from '$lib/schema/user';
import { getLoadingState } from '$lib/stores/loading';
import { getNhostClient } from '$lib/stores/nhost';
import { DebugShell } from '$lib/ui/components';
import { Alerts } from '$lib/ui/components/form';

// Variables
const log = new Logger('user:profile:change:password:browser');
const toastStore = getToastStore();
const loadingState = getLoadingState();
const nhost = getNhostClient();
const form = superForm(defaults(zod4(changePasswordSchema)), {
  SPA: true,
  dataType: 'json',
  taintedMessage: null,
  clearOnSubmit: 'errors-and-message',
  delayMs: 100,
  timeoutMs: 4000,
  resetForm: true,
  invalidateAll: false,
  validators: zod4Client(changePasswordSchema),
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
    // Second, change password via nhost auth SDK
    const newPassword = form.data.password;
    const { error: cpError } = await nhost.auth.changePassword({ newPassword });
    if (cpError) {
      log.error('Error occurred while changing the password:', { error: cpError });
      setError(form, '', cpError.message, {
        status: cpError.status as ErrorStatus,
      });
      return;
    }
    // Finally notify user
    const message = {
      message: 'Password changed. Signout and signin to verify',
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
  allErrors,
  message,
  constraints,
  submitting,
  delayed,
  tainted,
  timeout,
  isTainted,
  enhance,
} = form;

// Reactivity
$: valid = $allErrors.length === 0;
$: loadingState.setFormLoading($delayed);
</script>

<!-- Form Level Errors / Messages -->
<Alerts errors={$errors._errors} message={$message} />
<!-- Change Password Form -->
<form method="POST" use:enhance>
  <div class="card">
    <header class="card-header">
      <div class="text-xl">Change Password</div>
      <!-- <div>Update your signin password</div> -->
    </header>
    <section class="p-4 space-y-2">
      <Form.Field {form} name="password">
        <Form.Control let:attrs>
          <!-- <Form.Label class="label data-[fs-error]:text-error-500">Password</Form.Label> -->
          <Form.Label class="label">{m.profile_forms_change_password_label()}</Form.Label>
          <input
            type="password"
            autocomplete="new-password"
            class="input data-[fs-error]:input-error"
            {...attrs}
            bind:value={$formData.password}
            placeholder="{m.profile_forms_change_password_placeholder()}"
          />
        </Form.Control>
        <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">
          {m.profile_forms_change_password_description()}
        </Form.Description>
        <Form.FieldErrors class="data-[fs-error]:text-error-500" />
      </Form.Field>
      <Form.Field {form} name="confirmPassword">
        <Form.Control let:attrs>
          <Form.Label>{m.profile_forms_change_password_confirm_label()}</Form.Label>
          <input
            type="password"
            autocomplete="new-password"
            class="input data-[fs-error]:input-error"
            {...attrs}
            bind:value={$formData.confirmPassword}
            placeholder="{m.profile_forms_change_password_confirm_placeholder()}"
          />
        </Form.Control>
        <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500"
          >{m.profile_forms_change_password_confirm_description()}</Form.Description
        >
        <Form.FieldErrors class="data-[fs-error]:text-error-500" />
      </Form.Field>
    </section>
    <footer class="card-footer flex justify-end">
      <button
        type="submit"
        class="btn variant-filled"
        disabled={!$tainted || !valid || $submitting}
      >
        {#if $timeout}
          <MoreHorizontal class="m-2 h-4 w-4 animate-ping" />
        {:else if $delayed}
          <Loader class="m-2 h-4 w-4 animate-spin" />
        {:else}
          {m.buttons_submit()}
        {/if}
      </button>
    </footer>
  </div>
</form>

<!-- Debug -->
<DebugShell label="change-password-form-data">
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
