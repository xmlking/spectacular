<script lang="ts">
import { goto } from '$app/navigation';
import * as m from '$i18n/messages';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { ROUTE_DASHBOARD, ROUTE_PROFILE } from '$lib/constants';
import { i18n } from '$lib/i18n';
import { resetPasswordSchema } from '$lib/schema/user';
import { getLoadingState } from '$lib/stores/loading';
import { getNhostClient } from '$lib/stores/nhost';
import { getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell } from '@spectacular/skeleton/components';
import { Alerts } from '@spectacular/skeleton/components/form';
import { Logger } from '@spectacular/utils';
import * as Form from 'formsnap';
import { Loader, MoreHorizontal } from 'lucide-svelte';
import { onMount } from 'svelte';
import SuperDebug, { defaults, setError, setMessage, superForm } from 'sveltekit-superforms';
import { zod, zodClient } from 'sveltekit-superforms/adapters';

const log = new Logger('auth:reset:browser');

// Variables
const loadingState = getLoadingState();
const toastStore = getToastStore();
const nhost = getNhostClient();

onMount(async () => {
  const isAuthenticated = nhost.auth.isAuthenticated();
  if (isAuthenticated) {
    await goto(i18n.resolveRoute(ROUTE_DASHBOARD));
  }
});

const form = superForm(defaults(zod(resetPasswordSchema)), {
  SPA: true,
  dataType: 'json',
  taintedMessage: null,
  syncFlashMessage: false,
  resetForm: true,
  delayMs: 100,
  timeoutMs: 4000,
  validators: zodClient(resetPasswordSchema),
  clearOnSubmit: 'errors-and-message',
  async onUpdate({ form, cancel }) {
    loadingState.setFormLoading(false); // workaround
    if (!form.valid) return;

    const origin = new URL(window.location.href).origin;
    const { email } = form.data;
    const { error } = await nhost.auth.resetPassword({
      email,
      options: {
        redirectTo: `${origin}${ROUTE_PROFILE}`,
      },
    });

    if (error) {
      log.error(error);
      setError(form, `Failed to send reset password instructions: ${error.message}`, { status: 409 }); // 424 ???
      return;
    }

    const message: App.Superforms.Message = {
      message: 'Send reset password instructions to email provided',
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

// Reactivity
$: valid = $allErrors.length === 0;
$: loadingState.setFormLoading($delayed);
// const conicStops: ConicStop[] = [
//   { color: 'transparent', start: 0, end: 25 },
//   { color: 'rgb(var(--color-primary-900))', start: 75, end: 100 }
// ];
</script>

<svelte:head>
  <title>Datablocks | Reset</title>
  <meta name="description" content="Reset Password" />
</svelte:head>

<h3 class="h3 pt-5">{m.auth_messages_reset_password_healding()}</h3>
<small class="text-gray-500"
  >{m.auth_messages_reset_password_subheading()}</small
>

<!-- Form Level Errors / Messages -->
<Alerts errors={$errors._errors} message={$message} />
<!-- Reset password Form -->
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
        <!-- <ConicGradient stops={conicStops} spin width="w-6" /> -->
      {:else}
        {m.auth_labels_reset_password()}
      {/if}
    </button>
  </div>
</form>
<!-- Debug -->
<DebugShell>
  <SuperDebug
    label="Miscellaneous"
    status={false}
    data={{
      message: $message,
      submitting: $submitting,
      delayed: $delayed,
      timeout: $timeout
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
  <!-- <br />
 	<SuperDebug label="$page data" status={false} data={$page} /> -->
</DebugShell>
