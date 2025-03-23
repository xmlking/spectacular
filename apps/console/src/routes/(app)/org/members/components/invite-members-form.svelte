<script lang="ts">
  import { run } from 'svelte/legacy';

import { page } from '$app/stores';
import {
  PendingValue,
  type UpdateUserDetails$input,
  type UserDetailsFragment,
  cache,
  fragment,
  graphql,
  type invitations_insert_input,
} from '$houdini';
import * as m from '$i18n/messages';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { i18n } from '$lib/i18n';
import { type AddMembers, addMembersKeys as keys, addMembersSchema as schema } from '$lib/schema/member';
import { getLoadingState } from '$lib/stores/loading';
import { OrgRoles, type PartialGraphQLErrors } from '$lib/types';
import { AppBar, Avatar, filter, getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell, GraphQLErrors } from '$lib/ui/components';
import { Alerts } from '$lib/ui/components/form';
import { Logger } from '@spectacular/utils';
import * as Form from 'formsnap';
import type { GraphQLError } from 'graphql';
import {
  CirclePlus,
  Link,
  Loader,
  MoreHorizontal,
  PlusIcon,
  SendIcon,
  Trash,
  TrashIcon,
  User,
  UserRound,
} from 'lucide-svelte';
import { fade, slide } from 'svelte/transition';
import SuperDebug, { type ErrorStatus, defaults, setError, setMessage, superForm } from 'sveltekit-superforms';
import { zod, zodClient } from 'sveltekit-superforms/adapters';
import { InviteMembers } from '../mutations';

// Variables
const log = new Logger('memberships:invite:form:browser');
// Available roles
const roles = [
  { value: 'org:member', label: 'Member' },
  { value: 'org:admin', label: 'Admin' },
  { value: 'org:billing', label: 'Billing' },
];
const toastStore = getToastStore();
const loadingState = getLoadingState();
const role = $page.data.role;
let gqlErrors: PartialGraphQLErrors = $state();
let isDeleting = false;

