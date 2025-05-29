<script lang="ts">
import { PendingValue, type SearchGroups$result, graphql } from '$houdini';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { loaded } from '$lib/graphql/loading';
import { getLoadingState } from '$lib/stores/loading';
import { getToastStore, popup } from '@skeletonlabs/skeleton';
import { DateTime } from '$lib/ui/components';
import * as Table from '$lib/ui/components/table';
import { Logger, sleep } from '@repo/utils';
import { DataHandler, type Row, check } from '@vincjo/datatables/legacy';
import { Trash2 } from 'lucide-svelte';
import type { MouseEventHandler } from 'svelte/elements';
import { DeleteGroup } from '../mutations';

const log = new Logger('groups:search-results:browser');
// Variables
export let groups: SearchGroups$result['groups'];

const toastStore = getToastStore();
const loadingState = getLoadingState();

//Datatable handler initialization
const handler = new DataHandler(groups.filter(loaded), { rowsPerPage: 10 });
$: handler.setRows(groups);
const rows = handler.getRows();

// Functions
/**
 * Delete Group action
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
  const { data, errors: gqlErrors } = await DeleteGroup.mutate({
    id,
  });
  if (gqlErrors) {
    handleMessage(
      {
        message: `Error deleteing Group: "${displayName}", cause: ${gqlErrors[0].message} `,
        hideDismiss: false,
        timeout: 10000,
        type: 'error',
      },
      toastStore,
    );
    return;
  }
  if (data?.delete_groups_by_pk) {
    handleMessage(
      {
        message: `<p class="text-xl">Group: <span class="text-red-500 font-bold">${displayName}</span> deleted</p>`,
        hideDismiss: false,
        timeout: 10000,
        type: 'success',
      },
      toastStore,
    );
  } else {
    handleMessage(
      {
        message: `Group not found for ID: ${id}`,
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
        <Table.Head {handler} orderBy="displayName">Name</Table.Head>
        <Table.Head {handler} orderBy="description">Description</Table.Head>
        <Table.Head {handler} orderBy="tags">Tags</Table.Head>
        <Table.Head {handler} orderBy="updatedAt">Updated</Table.Head>
        <Table.Head {handler}>Delete</Table.Head>
      </tr>
      <tr>
        <Table.HeadFilter {handler} filterBy="displayName" />
        <Table.HeadFilter {handler} filterBy="description" />
        <Table.HeadFilter {handler} filterBy="tags" />
        <Table.HeadFilter {handler} filterBy="updatedAt" />
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
          </tr>
        {:else}
          <tr>
            <td>
              <a
                class="font-semibold"
                href={`/org/groups/${row.id}`}
                title={row.description}
                >{row.displayName}
              </a>
            </td>
            <td>{row.description}</td>
            <td>
              { #if row.tags === null}
                N/A
                {:else}
                  {#each row.tags as tag }
                      <span class="chip {tag? 'variant-filled' : 'variant-soft'}">
                      <span>{tag}</span>
                      </span>&nbsp
                    {/each}
              {/if}</td>
            <td><DateTime distance time={row.updatedAt} /></td>
            <td>
              <div
                use:popup={{
                  event: "click",
                  target: "delete" + row.displayName,
                  placement: "left",
                }}
                >
            <button
              class="btn hover:variant-soft-primary"
              >
                <Trash2 />
              </button>
              </div>
            </td>
          </tr>
          <div
        class="card variant-filled-primary p-4"
        data-popup="delete{row.displayName}"
      >
        <div class="alert-message">
          <h3 class="h3">Alert</h3>
          <p class="text-xl">
            Are you sure you want to delete group <span class="text-red-500"
              >{row.displayName}</span
            >?
          </p>
        </div>
        <button
          type="button"
          class="variant-filled-error btn"
          data-id={row.id}
                data-display-name={row.displayName}
                on:click|stopPropagation|capture={handleDelete}
                disabled={isDeleting}>Delete</button
        >
        <button type="button" class="variant-filled-error btn">Cancel</button>
      </div>
        {/if}
      {/each}
    </tbody>
  </table>
  <footer class="flex justify-between">
    <Table.RowCount {handler} />
    <Table.Pagination {handler} />
  </footer>
</div>
