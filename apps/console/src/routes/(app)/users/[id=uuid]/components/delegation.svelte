<!-- @migration-task Error while migrating Svelte code: `<button>` is invalid inside `<option>` -->
<script lang="ts">
import { invalidateAll } from '$app/navigation';
import { AddOrganizationStore, UpdatehomerolesStore, UpdatenonhomerolesStore } from '$houdini';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { getToastStore, popup } from '@skeletonlabs/skeleton';
import * as Table from '@spectacular/skeleton/components/table';
import { findAddedAndRemoved } from '@spectacular/utils';
import { DataHandler } from '@vincjo/datatables';
import { Pencil } from 'lucide-svelte';
import { writable } from 'svelte/store';
export let data: any;

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

const handler = new DataHandler(Object.entries(groupRolesByOrganization()), {
  rowsPerPage: 10,
});
const rows = handler.getRows();
const inputChip = '';
const def_org = data.user.metadata.default_org;
const roles: string[] = data.orgRoles.map((rol: { role: string }) => rol.role);
const organizations: string[] = data.organizations.map((org) => org.organization);
const allowedOrgs = data.user.allowedOrgs.map((item: { organization: string }) => item.organization);
const filterOrgs = organizations.filter((role) => !allowedOrgs.includes(role));
let disablebutton = filterOrgs.length === 0;
let neworg = '';
let newdefrole = '';
let defrole = '';
const newroles = writable([]);
const updateroles = writable([]);
const roleHierarchy = ['anonymous', 'me', 'user', 'supervisor', 'manager'];
const toastStore = getToastStore();
const Addorgroles = new AddOrganizationStore();
const updatehomerolesStore = new UpdatehomerolesStore();
const updatenonhomerolesStore = new UpdatenonhomerolesStore();
async function addorg(Org: string, roless: string[], defrole: string, userId: string) {
  const getHighestRole = (roless: string[]) => {
    return roless.reduce((highestRole: string, currentRole: string) => {
      return roleHierarchy.indexOf(currentRole) > roleHierarchy.indexOf(highestRole) ? currentRole : highestRole;
    }, roless[0]);
  };
  let defaultRole = getHighestRole(roless);
  if (defrole.length > 0) {
    defaultRole = defrole;
  }
  const rolesAdd = roless.map((role) => ({
    userId: userId,
    organization: Org,
    role: role,
    isDefaultRole: role === defaultRole,
  }));
  const { errors, data } = await Addorgroles.mutate({ roles: rolesAdd });
  if (errors) {
    console.log(errors.toString());
  }
  if (data?.insert_user_org_roles) {
    handleMessage(
      {
        message: `<p class="text-xl">User: New <span class="text-red-500 font-bold"> ${Org}</span> Added with <span class="text-red-500 font-bold">${roless}</span> roles and <span class="text-red-500 font-bold">${defaultRole}</span> as default role </p>`,
        type: 'success',
      },
      toastStore,
    );
  }
  await invalidateAll();
  window.location.reload();
}
async function updorg(Org: string, roless: string[], userId: string) {
  const getHighestRole = (roless: string[]) => {
    return roless.reduce((highestRole: string, currentRole: string) => {
      return roleHierarchy.indexOf(currentRole) > roleHierarchy.indexOf(highestRole) ? currentRole : highestRole;
    }, roless[0]);
  };
  const defaultRole = getHighestRole(roless);
  if (!roless.includes(defrole) && roles.includes(defaultRole)) {
    defrole = defaultRole;
  }
  let myorg: string[] = [];
  if (data.orgRoles.length > 0) {
    myorg = data.orgRoles
      .filter((item: { organization: string }) => item.organization === Org)
      .map((item: { role: string }) => item.role);
  }
  const result = findAddedAndRemoved(myorg, roless);
  console.log(result.added);
  const delroles: string[] = result.removed;
  const addedroles: string[] = result.added;
  const rolesAdd = addedroles.map((role) => ({
    userId: userId,
    organization: Org,
    role: role,
  }));
  const defrolesAdd = addedroles.map((role) => ({
    userId: userId,
    role: role,
  }));
  if (Org === def_org) {
    const { errors, data } = await updatehomerolesStore.mutate({
      userId: userId,
      defaultRole: defrole,
      delroles: delroles,
      Authroles: defrolesAdd,
    });
    if (errors) {
      console.log(errors.toString());
    }
    if (data?.insertAuthUserRoles) {
      handleMessage(
        {
          message: `<p class="text-xl">User: <span class="text-red-500 font-bold">${Org}</span> Updated with <span class="text-red-500 font-bold">${roless}</span> roles</p>`,
          type: 'success',
        },
        toastStore,
      );
    }
  } else {
    const { errors, data } = await updatenonhomerolesStore.mutate({
      userId: userId,
      Org: Org,
      defrole: defrole,
      delroles: delroles,
      roles: rolesAdd,
    });
    if (errors) {
      console.log(errors.toString());
    }
    if (data?.insert_user_org_roles) {
      handleMessage(
        {
          message: `<p class="text-xl">User: <span class="text-red-500 font-bold">${Org}</span> Updated with <span class="text-red-500 font-bold">${roless}</span> roles</p>`,
          type: 'success',
        },
        toastStore,
      );
    }
  }
  await invalidateAll();
  window.location.reload();
}
function radiobutton(role: string) {
  newdefrole = role;
}
function handleCheckboxChange(role: string, event: Event) {
  const target = event.target as HTMLInputElement;
  newroles.update((current) => {
    if (target.checked) {
      // Add role to selectedroles if it's not already there
      return [...current, role];
    }
    // Remove role from selectedroles if it's there
    return current.filter((r) => r !== role);
  });
}
function handleupdateRoles(role: string, event: Event) {
  const target = event.target as HTMLInputElement;
  updateroles.update((current) => {
    if (target.checked) {
      // Add role to selectedroles if it's not already there
      return [...current, role];
    }
    // Remove role from selectedroles if it's there
    return current.filter((r) => r !== role);
  });
}
</script>

