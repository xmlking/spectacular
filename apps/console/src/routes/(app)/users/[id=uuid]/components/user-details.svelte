<script lang="ts">
import { updateUserSchema as schema, updateUserKeys as keys } from '$lib/schema/delegation';
import { Avatar } from '@skeletonlabs/skeleton';
import { PendingValue, type UserData1$result, graphql } from '$houdini';
import * as Form from 'formsnap';
import { fade } from 'svelte/transition';
import { superForm } from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';

export let data: UserData1$result;
let { user } = data;
$: ({ user } = data);
const form = superForm(user ?? {}, {
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
      <Avatar src={user.avatarUrl} width="w-16" rounded="rounded-full" />
    </div>

    <div class="md:grid-cols-col-span-3 mb-6 grid gap-6 lg:grid-cols-6">
      <div class="col-span-3">
        <Form.Field {form} name={keys.displayName}>
          <Form.Control let:attrs>
            <Form.Label class="label">Display Name</Form.Label>
            <input
              type="text"
              class="input data-[fs-error]:input-error"
              {...attrs}
              placeholder="Enter Display Name..."
              disabled
              bind:value={$formData.displayName}
            />
            <Form.Description
              class="sr-only md:not-sr-only text-sm text-gray-500"
              >Enter the User display name</Form.Description
            >
            <Form.FieldErrors class="data-[fs-error]:text-error-500" />
          </Form.Control>
        </Form.Field>
      </div>
      <div class="col-span-3">
        <Form.Field {form} name={keys.defaultRole}>
          <Form.Control let:attrs>
            <Form.Label class="label">Default Role</Form.Label>
            <input
              type="text"
              class="input data-[fs-error]:input-error"
              {...attrs}
              placeholder="Enter Default Role..."
              disabled
              bind:value={$formData.defaultRole}
            />
          </Form.Control>
          <Form.FieldErrors class="data-[fs-error]:text-error-500" />
        </Form.Field>
      </div>
      <div class="col-span-3">
        <Form.Field {form} name={keys.defaultOrg}>
          <Form.Control let:attrs>
            <Form.Label class="label">Default Org</Form.Label>
            <input
              type="text"
              class="input data-[fs-error]:input-error"
              {...attrs}
              placeholder="Enter defaultOrg..."
              disabled
              bind:value={$formData.defaultOrg}
            />
          </Form.Control>
          <Form.FieldErrors class="data-[fs-error]:text-error-500" />
        </Form.Field>
      </div>
      <div class="col-span-3">
        <Form.Field {form} name={keys.email}>
          <Form.Control let:attrs>
            <Form.Label class="label">Email</Form.Label>
            <input
              type="text"
              class="input data-[fs-error]:input-error"
              {...attrs}
              placeholder="Enter Email..."
              disabled
              bind:value={$formData.email}
            />
          </Form.Control>
          <Form.FieldErrors class="data-[fs-error]:text-error-500" />
        </Form.Field>
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
</div>
