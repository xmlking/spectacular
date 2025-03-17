<script lang="ts">
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import * as m from '$i18n/messages';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { i18n } from '$lib/i18n';
import { updateUserDetailsKeys as keys, signUpSchema } from '$lib/schema/user';
import { getLoadingState } from '$lib/stores/loading';
import { getNhostClient } from '$lib/stores/nhost';
import { turnstilePassed, turnstileResponse } from '$lib/stores/stores';
import { getAuthenticationResult, signUpEmailPasswordPromise } from '@nhost/nhost-js';
import { getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell } from '$lib/ui/components';
import { Alerts } from '$lib/ui/components/form';
import { Logger } from '@spectacular/utils';
import * as Form from 'formsnap';
import { Loader, MoreHorizontal } from 'lucide-svelte';
import { onMount } from 'svelte';
import SuperDebug, { defaults, setError, setMessage, superForm } from 'sveltekit-superforms';
import { zod, zodClient } from 'sveltekit-superforms/adapters';

const log = new Logger('auth:signup:browser');

// Variables
const loadingState = getLoadingState();
const toastStore = getToastStore();
const nhost = getNhostClient();

onMount(async () => {
  const isAuthenticated = nhost.auth.isAuthenticated();
  const redirectTo = $formData.redirectTo;
  log.debug({ isAuthenticated, redirectTo });
  if (isAuthenticated) {
    await goto(i18n.resolveRoute(redirectTo));
  }
});

const form = superForm(defaults(zod(signUpSchema)), {
  SPA: true,
  dataType: 'json',
  taintedMessage: null,
  syncFlashMessage: false,
  resetForm: true,
  delayMs: 100,
  timeoutMs: 4000,
  validators: zodClient(signUpSchema),
  clearOnSubmit: 'errors-and-message',
  async onUpdate({ form, cancel }) {
    if (!form.valid) return;

    const { firstName, lastName, email, password, locale, redirectTo } = form.data;

    // FIXME: remove this block after nhost.auth.signUp support headers
    const { session, error } = getAuthenticationResult(
      await signUpEmailPasswordPromise(
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        nhost.auth.client.interpreter!,
        email,
        password as string,
        {
          displayName: `${firstName} ${lastName}`,
          locale,
        },
        {
          headers: {
            'x-cf-turnstile-response': $turnstileResponse,
          },
        },
      ),
    );

    // log.debug('TODO: use turnstileResponse:', $turnstileResponse);
    // const { session, error } = await nhost.auth.signUp({
    //   email,
    //   password,
    //   options: {
    //     displayName: `${firstName} ${lastName}`,
    //     locale,
    //   },
    // });

    if (error) {
      log.error(error);
      // FIXME: workaround for `missing x-cf-turnstile-response`
      if (typeof error.error === 'string') {
        error.message = error.error;
      }
      setError(form, '', error.message);
      setMessage(form, { type: 'error', message: 'Account creation failed', hideDismiss: false, timeout: 10000 });
      return;
    }

    if (session) {
      loadingState.setFormLoading(false); // workaround
      const message: App.Superforms.Message = {
        message: 'Account Created',
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

<svelte:head>
  <title>Datablocks | Signup</title>
  <meta name="description" content="Create Account" />
</svelte:head>

<!-- Form Level Errors / Messages -->
<Alerts errors={$errors._errors} message={$message} />
<!-- Signup Form -->
<form method="POST" use:enhance>
  <div class="mt-6">
    <Form.Field {form} name="firstName">
      <Form.Control let:attrs>
        <Form.Label class="label sr-only"
          >{m.auth_forms_first_name_label()}</Form.Label
        >
        <input
          type="text"
          autocomplete="given-name"
          class="input data-[fs-error]:input-error"
          placeholder={m.auth_forms_first_name_placeholder()}
          {...attrs}
          bind:value={$formData.firstName}
        />
      </Form.Control>
      <Form.FieldErrors class="data-[fs-error]:text-error-500" />
    </Form.Field>
  </div>
  <div class="mt-6">
    <Form.Field {form} name="lastName">
      <Form.Control let:attrs>
        <Form.Label class="label sr-only"
          >{m.auth_forms_last_name_label()}</Form.Label
        >
        <input
          type="text"
          autocomplete="family-name"
          class="input data-[fs-error]:input-error"
          placeholder={m.auth_forms_last_name_placeholder()}
          {...attrs}
          bind:value={$formData.lastName}
        />
      </Form.Control>
      <Form.FieldErrors class="data-[fs-error]:text-error-500" />
    </Form.Field>
  </div>
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
    <Form.Field {form} name="password">
      <Form.Control let:attrs>
        <Form.Label class="label sr-only"
          >{m.auth_forms_password_label()}</Form.Label
        >
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
    <Form.Field {form} name="confirmPassword">
      <Form.Control let:attrs>
        <Form.Label class="label sr-only"
          >{m.auth_forms_confirm_password_label()}</Form.Label
        >
        <input
          type="password"
          class="input data-[fs-error]:input-error"
          placeholder={m.auth_forms_confirm_password_placeholder()}
          {...attrs}
          bind:value={$formData.confirmPassword}
        />
      </Form.Control>
      <Form.FieldErrors class="data-[fs-error]:text-error-500" />
    </Form.Field>
  </div>
  <div class="mt-6">
    <Form.Field {form} name={keys.locale}>
      <Form.Control let:attrs>
        <Form.Label  class="label sr-only">Locale</Form.Label>
        <select
          class="select data-[fs-error]:input-error"
          {...attrs}
          bind:value={$formData.locale}>
          <option value="en">English (US)</option>
          <option value="es">Español (España)</option>
          <!-- <option value="fr">Français (France)</option> -->
          <option value="de">Deutsch (Deutschland)</option>
        </select>
      </Form.Control>
      <!-- <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">User preferred Locale</Form.Description> -->
      <Form.FieldErrors class="data-[fs-error]:text-error-500" />
    </Form.Field>
  </div>
  <div class="mt-6">
    <Form.Field {form} name="terms">
      <Form.Control let:attrs>
        <Form.Label class="label sr-only"></Form.Label>
        <input
          type="checkbox"
          class="checkbox data-[fs-error]:input-error"
          {...attrs}
          bind:checked={$formData.terms}
        />
        <span class="ml-2">
          I accept the
          <a href="/terms" class="text-primaryHover underline">terms</a>
          and
          <a href="/privacy" class="text-primaryHover underline"
            >privacy policy</a
          >
        </span>
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
        {m.auth_labels_signup()}
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
