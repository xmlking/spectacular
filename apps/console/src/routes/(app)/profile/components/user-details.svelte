<script lang="ts">
  import { run } from 'svelte/legacy';

import { page } from '$app/stores';
import {
  CachePolicy,
  GetUserStore,
  PendingValue,
  type UpdateUserDetails$input,
  type UserDetailsFragment,
  fragment,
  graphql,
  type users_set_input,
} from '$houdini';
import * as m from '$i18n/messages';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { updateUserDetailsKeys as keys, updateUserDetailsSchema } from '$lib/schema/user';
import { getLoadingState } from '$lib/stores/loading';
import { getNhostClient } from '$lib/stores/nhost';
import { AppBar, Avatar, NoirLight, filter, getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell } from '@spectacular/skeleton';
import { Alerts } from '@spectacular/skeleton/components/form';
import { Logger, cleanClone } from '@spectacular/utils';
import * as Form from 'formsnap';
import type { GraphQLError } from 'graphql';
import { Loader, MoreHorizontal, UserRound } from 'lucide-svelte';
import SuperDebug, { type ErrorStatus, defaults, setError, setMessage, superForm } from 'sveltekit-superforms';
import { zod, zodClient } from 'sveltekit-superforms/adapters';

  interface Props {
    user: UserDetailsFragment;
  }

  let { user }: Props = $props();
let data = $derived(fragment(
  user,
  graphql(`
      fragment UserDetailsFragment on users @loading(cascade: true) {
        id
        displayName
        email
        phoneNumber
        defaultOrg
        defaultRole
        avatarUrl
        locale
        plan: metadata(path: "plan")
      }
    `),
));

let { id, displayName, email, phoneNumber, defaultOrg, defaultRole, avatarUrl, locale, plan } = $derived($data);

const updateUserDetails = graphql(`
    mutation UpdateUserDetails($id: uuid!,  $data: users_set_input!) {
      updateUser(pk_columns: { id: $id },  _set: $data) {
      displayName
      phoneNumber
      locale
      plan: metadata(path: "plan")
      avatarUrl
      }
    }
  `);

