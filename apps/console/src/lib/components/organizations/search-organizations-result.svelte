<script lang="ts">
import { Logger, sleep } from '@repo/utils';
import { getToastStore } from '@skeletonlabs/skeleton';
import { check, DataHandler, type Row } from '@vincjo/datatables/legacy';
import { Trash2 } from 'lucide-svelte';
import type { MouseEventHandler } from 'svelte/elements';
import { graphql, PendingValue, type SearchOrganizations$result } from '$houdini';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { loaded } from '$lib/graphql/loading';
import { getLoadingState } from '$lib/stores/loading';
import { DateTime } from '$lib/ui/components';
import * as Table from '$lib/ui/components/table';
import { DeleteOrganization } from './mutations';

const log = new Logger('org:search:results:component');
// Variables
export let organizations: SearchOrganizations$result['organizations'];

const toastStore = getToastStore();
const loadingState = getLoadingState();

//Datatable handler initialization
const handler = new DataHandler(organizations.filter(loaded), { rowsPerPage: 10 });
$: handler.setRows(organizations);
const rows = handler.getRows();

// Functions
/**
 * Delete Organization action
 */
let isDeleting = false;

const handleDelete: MouseEventHandler<HTMLButtonElement> = async (event) => {
  const { id, displayName } = event.currentTarget.dataset;
  if (!id || !displayName) {
    log.error('Misconfiguration: did you mess adding `data-id/data-display-name` attributes?');
    return;
  }
  // before
  isDeleting = true;
  const { data, errors: gqlErrors } = await DeleteOrganization.mutate({
    id,
  });
  if (gqlErrors) {
    handleMessage(
      {
        message: `Error deleteing Organization: "${displayName}", cause: ${gqlErrors[0].message} `,
        hideDismiss: false,
        timeout: 10000,
        type: 'error',
      },
      toastStore
    );
    return;
  }
  if (data?.delete_organizations_by_pk) {
    handleMessage(
      {
        message: `<p class="text-xl">Organization: <span class="text-red-500 font-bold">${displayName}</span> deleted</p>`,
        hideDismiss: false,
        timeout: 10000,
        type: 'success',
      },
      toastStore
    );
  } else {
    handleMessage(
      {
        message: `Organization not found for ID: ${id}`,
        hideDismiss: false,
        timeout: 50000,
        type: 'error',
      },
      toastStore
    );
  }
  // after
  isDeleting = false;
};

// Reactivity
$: loadingState.setFormLoading(isDeleting);
</script>

<div class="card p-4 space-y-10">
  <header class="flex justify-between">
    <Table.Search {handler} />
    <Table.RowsPerPage {handler} />
  </header>
  <table class="table table-hover table-compact w-full table-auto">
    <thead>
      <tr>
        <Table.Head {handler} orderBy="displayName">Name</Table.Head>
        <Table.Head {handler} orderBy="ownerId">Owner</Table.Head>
        <Table.Head {handler} orderBy="updatedAt">Updated</Table.Head>
        <Table.Head {handler} orderBy={(row) => row.autoEnroll}>Auto Enroll</Table.Head>
        <Table.Head {handler} orderBy="allowedEmailDomains">Allowed Email Domains</Table.Head>
        <Table.Head {handler} orderBy="allowedEmails">Allowed Emails</Table.Head>
        <Table.Head {handler} orderBy="blockedEmailDomains">Blocked Email Domains</Table.Head>
        <Table.Head {handler} orderBy="blockedEmails">Blocked Emails</Table.Head>
        <Table.Head {handler}>Delete</Table.Head>
      </tr>
      <tr>
        <Table.HeadFilter {handler} filterBy="displayName" />
        <Table.HeadFilter {handler} filterBy="ownerId" />
        <Table.HeadFilter {handler} filterBy="updatedAt" />
        <Table.HeadFilter {handler} filterBy={(row) => row.autoEnroll} comparator={check.isLike} />
        <Table.HeadFilter {handler} filterB="allowedEmailDomains" />
        <Table.HeadFilter {handler} filterBy="allowedEmails" />
        <Table.HeadFilter {handler} filterBy="blockedEmailDomains" />
        <Table.HeadFilter {handler} filterBy="blockedEmails" />
        <th></th>
      </tr>
    </thead>
    <tbody>
      <!-- {#each $rows as row, i (row.id)} -->
      {#each $rows as row}
        {#if row.id === PendingValue}
          <tr class="animate-pulse">
            <td><div class="placeholder" /></td>
            <td><div class="placeholder" /></td>
            <td><div class="placeholder" /></td>
            <td><div class="placeholder" /></td>
            <td><div class="placeholder" /></td>
            <td><div class="placeholder" /></td>
            <td><div class="placeholder" /></td>
            <td><div class="placeholder" /></td>
            <td><div class="placeholder" /></td>
          </tr>
        {:else}
          <tr>
            <td>
              <a
                class="font-semibold"
                href={`/admin/organizations/${row.id}`}
                title={row.description}
                >{row.displayName}
              </a>
            </td>
            <td>{@html row.ownerId}</td>
            <td><DateTime distance time={row.updatedAt} /></td>
            <td>{row.autoEnroll}</td>
            <td>{@html row.allowedEmailDomains}</td>
            <td>{@html row.allowedEmails}</td>
            <td>{@html row.blockedEmailDomains}</td>
            <td>{@html row.blockedEmails}</td>
            <td>
              <button
                type="button"
                class="btn-icon btn-icon-sm variant-filled-error"
                data-id={row.id}
                data-display-name={row.displayName}
                on:click|stopPropagation|capture={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 />
              </button>
            </td>
          </tr>
        {/if}
      {/each}
    </tbody>
  </table>
  <footer class="flex justify-between">
    <Table.RowCount {handler} />
    <Table.Pagination {handler} />
  </footer>
</div>
