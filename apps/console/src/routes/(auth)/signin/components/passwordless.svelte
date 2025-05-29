<script lang="ts">
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import * as m from '$i18n/messages';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { i18n } from '$lib/i18n';
import { mlSchema } from '$lib/schema/user';
import { getLoadingState } from '$lib/stores/loading';
import { getNhostClient } from '$lib/stores/nhost';
import { turnstilePassed } from '$lib/stores/stores';
import { getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell } from '$lib/ui/components';
import { Alerts } from '$lib/ui/components/form';
import { Logger } from '@repo/utils';
import * as Form from 'formsnap';
import { Fingerprint, Loader, Mail, MoreHorizontal } from 'lucide-svelte';
import SuperDebug, { defaults, setError, setMessage, superForm } from 'sveltekit-superforms';
import { zod, zodClient } from 'sveltekit-superforms/adapters';

const log = new Logger('auth:signin:passwordless:browser');

// Variables
const loadingState = getLoadingState();
const toastStore = getToastStore();
const nhost = getNhostClient();

const form = superForm(defaults(zod(mlSchema)), {
  SPA: true,
  dataType: 'json',
  taintedMessage: null,
  syncFlashMessage: false,
  resetForm: true,
  delayMs: 100,
  timeoutMs: 4000,
  validators: zodClient(mlSchema),
  clearOnSubmit: 'errors-and-message',
  async onUpdate({ form, cancel }) {
    // THIS IS CALLED ON MAGIC_LINK SUBMIT
    // TODO: fix email client issue: https://nhost.io/blog/protect-magic-links-from-email-clients
    if (!form.valid) return;

    const { email, redirectTo } = form.data;
    const origin = new URL(window.location.href).origin;
    const { error } = await nhost.auth.signIn({
      email,
      options: { redirectTo: `${origin}${redirectTo}` },
    });
    if (error) {
      log.error(error);
      setError(form, '', error.message);
      handleMessage(
        {
          type: 'error',
          message: `Signin failed: ${error?.message}`,
          hideDismiss: false,
          timeout: 10000,
        } as const,
        toastStore,
      );
      return;
    }
    loadingState.setFormLoading(false); // workaround
    const message: App.Superforms.Message = {
      message: 'Click the link in the email to finish the signin process',
      hideDismiss: true,
      timeout: 10000,
      type: 'success',
    } as const;
    setMessage(form, message);
    handleMessage(message, toastStore);
  },
  onError({ result }) {
    log.error('superForm onError:', { result });
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
  allErrors,
  capture,
  restore,
  enhance,
} = form;

export const snapshot = { capture, restore };

// Functions
async function webauthnSignin() {
  const { session, error: signInError } = await nhost.auth.signInSecurityKey();
  if (session) {
    handleMessage(
      {
        type: 'success',
        message: 'Signin successful 😎',
        hideDismiss: true,
        timeout: 10000,
      } as const,
      toastStore,
    );
    await goto(i18n.resolveRoute($formData.redirectTo), {
      invalidateAll: true, // workaround for profile page
    });
  } else {
    log.error(signInError);
    handleMessage(
      {
        type: 'error',
        message: `Signin failed: ${signInError?.message}`,
        hideDismiss: false,
        timeout: 10000,
      } as const,
      toastStore,
    );
  }
}

// Reactivity
$: valid = $allErrors.length === 0 && $turnstilePassed;
$: loadingState.setFormLoading($delayed);
$formData.redirectTo = $page.url.searchParams.get('redirectTo') ?? $formData.redirectTo;
</script>

<!-- Form Level Errors / Messages -->
<Alerts errors={$errors._errors} message={$message} />
<!-- Signin with email : Magic Link or Security Key Form -->
<form method="POST" use:enhance>
  <div class="mt-6">
    <Form.Field {form} name="email">
      <Form.Control let:attrs>
        <Form.Label class="label sr-only"
          >{m.auth_forms_email_label()}</Form.Label
        >
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
      name="magic-link"
      type="submit"
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
      name="webauthn"
      type="button"
      class="variant-filled-primary btn"
      on:click|preventDefault={webauthnSignin}
    >
      {m.auth_labels_signin_with_webauthn()}
      <Fingerprint class="pl-2" />
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
      formData: $formData,
      errors: $errors,
      constraints: $constraints,
    }}
    theme="vscode"
    --sd-code-date="lightgreen"
  />
</DebugShell>
