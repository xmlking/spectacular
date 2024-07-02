<script lang="ts">
  import { Form } from "$lib/components/form";
  import { updateUserSchema as schema } from "$lib/schema/delegation";
  import { Avatar } from "@skeletonlabs/skeleton";
  import { Control, Field, FieldErrors, Label } from "formsnap";
  import { writable } from "svelte/store";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  export let data;
  const form = superForm(data.form, {
    dataType: "json",
    validators: zodClient(schema),
  });
  const {
    form: formData,
    message,
    errors,
    tainted,
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
    for (const { organization, role } of data.orgRoles) {
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
      data.orgRoles
        .filter((item) => item.organization === $formData.metadata.default_org)
        .map((item) => item.role),
    );
    $formData.defaultRole = data.orgRoles.find(
      (role) =>
        role.isDefaultRole === true &&
        role.organization === $formData.metadata.default_org,
    ).role;
  }
</script>

<div class="page-container">
  <Form
    {form}
    submitButtonText="Update"
    class=" variant-ghost-surface space-y-6 rounded-md p-4 shadow-md "
  >
    <h1 class="pb-4 text-3xl font-semibold tracking-tight text-center">
      User Details
    </h1>
    <div class="flex justify-center items-center">
      <Avatar src={data.user.avatarUrl} width="w-16" rounded="rounded-full" />
    </div>
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
                {#each data.user.allowedOrgs as org}
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
  </Form>
</div>
