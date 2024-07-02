<script lang="ts">
import { handleMessage } from '$lib/components/layout/toast-manager';
import { pwSchema } from '$lib/schema/user';
import { getLoadingState } from '$lib/stores/loading';
import { getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell } from '@spectacular/skeleton';
import { Alerts } from '@spectacular/skeleton/components/form';
import { Logger } from '@spectacular/utils';
import * as Form from 'formsnap';
import * as m from '$i18n/messages';
import { Loader, MoreHorizontal } from 'lucide-svelte';
import SuperDebug, { defaults, superForm } from 'sveltekit-superforms';
import { zod, zodClient } from 'sveltekit-superforms/adapters';
  import { page } from '$app/stores';

const log = new Logger('auth:signin:password:browser');
// Variables
const loadingState = getLoadingState();
const toastStore = getToastStore();

const form = superForm(defaults(zod(pwSchema)), {
  dataType: 'json',
  taintedMessage: null,
  clearOnSubmit: 'errors-and-message',
  syncFlashMessage: false,
  delayMs: 100,
  timeoutMs: 4000,
  validators: zodClient(pwSchema),
  onUpdated({ form }) {
    if (form.message) {
      handleMessage(form.message, toastStore);
    }
  },
  onError({ result }) {
    // TODO:
    // setError(form, '', result.error.message);
    log.error('signin error:', { result });
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
  capture,
  restore,
  enhance,
} = form;

export const snapshot = { capture, restore };

// Functions

// Reactivity
$: loadingState.setFormLoading($delayed);
$: valid = $allErrors.length === 0;
$formData.redirectTo = $page.url.searchParams.get('redirectTo') ?? $formData.redirectTo;
</script>

<!-- Form Level Errors / Messages -->
<Alerts errors={$errors._errors} message={$message} />
 <!-- Signin with email/password Form -->
<form method="POST" action="/signin?/password" use:enhance>
  <div class="mt-6">
    <Form.Field {form} name="email">
      <Form.Control let:attrs>
        <Form.Label class="label sr-only">{m.auth_forms_email_label()}</Form.Label>
        <input
          type="email"
          autocomplete="email"
          class="input mt-1 data-[fs-error]:input-error"
          placeholder={m.auth_forms_email_placeholder()}
          {...attrs}
          bind:value={$formData.email}
        />
      </Form.Control>
      <Form.FieldErrors class="data-[fs-error]:text-error-500" />
    </Form.Field>
  </div>
  <div class="mt-6">
    <Form.Field {form} name="password">
      <Form.Control let:attrs>
        <Form.Label class="label sr-only">{m.auth_forms_password_label()}</Form.Label>
        <input
          type="password"
          class="input mt-1 data-[fs-error]:input-error"
          placeholder={m.auth_forms_password_placeholder()}
          {...attrs}
          bind:value={$formData.password}
        />
      </Form.Control>
      <Form.FieldErrors class="data-[fs-error]:text-error-500" />
    </Form.Field>
  </div>
  <div class="mt-6">
    <button
      type="submit"
      class="variant-filled-primary btn w-full"
      disabled={!$tainted || !valid || $submitting}
    >
      {#if $timeout}
        <MoreHorizontal class="animate-ping" />
      {:else if $delayed}
        <Loader class="animate-spin" />
      {:else}
        {m.auth_labels_signin()}
      {/if}
    </button>
  </div>
</form>

<div class="mt-5 flex flex-row items-center justify-center">
  <a href="/reset" class="anchor font-semibold">{m.auth_labels_forgot_password()}</a>
</div>

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