// Variables
const log = new Logger('profile:profile:details:browser');
const toastStore = getToastStore();
const loadingState = getLoadingState();
const nhost = getNhostClient();
const form = superForm(defaults(zod(updateUserDetailsSchema)), {
  SPA: true,
  dataType: 'json',
  taintedMessage: null,
  clearOnSubmit: 'errors-and-message',
  delayMs: 100,
  timeoutMs: 4000,
  resetForm: false,
  invalidateAll: false, // this is key to avoid unnecessary data fetch call while using houdini smart cache.
  validators: zodClient(updateUserDetailsSchema),
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
    // const id = $page.data.session.user.id;
    const payload: users_set_input = {
      // ...form.data,
      displayName: form.data.displayName,
      phoneNumber: form.data.phoneNumber,
      locale: form.data.locale,
      metadata: { plan: form.data.plan, default_org: defaultOrg },
      avatarUrl: form.data.avatarUrl,
    };
    const variables: UpdateUserDetails$input = { id, data: payload };
    const { errors, data } = await updateUserDetails.mutate(variables, {
      metadata: { logResult: true, useRole: 'me' },
    });
    if (errors) {
      log.error(errors);
      for (const error of errors) {
        log.error('update profile api error', error);
        setError(form, '', (error as GraphQLError).message);
      }
      setMessage(form, { type: 'error', message: 'Update organization failed' });
      return;
    }
    if (!data?.updateUser?.displayName) {
      log.error('no data returned');
      setMessage(form, { type: 'error', message: 'Update profile failed: responce empty' }, { status: 404 });
      return;
    }
    // Finally notify user: successfully added a new security key
    const message = {
      message: 'User Details Updated',
      hideDismiss: true,
      timeout: 10000,
      type: 'success',
    } as const;
    setMessage(form, message);
    handleMessage(message, toastStore);
    // TODO: https://github.com/HoudiniGraphql/houdini/issues/891
    // TODO: add { id, personalAccessToken }  to cache, instead of reload()
    await reload();
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
/**
 * FIXME: Workaround for refresh page, after first time security token added
 * https://github.com/HoudiniGraphql/houdini/issues/891
 */
async function reload() {
  const getUserStore = new GetUserStore();
  // const userId = '076a79f9-ed08-4e28-a4c3-8d4e0aa269a3'
  const userId = $page.data.session.user.id;
  console.log({ userId });
  const { data, errors } = await getUserStore.fetch({
    blocking: true,
    policy: CachePolicy.NetworkOnly,
    variables: { userId },
  });
  console.log({ data, errors });
}
// Reactivity
let valid = $derived($allErrors.length === 0);
run(() => {
    loadingState.setFormLoading($delayed);
  });

// copy initialData to superform as soon as data is loaded
// $: $formData = { displayName, email, phoneNumber, defaultRole, locale, plan, avatarUrl };
run(() => {
    if (id !== PendingValue) {
    $formData = { displayName, email, phoneNumber, defaultRole, locale, plan, avatarUrl };
  }
  });
</script>

<AppBar>
  {#snippet lead()}
    <UserRound />
  {/snippet}
  {#if $data.displayName === PendingValue}
    <div class="placeholder animate-pulse"></div>
  {:else}
    <h2 class="h2" data-toc-ignore>{$data.displayName}</h2>
  {/if}
  {#snippet trail()}
  
      {#if $data.avatarUrl === PendingValue && $data.displayName === PendingValue}
        <div class="placeholder-circle w-16 animate-pulse"></div>
      {:else}
        <Avatar
          src={$data.avatarUrl || undefined}
          initials={$data.displayName}
          width="w-11"
          action={filter}
          actionParams="#NoirLight"
        />
      {/if}
    
  {/snippet}
</AppBar>

<!-- Form Level Errors / Messages -->
<Alerts errors={$errors._errors} message={$message} />
<!-- Update User Details Form -->
<form class="card" method="POST" use:enhance>
  <header class="card-header">
      <div class="text-xl">Edit Profile</div>
      <!-- <div>Update your account information</div> -->
  </header>
  <section class="p-4 grid grid-cols-2 gap-4">
    <div class="space-y-4">
      <div class="grid gap-2">
        <Form.Field {form} name={keys.displayName}>
          <Form.Control >
            {#snippet children({ attrs })}
                        <Form.Label class="label">Display Name</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs}
                placeholder="John Doe"
                bind:value={$formData.displayName}
              />
                                  {/snippet}
                    </Form.Control>
          <!-- <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Enter name for the PAT</Form.Description> -->
          <Form.FieldErrors class="data-[fs-error]:text-error-500" />
        </Form.Field>
      </div>
      <div class="grid gap-2">
        <Form.Field {form} name={keys.email}>
          <Form.Control >
            {#snippet children({ attrs })}
                        <Form.Label class="label">Email</Form.Label>
              <input
                type="email"
                class="input data-[fs-error]:input-error"
                {...attrs} disabled
                placeholder="name@orgamization.com"
                bind:value={$formData.email}
              />
                                  {/snippet}
                    </Form.Control>
          <!-- <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Enter Primary Email</Form.Description> -->
          <Form.FieldErrors class="data-[fs-error]:text-error-500" />
        </Form.Field>
      </div>
      <div class="grid gap-2">
        <Form.Field {form} name={keys.locale}>
          <Form.Control >
              {#snippet children({ attrs })}
                        <Form.Label>Locale</Form.Label>
                <select
                class="select data-[fs-error]:input-error"
                {...attrs}
                bind:value={$formData.locale}>
                    <option value="en">English (US)</option>
                    <option value="es">Español (España)</option>
                    <!-- <option value="fr">Français (France)</option> -->
                    <option value="de">Deutsch (Deutschland)</option>
                </select>
                                  {/snippet}
                    </Form.Control>
          <!-- <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">User prefered Locale</Form.Description> -->
          <Form.FieldErrors />
        </Form.Field>
      </div>
    </div>
    <div class="space-y-4">
      <div class="grid gap-2">
        <Form.Field {form} name={keys.phoneNumber}>
          <Form.Control >
            {#snippet children({ attrs })}
                        <Form.Label class="label">Phone Number</Form.Label>
              <input
                type="tel"
                class="input data-[fs-error]:input-error"
                {...attrs}
                placeholder="+1 (555) 555-5555"
                bind:value={$formData.phoneNumber}
              />
                                  {/snippet}
                    </Form.Control>
          <!-- <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Enter your prefered contact phone number</Form.Description> -->
          <Form.FieldErrors class="data-[fs-error]:text-error-500" />
        </Form.Field>
      </div>
      <div class="grid gap-2">
        <Form.Field {form} name={keys.defaultRole}>
          <Form.Control >
            {#snippet children({ attrs })}
                        <Form.Label class="label">Default Role</Form.Label>
              <input
                type="text"
                class="input data-[fs-error]:input-error"
                {...attrs} disabled
                placeholder="User"
                bind:value={$formData.defaultRole}
              />
                                  {/snippet}
                    </Form.Control>
          <!-- <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">User's Default Role</Form.Description> -->
          <Form.FieldErrors class="data-[fs-error]:text-error-500" />
        </Form.Field>
      </div>
      <div class="grid gap-2">
        <Form.Field {form} name={keys.plan}>
          <Form.Control >
              {#snippet children({ attrs })}
                        <Form.Label>Plan</Form.Label>
                <select
                class="select data-[fs-error]:input-error"
                {...attrs}
                bind:value={$formData.plan}>
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
                                  {/snippet}
                    </Form.Control>
          <!-- <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">User's subscription plan</Form.Description> -->
          <Form.FieldErrors />
        </Form.Field>
      </div>
    </div>
    <div class="col-span-2 space-y-4">
      <div class="grid gap-2">
        <Form.Field {form} name={keys.avatarUrl}>
          <Form.Control >
            {#snippet children({ attrs })}
                        <Form.Label class="label">Avatar URL</Form.Label>
              <input
                type="url"
                class="input data-[fs-error]:input-error"
                {...attrs}
                placeholder="https://example.com/avatar.jpg"
                bind:value={$formData.avatarUrl}
              />
                                  {/snippet}
                    </Form.Control>
          <!-- <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500"User's Avatar URL</Form.Description> -->
          <Form.FieldErrors class="data-[fs-error]:text-error-500" />
        </Form.Field>
      </div>
    </div>
  </section>
  <footer class="card-footer flex justify-end">
    <button
      type="submit"
      class="btn variant-filled-secondary"
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
  </footer>
  </form>

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
</DebugShell>
