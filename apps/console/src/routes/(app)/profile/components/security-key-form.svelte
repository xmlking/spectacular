<script lang="ts">
import { page } from '$app/stores';
import * as m from '$i18n/messages';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { webAuthnSchema } from '$lib/schema/user';
import { getLoadingState } from '$lib/stores/loading';
import { elevate, nhost } from '$lib/stores/user';
import { getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell } from '@spectacular/skeleton';
import { Alerts } from '@spectacular/skeleton/components/form';
import * as Form from 'formsnap';
import { Loader, LoaderCircle, MoreHorizontal } from 'lucide-svelte';
import SuperDebug, { superForm, setMessage, setError, defaults } from 'sveltekit-superforms';
import type { ErrorStatus } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

// Variables
const toastStore = getToastStore();
const loadingState = getLoadingState();

const form = superForm(defaults(zod(webAuthnSchema)), {
  SPA: true,
  dataType: 'json',
  taintedMessage: null,
  clearOnSubmit: 'errors-and-message',
  delayMs: 100,
  timeoutMs: 4000,
  resetForm: true,
  validators: zod(webAuthnSchema),
  async onUpdate({ form, cancel }) {
    if (!form.valid) return;
    // First, check if elevate is required
    const error = await elevate();
    if (error) {
      setError(form, '', error.message, {
        status: error.status as ErrorStatus,
      });
      return;
    }
    // Second, add the security key to database
    const { key, error: addKeyError } = await nhost.auth.addSecurityKey(form.data.nickname);
    if (addKeyError) {
      setError(form, '', addKeyError.message, {
        status: addKeyError.status as ErrorStatus,
      });
      return;
    }
    // Finally notify user: successfully added a new security key
    const message = {
      message: `Added security key: ${key?.nickname}`,
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
  posted,
  enhance,
} = form;

// Functions

// Reactivity
$: valid = $allErrors.length === 0;
$: loadingState.setFormLoading($delayed);
</script>

<!-- Form Level Errors / Messages -->
<Alerts errors={$errors._errors} message={$message} />
<!-- Form -->
<div class="card">
  <header class="card-header">Add Security keys</header>
  <section class="p-4">
    <form method="POST" use:enhance>
      <Form.Field {form} name="nickname">
        <Form.Control let:attrs>
          <!-- <Form.Label class="label data-[fs-error]:text-error-500" >{m.profile_skey_forms_nickname_label()}</Form.Label> -->
          <div class="input-group input-group-divider grid-cols-[1fr_auto]">
            <input
              type="text"
              class="input data-[fs-error]:input-error"
              {...attrs}
              bind:value={$formData.nickname}
              placeholder={m.profile_skey_forms_nickname_placeholder()}
            />
            <button
              class="variant-filled-secondary"
              disabled={!$tainted || !valid || $submitting}
            >
              {#if $timeout}
                <MoreHorizontal class="m-2 h-4 w-4 animate-ping" />
              {:else if $delayed}
                <Loader class="m-2 h-4 w-4 animate-spin" />
              {:else}
                {m.buttons_add()}
              {/if}
            </button>
          </div>
        </Form.Control>
        <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">
          {m.profile_skey_forms_nickname_description()}
        </Form.Description>
        <Form.FieldErrors class="data-[fs-error]:text-error-500" />
      </Form.Field>
    </form>
  </section>
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
  <SuperDebug label="$page data" data={page} collapsible />
</DebugShell>