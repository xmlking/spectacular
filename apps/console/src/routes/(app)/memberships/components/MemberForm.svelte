<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { X } from "lucide-svelte";
  import {
    PendingValue,
    type Memberships$result,
    CachePolicy,
    graphql,
  } from "$houdini";
  import { writable } from "svelte/store";
  import { loaded } from "$lib/graphql/loading";
  import Select from "svelte-select";
  import { DataHandler, type Row, check } from "@vincjo/datatables/legacy";
  import { handleMessage } from "$lib/components/layout/toast-manager";
  import { getToastStore } from "@skeletonlabs/skeleton";
  import { Logger, cleanClone } from "@spectacular/utils";
  import { getNhostClient } from "$lib/stores/nhost";
  import { get } from "svelte/store";
  import { CreateMembership } from "../mutations";
  import { invalidate } from "$app/navigation";
  const dispatch = createEventDispatcher();
  const toastStore = getToastStore();
  const nhost = getNhostClient();
  const log = new Logger("membership.create.browser");

  const searchUsers: any = graphql`
    query getusersM($orgId: uuid!) @cache(policy: NetworkOnly) {
      users(
        where: {
          allowedOrgs_aggregate: {
            count: { predicate: { _eq: 0 }, filter: { orgId: { _eq: $orgId } } }
          }
        }
      ) {
        id
        displayName
        email
      }
    }
  `;
  const orgId = nhost.auth.getHasuraClaims()?.["x-hasura-default-org"];
  const names = writable<string[]>([]);
  const emails = writable<string[]>([]);
  const usersdata = writable<any[]>([]);
  async function fetchData() {
    const variables = { orgId };
    const response = await searchUsers.fetch({
      blocking: true,
      policy: CachePolicy.CacheAndNetwork,
      metadata: { logResult: true },
      variables,
    });
    if (response?.data?.users) {
      // Extract displayName and email
      usersdata.set(response.data.users);
      const userNames = response.data.users.map(
        (user: any) => user.displayName,
      );
      const userEmails = response.data.users.map((user: any) => user.email);

      // Update the writable stores
      names.set(userNames);
      emails.set(userEmails);
    }
  }
  fetchData();
  // Form data
  let name = "";
  let email = "";
  let id = "";
  let role: "org:admin" | "org:member" = "org:member";

  // Validation state
  let errors: Record<string, string> = {};

  /** Validate form */
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  };
  function namefunc() {
    const currentUsers = get(usersdata);
    const user = currentUsers.find((user) => user.displayName === name);
    if (user) {
      id = user.id;
      email = user.email;
    }
  }
  function emailfunc() {
    const currentUsers = get(usersdata);
    const user = currentUsers.find((user) => user.email === email);
    if (user) {
      id = user.id;
      name = user.displayName;
    }
  }
  /** Handle form submission */
  async function handleSubmit(event: Event) {
    if (!validateForm()) return;

    const payload = {
      userId: id,
      role,
    };
    const { data, errors } = await CreateMembership.mutate(
      { data: payload },
      { metadata: { logResult: true } },
    );

    if (errors) {
      for (const error of errors) {
        if (error.message.includes("Uniqueness violation")) {
          log.error("already exists");
        } else {
          log.error(error);
        }
      }
      return;
    }

    const result = data?.insert_memberships_one;
    if (!result) {
      log.error("field to create membership");
      return;
    }

    // Finally notify user: successfully created new policy
    handleMessage(
      {
        message: `<p class="text-xl">Membership : successfully created for <span class="text-red-500 font-bold"> ${name}</span> with <span class="text-red-500 font-bold">${role}</span> role</p>`,
        hideDismiss: false,
        timeout: 10000,
        type: "success",
      },
      toastStore,
    );
    invalidate(() => true);
    dispatch("cancel");
  }
</script>

<form on:submit={handleSubmit} class="p-4">
  <div class="space-y-4">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700 mb-1"
        >Name</label
      >
      <Select
        bind:justValue={name}
        bind:value={name}
        items={$names}
        on:change={namefunc}
        placeholder="start typing..."
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
        {...$$restProps}
      />
      {#if errors.name}
        <p class="mt-1 text-sm text-red-600">{errors.name}</p>
      {/if}
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 mb-1"
        >Email</label
      >
      <Select
        bind:justValue={email}
        bind:value={email}
        items={$emails}
        on:change={emailfunc}
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
      />
      {#if errors.email}
        <p class="mt-1 text-sm text-red-600">{errors.email}</p>
      {/if}
    </div>

    <div>
      <label for="role" class="block text-sm font-medium text-gray-700 mb-1"
        >Role</label
      >
      <select
        id="role"
        bind:value={role}
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="org:member">Member</option>
        <option value="org:admin">Admin</option>
      </select>
    </div>
  </div>

  <div class="mt-6 flex justify-end gap-3">
    <button
      type="button"
      on:click={() => dispatch("cancel")}
      class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >Cancel</button
    >
    <button
      type="submit"
      class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
      >Add Member</button
    >
  </div>
</form>
