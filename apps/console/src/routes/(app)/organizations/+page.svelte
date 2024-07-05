<script lang="ts">
import { invalidateAll } from '$app/navigation';
import { DeleteOrgStore } from '$houdini';
import { default as ChipButton } from '$lib/components/chip-button.svelte';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { isAuthenticated, user } from '$lib/stores/user';
import { getToastStore, popup } from '@skeletonlabs/skeleton';
import * as Table from '@spectacular/skeleton/components/table';
import { DataHandler } from '@vincjo/datatables';
import { formatDistance } from 'date-fns';
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
        <Table.Head {handler} orderBy="allowedEmails">Allowed_Emails</Table.Head>
        <Table.Head {handler} orderBy="allowedEmailDomains">Allowed_Email_Domains</Table.Head>
        <Table.Head {handler} orderBy="organization">Action</Table.Head>
      </tr>
    </thead>
    <tbody>
      {#each $rows as row}
        <tr>
          <td
            ><div class="relative inline-block">
              <a href="./organizations/{row.organization}"
                >{row.organization}</a
              >
            </div></td
          >
          <td>{row.description}</td>
          <td><ChipButton tags={row.allowedEmails} /></td>
          <td><ChipButton tags={row.allowedEmailDomains} /></td>
          <td
            >
            <div class="flex items-center space-x-1">
            <button class="btn hover:variant-soft-primary"><a href="/organizations/update?organization={row.organization}"><svg
							xmlns="http://www.w3.org/2000/svg"
							class={`${$$props.class ?? 'h-6 w-6'} `}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
							/>
						</svg></a></button>
            <div
              use:popup={{
                event: "click",
                target: "delete" + row.organization,
                placement: "left",
              }}
            >
              <button
                class="btn hover:variant-soft-primary"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-trash-2"
                  ><path d="M3 6h18" /><path
                    d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"
                  /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line
                    x1="10"
                    x2="10"
                    y1="11"
                    y2="17"
                  /><line x1="14" x2="14" y1="11" y2="17" /></svg
                ></button
              >
            </div>
          </div>
          </td
          >
        </tr>
        <div
          class="card variant-filled-primary p-4"
          data-popup="delete{row.organization}"
        >
          <div class="alert-message">
            <h3 class="h3">Alert</h3>
            <p class="text-xl">
              Are you sure you want to delete organization <span class="text-red-500"
                >{row.organization}</span
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
