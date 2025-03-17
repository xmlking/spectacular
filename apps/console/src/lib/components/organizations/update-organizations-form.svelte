<script lang="ts">
import { goto, invalidate } from '$app/navigation';
import { page } from '$app/stores';
import { type OrganizationFragment, type UpdateOrganization$input, cache, fragment, graphql } from '$houdini';
import * as m from '$i18n/messages';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { i18n } from '$lib/i18n';
import {
  allowedMetadata as allowedKeyValues,
  updateOrganizationKeys as keys,
  updateOrganizationSchema as schema,
} from '$lib/schema/organization';
import { getLoadingState } from '$lib/stores/loading';
import type { PartialGraphQLErrors } from '$lib/types';
import { SlideToggle, getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell, GraphQLErrors } from '$lib/ui/components';
import { Alerts, InputChipWrapper } from '$lib/ui/components/form';
import { InputPairs, type KeyValueRecord } from '$lib/ui/components/form';
import { Logger, cleanClone } from '@spectacular/utils';
import * as Form from 'formsnap';
import type { GraphQLError } from 'graphql';
import { Loader, MoreHorizontal, Search } from 'lucide-svelte';
import Select from 'svelte-select';
import SuperDebug, { defaults, setError, setMessage, superForm, type SuperValidated } from 'sveltekit-superforms';
import { zod, zodClient } from 'sveltekit-superforms/adapters';
import { UpdateOrganization } from './mutations';

const log = new Logger('org:update:component');

export let organization: OrganizationFragment;
$: data = fragment(
  organization,
  graphql(`
      fragment OrganizationFragment on organizations  {
        id
        displayName
        description
        tags
        metadata
        ownerId
        allowedEmailDomains @include(if: true)
        allowedEmails @skip(if: false)
        blockedEmailDomains
        blockedEmails
        autoEnroll
        avatarUrl
      }
    `),
);

// Reactivity
// let initialData: SuperValidated<UpdateOrganization>
$: ({ id, __typename, ...initialData } = $data);

// Variables
const toastStore = getToastStore();
const loadingState = getLoadingState();
let gqlErrors: PartialGraphQLErrors;
let pathname = $page.url.pathname;

const form = superForm(defaults(initialData, zod(schema)), {
  SPA: true,
  dataType: 'json',
  taintedMessage: null,
  clearOnSubmit: 'errors-and-message',
  delayMs: 100,
  timeoutMs: 4000,
  invalidateAll: 'force', // HINT: https://superforms.rocks/concepts/enhance#optimistic-updates
  validators: zodClient(schema),
  async onUpdate({ form, cancel }) {
    if (!form.valid) return;

    const dataCopy = cleanClone(form.data, { empty: 'null' });
    const variables: UpdateOrganization$input = { id, data: dataCopy };

    const { data, errors } = await UpdateOrganization.mutate(variables, { metadata: { logResult: true } });

    if (errors) {
      for (const error of errors) {
        if (error.message.includes('Uniqueness violation')) {
          setError(form, 'displayName', 'Display Name already taken');
        } else {
          gqlErrors = errors;
        }
      }
      log.error('update organization api call error:', errors);
      return;
    }

    const result = data?.update_organizations_by_pk;
    if (!result) {
      setMessage(form, { type: 'error', message: 'Update organization failed: responce empty' }, { status: 404 });
      return;
    }

    // Finally notify user: successfully creattion
    const message: App.Superforms.Message = {
      message: `Organization: ${dataCopy.displayName} updated successfully`,
      type: 'success',
      timeout: 10000,
    } as const;
    setMessage(form, message);
    handleMessage(message, toastStore);
    const org = cache.get('organizations', { id });
    org.markStale();
    // for admins, redirect to organizations page
    if (pathname.startsWith('/admin/organizations/')) {
      await goto(i18n.resolveRoute('/admin/organizations'));
    } else {
      // for org users, stay on the same page
      await invalidate(() => true);
    }
  },
  onError({ result }) {
    log.error('superForm onError:', { result });
  },
});

const {
  form: formData,
  delayed,
  enhance,
  errors,
  constraints,
  message,
  isTainted,
  tainted,
  allErrors,
  reset,
  submitting,
  timeout,
  capture,
  restore,
} = form;
export const snapshot = { capture, restore };

// Functions
function isValidEmail(value: string): boolean {
  return value.includes('@') && value.includes('.');
}
function isValidEmailDomain(value: string): boolean {
  const dotindex = value.lastIndexOf('.');
  const afterdot = value.substring(dotindex + 1);
  return value.includes('.') && afterdot.length >= 2;
}
// Reactivity
$: valid = $allErrors.length === 0;
$: loadingState.setFormLoading($delayed);
$: if (id) {
  // this will reset initialData after data is loaded.
  reset({ newState: { ...initialData } });
}
</script>