const form = superForm(defaults(zod(schema)), {
  SPA: true,
  dataType: 'json',
  taintedMessage: null,
  clearOnSubmit: 'errors-and-message',
  delayMs: 100,
  timeoutMs: 4000,
  resetForm: true,
  validators: zodClient(schema),
  async onUpdate({ form, cancel }) {
    if (!form.valid) return;
    const { data, errors } = await InviteMembers.mutate(
      { objects: form.data.invites },
      {
        metadata: { logResult: true },
      },
    );
    if (errors) {
      for (const error of errors) {
        if (error.message.includes('Uniqueness violation')) {
          setError(form, '', 'Members with some of the emails supplied are already invited');
        } else {
          gqlErrors = errors;
        }
      }
      log.error('Invite members api call error:', errors);
      return;
    }

    const result = data?.insert_invitations?.returning;
    if (!result) {
      log.error('no data returned');
      setMessage(
        form,
        {
          type: 'error',
          message: 'Invite members failed: response empty',
        },
        { status: 404 },
      );
      return;
    }

    // Finally notify user: successfully invites
    const message = {
      message: 'Invitations saved successfully',
      type: 'success',
      timeout: 10000,
    } as const;
    setMessage(form, message);
    handleMessage(message, toastStore);
    // TODO: https://github.com/HoudiniGraphql/houdini/issues/891
    // const user = cache.get('users', { id });
    // user.markStale();
    // TODO: add the returning results to invites cache.
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
// Add new member row
function addMemberRow() {
  $formData.invites = [...$formData.invites, { email: '', role: OrgRoles.Member }];
}

// Remove member row
function removeMemberRow(index: number) {
  if ($formData.invites.length > 1) {
    $formData.invites = $formData.invites.filter((_, i) => i !== index);
  }
}

// Reactivity
let valid = $derived($allErrors.length === 0);
run(() => {
    loadingState.setFormLoading($delayed);
  });
let isOwner = $derived(role === 'org:owner');
</script>

<!-- Form Level Errors / Messages -->
<Alerts errors={$errors._errors} message={$message} />
<!-- GraphQL Errors  -->
{#if gqlErrors}
  <GraphQLErrors errors={gqlErrors} />
{/if}
<!-- Add Member Form -->
<form class="card" method="POST" use:enhance>
  <header class="card-header pb-4 flex justify-between items-center">
    <p class="text-gray-500 mt-1">Invite new members by email address</p>
    <button type="button" class="btn variant-soft">
      <Link class="h-4 w-4" /> <span>Invite Link</span>
    </button>
  </header>
  <hr class="opacity-50" />
  <section class="p-4 space-y-4">
    <Form.Fieldset {form} name="invites">
      {#each $formData.invites as invite, i}
        <div transition:slide|local class="grid gap-4" style="grid-template-columns: 1fr 1fr auto;">
          <!-- Email Field -->
          <div class="space-y-2">
            <Form.ElementField {form} name="invites[{i}].email">
              <Form.Control >
                {#snippet children({ attrs })}
                                <Form.Label class="text-sm font-medium"
                    >Email Address</Form.Label
                  >
                  <input
                    {...attrs}
                    type="email"
                    placeholder="e.g. jane@example.com"
                    class="input data-[fs-error]:input-error"
                    bind:value={invite.email}
                    disabled={$submitting}
                  />
                  <Form.Description class="sr-only">
                    Member email address.
                  </Form.Description>
                  <Form.FieldErrors class="data-[fs-error]:text-error-500" />
                                              {/snippet}
                            </Form.Control>
            </Form.ElementField>
          </div>

          <!-- Role Field -->
          <div class="space-y-2">
            <Form.ElementField {form} name="invites[{i}].role">
              <Form.Control >
                {#snippet children({ attrs })}
                                <Form.Label class="text-sm font-medium">Role</Form.Label>
                  <select
                    {...attrs}
                    class="select data-[fs-error]:input-error"
                    bind:value={invite.role}
                    disabled={$submitting || !isOwner}
                  >
                    <option value="">Select Role</option>
                    {#each roles as role}
                      <option value={role.value}>{role.label}</option>
                    {/each}
                  </select>
                  <Form.Description class="sr-only">
                    Org Role: Member, Admin, or Billing. Admin can only invite
                    Members.
                  </Form.Description>
                  <Form.FieldErrors class="data-[fs-error]:text-error-500" />
                                              {/snippet}
                            </Form.Control>
            </Form.ElementField>
          </div>

          <!-- Delete Button -->
          <div
            class="flex items-center"
            class:pt-5={$errors?.invites?.[i] === undefined}
          >
            {#if $formData.invites.length > 1}
              <button
                type="button"
                onclick={() => removeMemberRow(i)}
                class="p-2 text-destructive hover:bg-destructive/10 rounded-md"
                title="Delete member"
                disabled={isDeleting || $submitting}
              >
                <TrashIcon class="size-5" />
              </button>
            {/if}
          </div>
        </div>
      {/each}
      <!-- Fieldset errors -->
      <Form.FieldErrors class="data-[fs-error]:text-error-500" />
    </Form.Fieldset>

    <!-- Form Actions -->
    <div class="flex justify-between items-center">
      <button
        type="button"
        onclick={addMemberRow}
        class="btn variant-ringed"
        disabled={$submitting}
      >
        <PlusIcon class="size-4" />
        <span>Add more</span>
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
          <SendIcon class="size-4" />
        {/if}
        <span>{$submitting ? "Sending..." : "Send Invites"}</span>
      </button>
    </div>
  </section>
  <hr class="opacity-50" />
  <footer class="card-footer pt-4 flex items-center justify-between">
    <!-- Pro Plan Notice -->
    <p class="text-muted-foreground">
      This feature is available on the
      <a href="#" class="anchor">Pro plan</a>
    </p>
    <button
      type="button"
      class="btn bg-gradient-to-br variant-gradient-success-warning"
      >Upgrade</button
    >
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
