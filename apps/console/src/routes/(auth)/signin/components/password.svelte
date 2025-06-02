<script lang="ts">
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import * as m from '$i18n/messages';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { i18n } from '$lib/i18n';
import { pwSchema } from '$lib/schema/user';
import { getLoadingState } from '$lib/stores/loading';
import { getNhostClient } from '$lib/stores/nhost';
import { turnstilePassed } from '$lib/stores/stores';
import { DebugShell } from '$lib/ui/components';
import { Alerts } from '$lib/ui/components/form';
import { Logger } from '@repo/utils';
import { getToastStore } from '@skeletonlabs/skeleton';
import * as Form from 'formsnap';
import { Loader, MoreHorizontal } from 'lucide-svelte';
import SuperDebug, { defaults, setError, setMessage, superForm } from 'sveltekit-superforms';
import { zod, zodClient } from 'sveltekit-superforms/adapters';

const log = new Logger('auth:signin:password:browser');

// Variables
const loadingState = getLoadingState();
const toastStore = getToastStore();
const nhost = getNhostClient();

const form = superForm(defaults(zod(pwSchema)), {
  SPA: true,
  dataType: 'json',
  taintedMessage: null,
  syncFlashMessage: false,
  resetForm: true,
  delayMs: 100,
  timeoutMs: 4000,
  validators: zodClient(pwSchema),
  clearOnSubmit: 'errors-and-message',
  async onUpdate({ form, cancel }) {
    if (!form.valid) return;

    const { email, password, redirectTo } = form.data;
    const { session, error } = await nhost.auth.signIn({ email, password });
    if (error) {
      log.error(error);
      setError(form, '', error.message);
      setMessage(form, { type: 'error', message: 'Signin failed', hideDismiss: false, timeout: 10000 });
      return;
    }

    if (session) {
      loadingState.setFormLoading(false); // workaround
      const message: App.Superforms.Message = {
        message: 'Signin sucessfull 😎',
        hideDismiss: true,
        timeout: 10000,
        type: 'success',
      } as const;
      setMessage(form, message);
      handleMessage(message, toastStore);
      // await goto(i18n.resolveRoute(redirectTo), {
      //   invalidateAll: false,
      // });
      await goto(i18n.resolveRoute(redirectTo), {
        invalidateAll: true, // workaround for profile page
      });
    }
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

// Reactivity
$: valid = $allErrors.length === 0 && $turnstilePassed;
$: loadingState.setFormLoading($delayed);
$formData.redirectTo = $page.url.searchParams.get('redirectTo') ?? $formData.redirectTo;
</script>

<!-- Form Level Errors / Messages -->
<Alerts errors={$errors._errors} message={$message} />
 <!-- Signin with email/password Form -->
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
  <div class="mt-6">
    <Form.Field {form} name="password">
      <Form.Control let:attrs>
        <Form.Label class="label sr-only">{m.auth_forms_password_label()}</Form.Label>
        <input
          type="password"
          class="input data-[fs-error]:input-error"
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
      formData: $formData,
      errors: $errors,
      constraints: $constraints,
    }}
    theme="vscode"
    --sd-code-date="lightgreen"
  />
</DebugShell>
