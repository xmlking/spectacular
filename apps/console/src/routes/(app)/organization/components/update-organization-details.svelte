<script lang="ts">
import {
  cache,
  type UpdateOrganizationDetails$input,
  type OrganizationDetailsFragment,
  fragment,
  graphql,
  type organizations_set_input,
} from '$houdini';
import * as m from '$i18n/messages';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { i18n } from '$lib/i18n';
import {
  updateOrganizationSchema as schema,
  updateOrganizationKeys as keys,
  type UpdateOrganization,
  allowedMetadata as allowedKeyValues,
} from '$lib/schema/organization';
import { getLoadingState } from '$lib/stores/loading';
import type { PartialGraphQLErrors } from '$lib/types';
import { SlideToggle, getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell, GraphQLErrors } from '@spectacular/skeleton';
import { Alerts, InputChipWrapper } from '@spectacular/skeleton/components/form';
import { Logger, cleanClone } from '@spectacular/utils';
import * as Form from 'formsnap';
import { UpdateOrganizationDetails } from '../../organizations/mutations';
import type { GraphQLError } from 'graphql';
import { Loader, MoreHorizontal } from 'lucide-svelte';
import SuperDebug, { defaults, setError, setMessage, superForm, type SuperValidated } from 'sveltekit-superforms';
import { zod, zodClient } from 'sveltekit-superforms/adapters';
import { invalidate } from '$app/navigation';
import { InputPairs, type KeyValueRecord } from '@spectacular/skeleton/components/form';

const log = new Logger('organization:org:details:browser');

export let organization: OrganizationDetailsFragment;
$: data = fragment(
  organization,
  graphql(`
      fragment OrganizationDetailsFragment on organizations  {
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
$: if (id) {
  // this will reset initialData after data is loaded.
  reset({ newState: { ...initialData } });
}

// Variables
const toastStore = getToastStore();
const loadingState = getLoadingState();
let gqlErrors: PartialGraphQLErrors;

const form = superForm(defaults(zod(schema)), {
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
    const variables: UpdateOrganizationDetails$input = { id, data: dataCopy };
    const { data, errors } = await UpdateOrganizationDetails.mutate(variables, {
      metadata: { logResult: true },
    });
    if (errors) {
      for (const error of errors) {
        log.error(error);
        if (error.message.includes('Uniqueness violation')) {
          setError(form, 'displayName', 'Display Name already taken');
        } else {
          gqlErrors = errors;
        }
        setError(form, '', (error as GraphQLError).message);
      }
      setMessage(form, {
        type: 'error',
        message: 'Update failed',
      });
      return;
    }

    const result = data?.update_organizations_by_pk;
    if (!result) {
      log.error('no data returned');
      setMessage(
        form,
        {
          type: 'error',
          message: 'Update organization failed: responce empty',
        },
        { status: 404 },
      );
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
    await invalidate(() => true);
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
</script>

<section class="space-y-4">
  <!-- Form Level Errors / Messages -->
  <Alerts errors={$errors._errors} message={$message} />
  <!-- GraphQL Errors  -->
  {#if gqlErrors}
    <GraphQLErrors errors={gqlErrors} />
  {/if}
  <!-- Update Organization Details Form -->
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
          <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500"
            >Org's Avatar URL</Form.Description
          >
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
          <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500"
            >Enter the tags and press <strong>Enter</strong></Form.Description
          >
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
          <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500"
            >Enter the metadata</Form.Description
          >
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
          <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500"
            >Type valid email address and press <strong>Enter</strong
            ></Form.Description
          >
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
          <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500"
            >Type valid email domains name and press <strong>Enter</strong
            ></Form.Description
          >
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
          <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500"
            >Type valid email address and press <strong>Enter</strong
            ></Form.Description
          >
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
          <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500"
            >Type valid email domains name and press <strong>Enter</strong
            ></Form.Description
          >
          <Form.FieldErrors class="data-[fs-error]:text-error-500" />
        </Form.Field>
      </div>
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
              Auto Enroll <strong>{$formData.autoEnroll ? "ON" : "OFF"}</strong
              ></Form.Label
            >
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
