<script lang="ts">
import { goto, invalidateAll } from '$app/navigation';
import { page } from '$app/stores';
import * as m from '$i18n/messages';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { pwlSchema } from '$lib/schema/user';
import { getLoadingState } from '$lib/stores/loading';
import { getNhostClient } from '$lib/stores/nhost';
import { getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell } from '@spectacular/skeleton';
import { Alerts } from '@spectacular/skeleton/components/form';
import { Logger } from '@spectacular/utils';
import * as Form from 'formsnap';
import { Fingerprint, Loader, Mail, MoreHorizontal } from 'lucide-svelte';
import SuperDebug, { defaults, superForm } from 'sveltekit-superforms';
import { zod, zodClient } from 'sveltekit-superforms/adapters';

const log = new Logger('auth:signin:passwordless:browser');
// Variables
const loadingState = getLoadingState();
const toastStore = getToastStore();
const nhost = getNhostClient();

const form = superForm(defaults(zod(pwlSchema)), {
  dataType: 'json',
  taintedMessage: null,
  clearOnSubmit: 'errors-and-message',
  syncFlashMessage: false,
  delayMs: 100,
  timeoutMs: 4000,
  validators: zodClient(pwlSchema),
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
async function waSignin() {
  if ($errors.email) {
    handleMessage({ type: 'error', message: 'Invalid email' } as const, toastStore);
  } else {
    const { session, error: signInError } = await nhost.auth.signIn({ email: $formData.email, securityKey: true });
    if (session) {
      await invalidateAll();
      await goto('/profile');
      handleMessage({ type: 'success', message: 'Signin sucessfull 😎' } as const, toastStore);
    } else {
      log.error(signInError);
      handleMessage({ type: 'error', message: `Signin failed: ${signInError?.message}` } as const, toastStore);
    }
  }
}

// Reactivity
$: loadingState.setFormLoading($delayed);
$: valid = $allErrors.length === 0;
$formData.redirectTo = $page.url.searchParams.get('redirectTo') ?? $formData.redirectTo;
</script>

<!-- Form Level Errors / Messages -->
<Alerts errors={$errors._errors} message={$message} />
<!-- Signin with email : Magic Link or Security Key Form -->
<form method="POST" use:enhance>
  <div class="mt-6">
    <Form.Field {form} name="email">
      <Form.Control let:attrs>
        <Form.Label class="label sr-only">{m.auth_forms_email_label()}</Form.Label>
        <input
          type="email"
          autocomplete="email"
          class="input data-[fs-error]:input-error"
          placeholder={m.auth_forms_email_placeholder()}
          {...attrs}
          bind:value={$formData.email}
        />
      </Form.Control>
      <Form.FieldErrors class="data-[fs-error]:text-error-500" />
    </Form.Field>
  </div>
  <div class="mt-6 flex justify-between">
    <button
      type="submit"
      formaction="/signin?/passwordless"
      class="variant-filled-primary btn"
      disabled={!$tainted || !valid || $submitting}
    >
      {#if $timeout}
        <MoreHorizontal class="animate-ping" />
      {:else if $delayed}
        <Loader class="animate-spin" />
      {:else}
        {m.auth_labels_signin_with_email()} <Mail class="pl-2" />
      {/if}
    </button>
    <button
      type="button"
      formaction="/signin?/webauthn"
      class="variant-filled-primary btn"
      disabled={!$tainted || !valid || $submitting}
      on:click|preventDefault={waSignin} >
        {m.auth_labels_signin_with_webauthn()} <Fingerprint class="pl-2"/>
    </button>
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
