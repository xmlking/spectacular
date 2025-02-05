<script lang="ts">
import { page } from '$app/stores';
import {
  PendingValue,
  type UpdateUserDetails$input,
  type UserDetailsFragment,
  cache,
  fragment,
  graphql,
  type users_set_input,
} from '$houdini';
import * as m from '$i18n/messages';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { i18n } from '$lib/i18n';
import {
  allowedMetadata as allowedKeyValues,
  updateUserDetailsKeys as keys,
  updateUserDetailsSchema as schema,
} from '$lib/schema/user';
import { getLoadingState } from '$lib/stores/loading';
import { getNhostClient } from '$lib/stores/nhost';
import type { PartialGraphQLErrors } from '$lib/types';
import { AppBar, Avatar, filter, getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell, GraphQLErrors } from '@spectacular/skeleton';
import { Alerts, InputPairs } from '@spectacular/skeleton/components/form';
import { Logger, cleanClone } from '@spectacular/utils';
import * as Form from 'formsnap';
import type { GraphQLError } from 'graphql';
import { Loader, MoreHorizontal, UserRound } from 'lucide-svelte';
import SuperDebug, { type ErrorStatus, defaults, setError, setMessage, superForm } from 'sveltekit-superforms';
import { zod, zodClient } from 'sveltekit-superforms/adapters';
import { UpdateUserDetails } from '../mutations';

const log = new Logger('user:profile:details:browser');

export let user: UserDetailsFragment;
$: data = fragment(
  user,
  graphql(`
      fragment UserDetailsFragment on users @loading(cascade: true) {
        id
        displayName
        email
        phoneNumber
        defaultRole
        avatarUrl
        locale
        groups {
          group {
            displayName
          }
        }
        metadata
      }
    `),
);

// Reactivity
$: ({ id, ...initialData } = $data);

// Variables
const toastStore = getToastStore();
const loadingState = getLoadingState();
const nhost = getNhostClient();
const role = $page.data.role;
let gqlErrors: PartialGraphQLErrors;