<section class="space-y-4">
  <!-- Form Level Errors / Messages -->
  <Alerts errors={$errors._errors} message={$message} />
  <!-- GraphQL Errors  -->
  {#if gqlErrors}
    <GraphQLErrors errors={gqlErrors} />
  {/if}
  <!-- Update Organization Form -->
  <form class="card md:space-y-8" method="POST" use:enhance>
    <header class="card-header">
      <div class="text-xl">Update Organization</div>
      <!-- <div>Update your organization information</div> -->
    </header>
    <section
      class="p-4 grid gap-6 content-center md:grid-cols-3 lg:grid-cols-6"
    >
      <div class="col-span-3">
        <Form.Field {form} name={keys.displayName}>
          <Form.Control let:attrs>
            <Form.Label class="label">Display Name</Form.Label>
            <input
              type="text"
              class="input data-[fs-error]:input-error"
              {...attrs}
              placeholder="Enter Display Name..."
              bind:value={$formData.displayName}
            />
            <Form.Description
              class="sr-only md:not-sr-only text-sm text-gray-500"
              >Enter the org display name</Form.Description
            >
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Control>
        </Form.Field>
      </div>
      <div class="col-span-3">
        <Form.Field {form} name={keys.description}>
          <Form.Control let:attrs>
            <Form.Label class="label">Description</Form.Label>
            <input
              type="text"
              class="input data-[fs-error]:input-error"
              {...attrs}
              placeholder="Enter Description..."
              bind:value={$formData.description}
            />
          </Form.Control>
          <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500"
            >Enter the org description</Form.Description
          >
          <Form.FieldErrors class="data-[fs-error]:text-error-500" />
        </Form.Field>
      </div>
      <div class="md:grid-cols-3 col-span-6">
        <Form.Field {form} name={keys.avatarUrl}>
          <Form.Control let:attrs>
            <Form.Label class="label">Avatar URL</Form.Label>
            <input
              type="url"
              class="input data-[fs-error]:input-error"
              {...attrs}
              placeholder="https://example.com/avatar.jpg"
              bind:value={$formData.avatarUrl}
            />
          </Form.Control>
          <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Org's Avatar URL</Form.Description>
          <Form.FieldErrors class="data-[fs-error]:text-error-500" />
        </Form.Field>
      </div>
      <div class="col-span-3">
        <Form.Field {form} name={keys.tags}>
          <Form.Control let:attrs>
            <Form.Label class="label">Tags</Form.Label>
            <InputChipWrapper
              {...attrs}
              placeholder="Enter tags..."
              class="input data-[fs-error]:input-error"
              bind:value={$formData.tags}
            />
          </Form.Control>
          <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">
            Enter the tags and press <strong>Enter</strong>
          </Form.Description>
          <Form.FieldErrors class="data-[fs-error]:text-error-500" />
        </Form.Field>
      </div>
      <div class="col-span-3">
        <Form.Field {form} name={keys.metadata}>
          <Form.Control let:attrs>
            <Form.Label class="label">Metadata</Form.Label>
            <InputPairs
              {...attrs}
              placeholder="Enter metadata..."
              class="input data-[fs-error]:input-error"
              {allowedKeyValues}
              bind:value={$formData.metadata}
            />
          </Form.Control>
          <Form.Description
            class="sr-only md:not-sr-only text-sm text-gray-500"
          >
            Enter the metadata
          </Form.Description>
          <Form.FieldErrors class="data-[fs-error]:text-error-500" />
        </Form.Field>
      </div>
      <div class="col-span-3">
        <Form.Field {form} name={keys.allowedEmails}>
          <Form.Control let:attrs>
            <Form.Label class="label">Allowed Emails</Form.Label>
            <InputChipWrapper
              {...attrs}
              placeholder="Enter Allowed Emails..."
              class="input data-[fs-error]:input-error"
              bind:value={$formData.allowedEmails}
              validation={isValidEmail}
            />
          </Form.Control>
          <Form.Description
            class="sr-only md:not-sr-only text-sm text-gray-500"
          >
            Type valid email address and press <strong>Enter</strong>
          </Form.Description>
          <Form.FieldErrors class="data-[fs-error]:text-error-500" />
        </Form.Field>
      </div>
      <div class="col-span-3">
        <Form.Field {form} name={keys.allowedEmailDomains}>
          <Form.Control let:attrs>
            <Form.Label class="label">Allowed Email Domains</Form.Label>
            <InputChipWrapper
              class="input data-[fs-error]:input-error"
              {...attrs}
              placeholder="Enter Allowed Email Domains..."
              bind:value={$formData.allowedEmailDomains}
              validation={isValidEmailDomain}
            />
          </Form.Control>
          <Form.Description
            class="sr-only md:not-sr-only text-sm text-gray-500"
          >
            Type valid email domains name and press <strong>Enter</strong>
          </Form.Description>
          <Form.FieldErrors class="data-[fs-error]:text-error-500" />
        </Form.Field>
      </div>
      <div class="col-span-3">
        <Form.Field {form} name={keys.blockedEmails}>
          <Form.Control let:attrs>
            <Form.Label class="label">Blocked Emails</Form.Label>
            <InputChipWrapper
              {...attrs}
              placeholder="Enter Blocked Emails..."
              class="input data-[fs-error]:input-error"
              bind:value={$formData.blockedEmails}
              validation={isValidEmail}
            />
          </Form.Control>
          <Form.Description
            class="sr-only md:not-sr-only text-sm text-gray-500"
          >
            Type valid email address and press <strong>Enter</strong>
          </Form.Description>
          <Form.FieldErrors class="data-[fs-error]:text-error-500" />
        </Form.Field>
      </div>
      <div class="col-span-3">
        <Form.Field {form} name={keys.blockedEmailDomains}>
          <Form.Control let:attrs>
            <Form.Label class="label">Blocked Email Domains</Form.Label>
            <InputChipWrapper
              class="input data-[fs-error]:input-error"
              {...attrs}
              placeholder="Enter Blocked Email Domains..."
              bind:value={$formData.blockedEmailDomains}
              validation={isValidEmailDomain}
            />
          </Form.Control>
          <Form.Description
            class="sr-only md:not-sr-only text-sm text-gray-500"
          >
            Type valid email domains name and press <strong>Enter</strong>
          </Form.Description>
          <Form.FieldErrors class="data-[fs-error]:text-error-500" />
        </Form.Field>
      </div>
      <!-- TODO: let org:owner change the owner of the org -->
      <!-- <div class="col-span-3">
        <Select
          class="input"
          itemId="id"
          label="displayName"
          placeholder="Type to select rule"
          bind:value={$formData.ownerId}
          on:change={() =>{}}
          on:clear={() =>{}}
          loadOptions={() =>{}}
          --tw-border-opacity="1"
          --tw-bg-opacity="1"
          --background="rgb(var(--color-surface-200))"
          --border-radius="var(--theme-rounded-base)"
          --border="var(--theme-border-base) solid rgb(var(--color-surface-400))"
          --border-hover="var(--theme-border-base) solid rgb(var(--color-surface-500))"
          --border-focused="var(--theme-border-base) solid rgb(var(--color-primary-500) / var(--tw-border-opacity))"
          --error-background="rgb(var(--color-error-200) / var(--tw-bg-opacity))"
          --error-border="rgb(var(--color-error-500) / var(--tw-bg-opacity))"
          --disabled-color="rgb(var(--color-surface-400) / 2)"
          --disabled-border-color="rgb(var(--color-surface-400) / 2)"
          --disabled-background="rgb(var(--color-surface-200) / 2)"
          --list-background="rgb(var(--color-surface-200) / var(--tw-bg-opacity))"
          --list-border="var(--theme-border-base) solid rgb(var(--color-surface-400) / var(--tw-bg-opacity))"
          --list-border-radius="var(--theme-rounded-container)"
          --list-empty-padding="10px"
          --list-z-index="100"
          --item-color="var(--body-text-color)"
          --item-border="var(--comfy-dropdown-border-color)"
          --item-is-active-color="rgba(var(--theme-font-color-dark))"
          --item-hover-color="rgba(var(--on-secondary))"
          --item-active-background="rgb(var(--color-surface-400) /2)"
          --item-is-active-bg="var(--pd-input-field-hover-stroke)"
          --item-hover-bg="rgba(var(--color-secondary-500) / 1)"
        >
          <b slot="prepend">
            <Search />
          </b>
          <svelte:fragment slot="input-hidden" let:value>
            <input
              type="hidden"
              name="ruleDisplayName"
              value={value ? value.displayName : null}
            />
          </svelte:fragment>
        </Select>
      </div> -->
    </section>
    <footer class="card-footer flex justify-between">
      <Form.Field {form} name={keys.autoEnroll}>
        <Form.Control let:attrs>
          <SlideToggle
            active="variant-filled"
            size="md"
            {...attrs}
            bind:checked={$formData.autoEnroll}
          >
            <Form.Label class="inline-block text-left">
              Auto Enroll <strong>{$formData.autoEnroll ? "ON" : "OFF"}</strong></Form.Label>
          </SlideToggle>
        </Form.Control>
        <Form.FieldErrors class="data-[fs-error]:text-error-500" />
      </Form.Field>
      <div class="space-x-2">
        <button
          type="button"
          class="btn variant-filled-primary"
          on:click={() => history.back()}>Back</button
        >
        <button
          type="button"
          class="btn variant-filled-warning"
          disabled={!$tainted}
          on:click={() => reset()}
        >
          Reset
        </button>
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
            {m.buttons_update()}
          {/if}
        </button>
      </div>
    </footer>
  </form>
</section>

<section class="space-y-4">
  <!-- Debug -->
  <DebugShell label="form-data">
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
</section>
