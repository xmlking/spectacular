<script lang="ts">
import { PendingValue, type SearchUsersAll$result, graphql } from '$houdini';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { loaded } from '$lib/graphql/loading';
import { getLoadingState } from '$lib/stores/loading';
import { Avatar, getToastStore } from '@skeletonlabs/skeleton';
import { DateTime } from '@spectacular/skeleton/components';
import * as Table from '@spectacular/skeleton/components/table';
import { Logger, sleep } from '@spectacular/utils';
import { DataHandler, type Row, check } from '@vincjo/datatables/legacy';
import { BadgeCheck, BadgeMinus, Trash2 } from 'lucide-svelte';
import type { MouseEventHandler } from 'svelte/elements';
import { DeleteUser } from '../mutations';

const log = new Logger('users:search-results:browser');
// Variables
export let users: SearchUsersAll$result['users'];

const toastStore = getToastStore();
const loadingState = getLoadingState();

//Datatable handler initialization
const handler = new DataHandler(users.filter(loaded), { rowsPerPage: 10 });
$: handler.setRows(users);
const rows = handler.getRows();

// Functions
/**
 * Delete User action
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
  const { data, errors: gqlErrors } = await DeleteUser.mutate({
    id,
  });
  if (gqlErrors) {
    handleMessage(
      {
        message: `Error deleteing User: "${displayName}", cause: ${gqlErrors[0].message} `,
        hideDismiss: false,
        timeout: 10000,
        type: 'error',
      },
      toastStore,
    );
    return;
  }
  if (data?.deleteUser) {
    handleMessage(
      {
        message: `<p class="text-xl">User: <span class="text-red-500 font-bold">${displayName}</span> deleted</p>`,
        hideDismiss: false,
        timeout: 10000,
        type: 'success',
      },
      toastStore,
    );
  } else {
    handleMessage(
      {
        message: `User not found for ID: ${id}`,
        hideDismiss: false,
        timeout: 50000,
        type: 'error',
      },
      toastStore,
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
        <Table.Head {handler} orderBy="avatarUrl">Avatar</Table.Head>
        <Table.Head {handler} orderBy="displayName">Name</Table.Head>
        <Table.Head {handler} orderBy="currentOrg">Organization</Table.Head>
        <Table.Head {handler} orderBy="defaultRole">Role</Table.Head>
        <Table.Head {handler} orderBy="email">Email</Table.Head>
        <Table.Head {handler} orderBy="emailVerified">Verified</Table.Head>
        <Table.Head {handler} orderBy="lastSeen">Last Seen</Table.Head>
        <Table.Head {handler}>Disable</Table.Head>
      </tr>
      <tr>
        <th></th>
        <Table.HeadFilter {handler} filterBy="displayName" />
        <Table.HeadFilter {handler} filterBy="currentOrg" />
        <Table.HeadFilter {handler} filterBy="defaultRole" />
        <Table.HeadFilter {handler} filterB="email" />
        <th></th>
        <th></th>
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
          </tr>
        {:else}
          <tr>
            <td><Avatar src={row.avatarUrl} width="w-10" rounded="rounded-full" /></td>
            <td>
              <a
                class="font-semibold"
                href={`/admin/users/${row.id}`}
                title={row.displayName}
                >{row.displayName}
              </a>
            </td>
            <td>{@html row.currentOrg?.displayName ?? 'N/A'}</td>
            <td>{row.defaultRole}</td>
            <td>{@html row.email}</td>
            <td>
              {#if row.emailVerified}
                  <BadgeCheck fill="green" />
              {:else}
                 <BadgeMinus />
              {/if}
            </td>
            <td><DateTime distance time={row.lastSeen} /></td>
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