const form = superForm(defaults(zod(schema)), {
  SPA: true,
  dataType: 'json',
  taintedMessage: null,
  clearOnSubmit: 'errors-and-message',
  delayMs: 100,
  timeoutMs: 4000,
  resetForm: false,
  validators: zodClient(schema),
  async onUpdate({ form, cancel }) {
    if (!form.valid) return;
    // First, check if elevate is required
    const error = await nhost.elevate();
    if (error) {
      log.error('Error elevating user', { error });
      setError(form, '', error.message, {
        status: error.status as ErrorStatus,
      });
      return;
    }
    // Second, update user profile
    // const userId = $page.data.userId;
    const payload: users_set_input = {
      // ...form.data,
      displayName: form.data.displayName,
      phoneNumber: form.data.phoneNumber,
      locale: form.data.locale,
      metadata: form.data.metadata,
      avatarUrl: form.data.avatarUrl,
    };
    const variables: UpdateUserDetails$input = { id, data: payload };
    const { errors, data } = await UpdateUserDetails.mutate(variables, {
      metadata: {
        logResult: true,
        useRole: role === 'sys:admin' ? 'sys:admin' : 'me',
      },
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

    const result = data?.updateUser?.displayName;
    if (!result) {
      log.error('no data returned');
      setMessage(
        form,
        {
          type: 'error',
          message: 'Update profile failed: responce empty',
        },
        { status: 404 },
      );
      return;
    }

    // Finally notify user: successfully creattion
    const message = {
      message: 'User Details Updated',
      type: 'success',
      timeout: 10000,
    } as const;
    setMessage(form, message);
    handleMessage(message, toastStore);
    // TODO: https://github.com/HoudiniGraphql/houdini/issues/891
    const user = cache.get('users', { id });
    user.markStale();
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

// Reactivity
$: valid = $allErrors.length === 0;
$: loadingState.setFormLoading($delayed);
$: if (id !== PendingValue) {
  // this will reset initialData after data is loaded.
  reset({ newState: { ...initialData } });
}
</script>

<AppBar>
  <svelte:fragment slot="lead"><UserRound /></svelte:fragment>
  {#if $data.displayName === PendingValue}
    <div class="placeholder animate-pulse" />
  {:else}
    <h2 class="h2" data-toc-ignore>{$data.displayName}</h2>
  {/if}
  <svelte:fragment slot="trail">
    {#if $data.avatarUrl === PendingValue && $data.displayName === PendingValue}
      <div class="placeholder-circle w-16 animate-pulse" />
    {:else}
      <Avatar
        src={$data.avatarUrl || undefined}
        initials={$data.displayName}
        width="w-11"
        action={filter}
        actionParams="#NoirLight"
      />
    {/if}
  </svelte:fragment>
</AppBar>

<!-- Form Level Errors / Messages -->
<Alerts errors={$errors._errors} message={$message} />
<!-- GraphQL Errors  -->
{#if gqlErrors}
  <GraphQLErrors errors={gqlErrors} />
{/if}
<!-- Update User Details Form -->
<form class="card" method="POST" use:enhance>
  <header class="card-header">
    <div class="text-xl">Update Profile</div>
    <!-- <div>Update your account information</div> -->
  </header>
  <section class="p-4 grid grid-cols-2 gap-4">
    <div class="space-y-4">
      <div class="grid gap-2">
        <Form.Field {form} name={keys.displayName}>
          <Form.Control let:attrs>
            <Form.Label class="label">Display Name</Form.Label>
            <input
              type="text"
              class="input data-[fs-error]:input-error"
              {...attrs}
              placeholder="John Doe"
              bind:value={$formData.displayName}
            />
          </Form.Control>
          <!-- <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Enter name for the PAT</Form.Description> -->
          <Form.FieldErrors class="data-[fs-error]:text-error-500" />
        </Form.Field>
      </div>
      <div class="grid gap-2">
        <Form.Field {form} name={keys.email}>
          <Form.Control let:attrs>
            <Form.Label class="label">Email</Form.Label>
            <input
              type="email"
              class="input data-[fs-error]:input-error"
              {...attrs}
              disabled
              placeholder="name@orgamization.com"
              bind:value={$formData.email}
            />
          </Form.Control>
          <!-- <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Enter Primary Email</Form.Description> -->
          <Form.FieldErrors class="data-[fs-error]:text-error-500" />
        </Form.Field>
      </div>
      <div class="grid gap-2">
        <Form.Field {form} name={keys.locale}>
          <Form.Control let:attrs>
            <Form.Label>Locale</Form.Label>
            <select
              class="select data-[fs-error]:input-error"
              {...attrs}
              bind:value={$formData.locale}
            >
              <option value="en">English (US)</option>
              <option value="es">Español (España)</option>
              <!-- <option value="fr">Français (France)</option> -->
              <option value="de">Deutsch (Deutschland)</option>
            </select>
          </Form.Control>
          <!-- <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">User prefered Locale</Form.Description> -->
          <Form.FieldErrors />
        </Form.Field>
      </div>
    </div>
    <div class="space-y-4">
      <div class="grid gap-2">
        <Form.Field {form} name={keys.phoneNumber}>
          <Form.Control let:attrs>
            <Form.Label class="label">Phone Number</Form.Label>
            <input
              type="tel"
              class="input data-[fs-error]:input-error"
              {...attrs}
              placeholder="+1 (555) 555-5555"
              bind:value={$formData.phoneNumber}
            />
          </Form.Control>
          <!-- <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Enter your prefered contact phone number</Form.Description> -->
          <Form.FieldErrors class="data-[fs-error]:text-error-500" />
        </Form.Field>
      </div>
      <div class="grid gap-2">
        <Form.Field {form} name={keys.defaultRole}>
          <Form.Control let:attrs>
            <Form.Label class="label">Default Role</Form.Label>
            <input
              type="text"
              class="input data-[fs-error]:input-error"
              {...attrs}
              disabled
              placeholder="User"
              bind:value={$formData.defaultRole}
            />
          </Form.Control>
          <!-- <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">User's Default Role</Form.Description> -->
          <Form.FieldErrors class="data-[fs-error]:text-error-500" />
        </Form.Field>
      </div>
      <div class="grid gap-2">
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
    </div>
    <div class="col-span-2 space-y-4">
      <div class="grid gap-2">
        <div class="flex items-center">
           <strong>Groups:</strong>
          <div>
            {#each initialData.groups as group}
              {#if group.group.displayName === PendingValue}
                <div class="placeholder animate-pulse" />
              {:else}
                <span class="badge variant-filled-primary m-2">{group.group.displayName}</span>
              {/if}
            {/each}
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-2 space-y-4">
      <div class="grid gap-2">
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
          <!-- <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500"User's Avatar URL</Form.Description> -->
          <Form.FieldErrors class="data-[fs-error]:text-error-500" />
        </Form.Field>
      </div>
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
          {m.buttons_update()}
        {/if}
      </button>
    </div>
  </footer>
</form>

<!-- Debug -->
<DebugShell label="user-details-form-data">
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
    theme="vscode"
    --sd-code-date="lightgreen"
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
