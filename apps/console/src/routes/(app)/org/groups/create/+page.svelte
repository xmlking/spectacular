<script lang="ts">
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { graphql, type groups_insert_input } from '$houdini';
import * as m from '$i18n/messages';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { i18n } from '$lib/i18n';
import {
  updateGroupSchema as schema,
  updateGroupKeys as keys,
  allowedMetadata as allowedKeyValues,
  type UpdateGroup,
} from '$lib/schema/group';
import { getLoadingState } from '$lib/stores/loading';
import type { PartialGraphQLErrors } from '$lib/types';
import { SlideToggle } from '@skeletonlabs/skeleton';
import { getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell, GraphQLErrors } from '@spectacular/skeleton';
import { Alerts, InputChipWrapper, InputPairs } from '@spectacular/skeleton/components/form';
import { Logger, cleanClone } from '@spectacular/utils';
import * as Form from 'formsnap';
import { Loader, MoreHorizontal } from 'lucide-svelte';
import Select from 'svelte-select';
import SuperDebug, { defaults, setError, setMessage, superForm } from 'sveltekit-superforms';
import { zod, zodClient } from 'sveltekit-superforms/adapters';
import { createGroup } from '../mutations';

const log = new Logger('groups.create.browser');

// Variables
const toastStore = getToastStore();
const loadingState = getLoadingState();
let gqlErrors: PartialGraphQLErrors;

const form = superForm(defaults(zod(schema)), {
  SPA: true,
  dataType: 'json',
  taintedMessage: null,
  syncFlashMessage: false,
  resetForm: true,
  delayMs: 100,
  timeoutMs: 4000,
  validators: zodClient(schema),
  async onUpdate({ form, cancel }) {
    if (!form.valid) return;

    const dataCopy = cleanClone(form.data, { empty: 'strip' });

    const { data, errors } = await createGroup.mutate({ data: dataCopy }, { metadata: { logResult: true } });

    if (errors) {
      for (const error of errors) {
        if (error.message.includes('Uniqueness violation')) {
          setError(form, 'displayName', 'Display Name already taken');
        } else {
          gqlErrors = errors;
        }
      }
      log.error('create group api call error:', errors);
      return;
    }

    const result = data?.insert_groups_one;
    if (!result) {
      setMessage(form, { type: 'error', message: 'Create group failed: responce empty' }, { status: 404 });
      return;
    }

    // Finally notify user: successfully creattion
    const message: App.Superforms.Message = {
      type: 'success',
      timeout: 10000,
      message: `Group: ${dataCopy.displayName} created successfully`,
    } as const;
    setMessage(form, message);
    handleMessage(message, toastStore);
    await goto(i18n.resolveRoute('/org/groups'));
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

<svelte:head>
  <title>Groups</title>
  <meta name="description" content="Create Group" />
</svelte:head>

<div class="page-container">
  <section class="space-y-4">
    <h1 class="h1">Groups</h1>
    <p>create group</p>
  </section>

  <section class="space-y-4">
    <!-- Form Level Errors / Messages -->
    <Alerts errors={$errors._errors} message={$message} />
    <!-- GraphQL Errors  -->
    {#if gqlErrors}
      <GraphQLErrors errors={gqlErrors} />
    {/if}
    <!-- Create Group Form -->
    <form class="card md:space-y-8" method="POST" use:enhance>
      <header class="card-header">
        <div class="text-xl">Create Group</div>
        <!-- <div>Create new Group</div> -->
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
                >Enter the group display name</Form.Description
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
            <Form.Description
              class="sr-only md:not-sr-only text-sm text-gray-500"
              >Enter the group description</Form.Description
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
            <Form.Description
              class="sr-only md:not-sr-only text-sm text-gray-500"
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
            <Form.Description
              class="sr-only md:not-sr-only text-sm text-gray-500"
              >Enter the metadata</Form.Description
            >
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Field>
        </div>
      </section>
      <footer class="card-footer flex justify-end">
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
              {m.buttons_create()}
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
</div>
