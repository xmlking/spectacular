<script lang="ts">
import { updateUserSchema as schema } from '$lib/schema/delegation';
import { Avatar } from '@skeletonlabs/skeleton';
import { DebugShell } from '@spectacular/skeleton/components';
import { Alerts } from '@spectacular/skeleton/components/form';
import { Control, Field, FieldErrors, Label } from 'formsnap';
import { writable } from 'svelte/store';
import { fade } from 'svelte/transition';
import { superForm } from 'sveltekit-superforms';
import SuperDebug from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';

export let data;
const form = superForm(data.form, {
  dataType: 'json',
  validators: zodClient(schema),
});
const {
  form: formData,
  message,
  errors,
  tainted,
  reset,
  isTainted,
  submitting,
  delayed,
  timeout,
  posted,
  constraints,
  enhance,
} = form;
const groupRolesByOrganization = () => {
  const groupedRoles: { [key: string]: string[] } = {};
  for (const { organization, role } of data.orgRoles ?? []) {
    if (!groupedRoles[organization]) {
      groupedRoles[organization] = [];
    }
    groupedRoles[organization].push(role);
  }
  return groupedRoles;
};
const myorgroles = writable([]);
$: {
  myorgroles.set(
    data.orgRoles.filter((item) => item.organization === $formData.metadata.default_org).map((item) => item.role),
  );
}
</script>

<div class="page-container">
  <form
    method="POST"
    class=" variant-ghost-surface space-y-6 rounded-md p-4 shadow-md"
    use:enhance
  >
    <h1 class="pb-4 text-3xl font-semibold tracking-tight text-center">
      User Details
    </h1>

    <div class="flex justify-center items-center">
      <Avatar src={data.user.avatarUrl} width="w-16" rounded="rounded-full" />
    </div>

    <!-- Form Level Errors / Messages -->
    <Alerts errors={$errors._errors} message={$message} />

    <div class="md:grid-cols-col-span-3 mb-6 grid gap-6 lg:grid-cols-6">
      <div class="col-span-3">
        <Field {form} name="displayName">
          <Control let:attrs>
            <div class="grid gap-2">
              <Label>DisplayName</Label>
              <input
                {...attrs}
                class="input"
                bind:value={$formData.displayName}
              />
              <FieldErrors class="data-fs-[error=true]:bg-red-200" />
            </div>
          </Control>
        </Field>
      </div>
      <div class="col-span-3">
        <Field {form} name="email">
          <Control let:attrs>
            <div class="grid gap-2">
              <Label>Email</Label>
              <input
                {...attrs}
                class="input"
                bind:value={$formData.email}
                disabled
              />
              <FieldErrors class="data-fs-[error=true]:bg-red-200" />
            </div>
          </Control>
        </Field>
      </div>
      <div class="col-span-3">
        <Field {form} name="metadata.default_org">
          <Control let:attrs>
            <div class="grid gap-2">
              <Label>Default Organization</Label>
              <select
                bind:value={$formData.metadata.default_org}
                class="border border-gray-300 rounded-full text-gray-600 h-10 pl-5 pr-10 hover:border-gray-400 focus:outline-none appearance-none"
              >
                <option value={$formData.metadata.default_org} disabled hidden
                  >{$formData.metadata.default_org}</option
                >
                {#each [...data.user.allowedOrgs].reverse() as org}
                  <option value={org.organization}
                    ><button>{org.organization}</button></option
                  >
                {/each}
              </select>
              <FieldErrors class="data-fs-[error=true]:bg-red-200" />
            </div>
          </Control>
        </Field>
      </div>
      <div class="col-span-3">
        <Field {form} name="defaultRole">
          <Control let:attrs>
            <div class="grid gap-2">
              <Label>Default Role</Label>
              <select
                bind:value={$formData.defaultRole}
                class="border border-gray-300 rounded-full text-gray-600 h-10 pl-5 pr-10 hover:border-gray-400 focus:outline-none appearance-none"
              >
                <option value={$formData.defaultRole} disabled hidden
                  >{$formData.defaultRole}</option
                >
                {#each $myorgroles as role}
                  <option value={role}><button>{role}</button></option>
                {/each}
              </select>
              <FieldErrors class="data-fs-[error=true]:bg-red-200" />
            </div>
          </Control>
        </Field>
      </div>
    </div>

    <!-- Form Action Buttons -->
    <button
      type="button"
      class="variant-ghost-secondary btn"
      on:click={() => history.back()}>Back</button
    >
    <button
      type="button"
      class="variant-ghost-warning btn"
      disabled={!$tainted}
      on:click={() => reset()}
    >
      Reset
    </button>

    <button
      class="variant-ghost-success btn"
      type="submit"
      disabled={!$tainted || $submitting}
    >
      {#if $submitting}
        <aside
          class="alert rounded-sm"
          transition:fade|local={{ duration: 400 }}
        >
          Saving..
        </aside>
      {:else}
        Update
      {/if}
    </button>
  </form>

  <DebugShell>
    <SuperDebug
      label="Miscellaneous"
      status={false}
      data={{
        message: $message,
        isTainted: isTainted,
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
  </DebugShell>
</div>

 
