<script lang="ts">
import { page } from '$app/stores';
import { env } from '$env/dynamic/public';
import * as m from '$i18n/messages';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { signUpSchema } from '$lib/schema/user';
import { getLoadingState } from '$lib/stores/loading';
import { getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell } from '@spectacular/skeleton/components';
import { Alerts } from '@spectacular/skeleton/components/form';
import { Logger } from '@spectacular/utils';
import * as Form from 'formsnap';
import { Loader, MoreHorizontal } from 'lucide-svelte';
import SuperDebug, { defaults, superForm } from 'sveltekit-superforms';
import { zod, zodClient } from 'sveltekit-superforms/adapters';
import type { PageData } from './$houdini';

const log = new Logger('auth:signup:browser');

export let data: PageData;

// Variables
const loadingState = getLoadingState();
const toastStore = getToastStore();

const form = superForm(defaults(zod(signUpSchema)), {
  dataType: 'json',
  taintedMessage: null,
  clearOnSubmit: 'errors-and-message',
  syncFlashMessage: false,
  delayMs: 100,
  timeoutMs: 4000,
  validators: zodClient(signUpSchema),
  onUpdated({ form }) {
    if (form.message) {
      handleMessage(form.message, toastStore);
    }
  },
  onError({ result }) {
    // TODO:
    // setError(form, '', result.error.message);
    log.error('signup error:', { result });
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
$: ({ ListOrganizations } = data);
$: organizations = $ListOrganizations.data?.organizations.map((x) => x.organization) ?? [
  env.PUBLIC_DEFAULT_ORGANIZATION,
];

// Used in apps/console/src/lib/components/layout/page-load-spinner.svelte
$: loadingState.setFormLoading($delayed);
$: valid = $allErrors.length === 0;
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
    <Form.Field {form} name="organization">
      <Form.Control let:attrs>
        <Form.Label class="label sr-only"
          >{m.auth_forms_first_organization_label()}</Form.Label
        >
        <select
          class="select data-[fs-error]:input-error"
          placeholder={m.auth_forms_first_organization_placeholder()}
          {...attrs}
          bind:value={$formData.organization}
        >
          <option value="">Select Organization</option>
          {#each organizations as org}
            <option value={org}>{org}</option>
          {/each}
        </select>
      </Form.Control>
      <Form.FieldErrors class="data-[fs-error]:text-error-500" />
    </Form.Field>
  </div>
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
      timeout: $timeout,
      posted: $posted,
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
