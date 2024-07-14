<script lang="ts">
import { invalidateAll } from '$app/navigation';
import { DeleteOrgStore } from '$houdini';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { getToastStore, popup } from '@skeletonlabs/skeleton';
import * as Table from '@spectacular/skeleton/components/table';
import { DataHandler } from '@vincjo/datatables';
import { Pencil, Trash2 } from 'lucide-svelte';
import type { PageData } from './$houdini';
export let data: PageData;
$: ({ OrganizationsList } = data);
//Datatable handler initialization
const handler = new DataHandler(OrganizationsList, { rowsPerPage: 10 });
const rows = handler.getRows();
const toastStore = getToastStore();
const deleteOrgStore = new DeleteOrgStore();
async function del(organization: string) {
  const { errors, data } = await deleteOrgStore.mutate({ organization });
  if (errors) {
    console.log(errors.toString());
  }
  if (data?.delete_organizations_by_pk?.organization) {
    handleMessage(
      {
        message: `<p class="text-xl">Organization: <span class="text-red-500 font-bold">${organization}</span> deleted</p>`,
        type: 'success',
      },
      toastStore,
    );
    await invalidateAll();
  }
}
$: handler.setRows(OrganizationsList);
</script>

<div class="page-container">
  <header class="flex justify-between">
    <Table.Search {handler} />
    <button class="variant-ghost-secondary btn right-0" type="submit"
      ><a href="/organizations/create"> Create Organization </a></button
    >
    <Table.RowsPerPage {handler} />
  </header>

  <table class="table table-hover table-compact w-full table-auto">
    <thead>
      <tr>
        <Table.Head {handler} orderBy="organization">Organization</Table.Head>
        <Table.Head {handler} orderBy="description">Description</Table.Head>
        <Table.Head {handler} orderBy="allowedEmails">Allowed_Emails</Table.Head
        >
        <Table.Head {handler} orderBy="allowedEmailDomains"
          >Allowed_Email_Domains</Table.Head
        >
        <Table.Head {handler} orderBy="organization">Action</Table.Head>
      </tr>
    </thead>
    <tbody>
      {#each $rows as row}
        <tr>
          <td
            ><div class="relative inline-block">
              <a href="./organizations/{row.organization}">{row.organization}</a
              >
            </div></td
          >
          <td>{row.description}</td>
          <td>
            {#each row.allowedEmails ?? [] as allowedEmail}
              <span class="badge variant-filled m-1">{allowedEmail}</span>
            {/each}
          </td>
          <td>
            {#each row.allowedEmailDomains ?? [] as allowedDomain}
              <span class="badge variant-filled m-1">{allowedDomain}</span>
            {/each}
          </td>
          <td>
            <div class="flex items-center space-x-1">
              <button class="btn-icon bg-initial hover:variant-soft-primary">
                <a href="/organizations/update?organization={row.organization}"
                  ><Pencil /></a
                >
              </button>
              <div
                use:popup={{
                  event: "click",
                  target: "delete" + row.organization,
                  placement: "left",
                }}
              >
                <button class="btn-icon bg-initial hover:variant-soft-error">
                  <Trash2 />
                </button>
              </div>
            </div>
          </td>
        </tr>
        <div
          class="card variant-filled-primary p-4"
          data-popup="delete{row.organization}"
        >
          <div class="alert-message">
            <h3 class="h3">Alert</h3>
            <p class="text-xl">
              Are you sure you want to delete organization <span
                class="text-red-500">{row.organization}</span
              >?
            </p>
          </div>
          <button
            type="button"
            class="variant-filled-error btn"
            on:click={() => {
              del(row.organization);
            }}>Delete</button
          >
          <button type="button" class="variant-filled-error btn">Cancel</button>
        </div>
      {/each}
    </tbody>
  </table>

  <footer class="flex justify-between">
    <Table.RowCount {handler} />
    <Table.Pagination {handler} />
  </footer>
</div>