<div class="page-container">
  <header class="flex justify-between">
    <h1 class="text-xl font-bold">
      <span
        class="bg-gradient-to-br from-red-500 to-yellow-500 box-decoration-clone bg-clip-text text-transparent"
        >{data.user.displayName}</span
      >
    </h1>
    <div
      class="flex justify-center items-center"
      use:popup={{
        event: "click",
        target: "addorg",
        placement: "bottom",
        closeQuery: "#will-close",
      }}
    >
      <button
        type="button"
        class="btn variant-filled-primary"
        title={disablebutton ? "No Organizations available" : ""}
        disabled={disablebutton}>Add Organization</button
      >
    </div>
    <Table.RowsPerPage {handler} />
  </header>
  <table class="table table-hover table-compact w-full table-auto">
    <thead>
      <tr>
        <Table.Head {handler}>Organization</Table.Head>
        <Table.Head {handler}>Allowed Roles</Table.Head>
        <Table.Head {handler}>Edit</Table.Head>
      </tr>
    </thead>
    <tbody>
      {#each $rows as row}
        <tr>
          <td
            ><div class="relative inline-block">
              {#if row[0] == def_org}
                <span
                  class="variant-filled-primary badge absolute -right-10 -top-1 z-10"
                  >def</span
                >
              {/if}{row[0]}
            </div></td
          >
          <td
            >{#each row[1] as tag}
              <span class="chip {tag ? 'variant-filled' : 'variant-soft'}">
                {#if tag == data.orgRoles.find((role) => role.isDefaultRole === true && role.organization === row[0]).role}
                  <span class="text-green-400">●</span>
                {/if}
                <span>{tag}</span>
              </span>&nbsp
            {/each}</td
          >
          <td
            ><div
              use:popup={{
                event: "click",
                target: "updateroles",
                placement: "left",
                closeQuery: "#will-close",
              }}
            >
              <button
                class="btn-icon bg-initial hover:variant-soft-primary"
                on:click={() => {
                  neworg = row[0];
                  $updateroles = row[1];
                  defrole = data.orgRoles.find(
                    (role) =>
                      role.isDefaultRole === true &&
                      role.organization === row[0],
                  ).role;
                }}
              >
                <Pencil />
              </button>
            </div>
          </td>
        </tr>
        <div
          class="card w-modal shadow-xl bg-gradient-to-br variant-gradient-success-warning p-8"
          data-popup="updateroles"
        >
          <div class="alert-message">
            <h3 class="h3">Update Action</h3>
            <label class="label">
              <span>Organization</span>
              <input class="input" value={neworg} disabled />
            </label>
            <label class="label">
              <span>Default Role</span>
              <select bind:value={defrole} class="select">
                <option value={defrole} disabled hidden>{defrole}</option>
                {#each $updateroles as org}
                  <option value={org}><button>{org}</button></option>
                {/each}
              </select>
            </label>
            <label class="label">
              <span>update role</span>
              <div class="textarea h-10 flex items-center">
                <label class="flex items-center space-x-2">
                  &nbsp;&nbsp;
                  {#each roleHierarchy as role}
                    <input
                      class="checkbox"
                      type="checkbox"
                      checked={$updateroles.includes(role)}
                      on:change={(event) => handleupdateRoles(role, event)}
                    />
                    <p>{role}</p>
                    &nbsp;&nbsp;
                  {/each}
                </label>
              </div>
            </label>
            <button
              id="will-close"
              type="button"
              class="variant-filled-error btn"
              on:click={() => {
                updorg(neworg, $updateroles, data.user.id);
              }}>Submit</button
            >
            <button
              id="will-close"
              type="button"
              class="variant-filled-error btn">Cancel</button
            >
          </div>
        </div>
      {/each}
    </tbody>
  </table>
  <footer class="flex justify-between">
    <Table.RowCount {handler} />
    <Table.Pagination {handler} />
  </footer>
</div>

<div
  class="card w-modal shadow-xl bg-gradient-to-br variant-gradient-success-warning p-8"
  data-popup="addorg"
>
  <div class="alert-message">
    <h3 class="h3">Add Action</h3>
    <label class="label">
      <span>Organization</span>
      <select bind:value={neworg} class="select">
        {#each filterOrgs as org}
          <option class="option" value={org}><button>{org}</button></option>
        {/each}
      </select>
    </label>
    <label class="label">
      <span>Select roles</span>
      <div class="textarea h-10 flex items-center">
        <label class="flex items-center space-x-2">
          &nbsp;&nbsp;
          {#each roleHierarchy as role}
            <input
              class="checkbox"
              type="checkbox"
              on:change={(event) => handleCheckboxChange(role, event)}
            />
            <p>{role}</p>
            &nbsp;&nbsp;
          {/each}
        </label>
      </div>
    </label>
    {#if $newroles[1]}
      <label class="label">
        <span>Choose Default Role</span>
        <div class="textarea h-10 flex items-center">
          <label class="flex items-center space-x-2">
            &nbsp;&nbsp;
            {#each $newroles as role}
              <input
                class="radio"
                type="radio"
                name="radio-direct"
                on:change={() => radiobutton(role)}
              />
              <p>{role}</p>
              &nbsp;&nbsp;
            {/each}
          </label>
        </div>
      </label>
    {/if}
    <button
      id="will-close"
      type="button"
      class="variant-filled-error btn"
      on:click={() => {
        addorg(neworg, $newroles, newdefrole, data.user.id);
      }}>Submit</button
    >
    <button id="will-close" type="button" class="variant-filled-error btn"
      >Cancel</button
    >
  </div>
</div>
