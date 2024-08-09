<script lang="ts">
import { PendingValue, type SearchRules$result, graphql } from '$houdini';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { loaded } from '$lib/graphql/loading';
import { getLoadingState } from '$lib/stores/loading';
import { getToastStore } from '@skeletonlabs/skeleton';
import { DateTime } from '@spectacular/skeleton/components';
import * as Table from '@spectacular/skeleton/components/table';
import { Logger, sleep } from '@spectacular/utils';
import { DataHandler, type Row, check } from '@vincjo/datatables';
import { Trash2 } from 'lucide-svelte';
import type { MouseEventHandler } from 'svelte/elements';

const log = new Logger('rules:search-results:browser');
// Variables
export let data: SearchRules$result;
let { rules } = data;
$: ({ rules } = data);

const toastStore = getToastStore();
const loadingState = getLoadingState();

//Datatable handler initialization
const handler = new DataHandler(rules.filter(loaded), { rowsPerPage: 10 });
$: handler.setRows(rules);
const rows = handler.getRows();

// Functions
/**
 * Delete Rule action
 */
let isDeleting = false;
const deleteRule = graphql(`
    mutation DeleteRule(
      $ruleId: uuid!
      $deletedAt: timestamptz!
    ) {
      update_rules_by_pk(
        pk_columns: { id: $ruleId }
        _set: { deletedAt: $deletedAt }
      ) {
        id
        ...Search_Rules_remove
      }
    }
  `);
const handleDelete: MouseEventHandler<HTMLButtonElement> = async (event) => {
  const { ruleId, displayName } = event.currentTarget.dataset;
  if (!ruleId || !displayName) {
    log.error('Misconfiguration: did you mess adding `data-id/data-display-name` attributes?');
    return;
  }
  // before
  isDeleting = true;
  await sleep(1300);
  const deletedAt = new Date();
  const { data, errors: gqlErrors } = await deleteRule.mutate({
    ruleId,
    deletedAt,
  });
  if (gqlErrors) {
    handleMessage(
      {
        message: `Error deleting rule: "${displayName}", cause: ${gqlErrors[0].message} `,
        hideDismiss: false,
        timeout: 10000,
        type: 'error',
      },
      toastStore,
    );
    return;
  }
  if (data?.update_rules_by_pk) {
    handleMessage(
      {
        message: `Rule "${displayName}" deleted`,
        hideDismiss: false,
        timeout: 10000,
        type: 'success',
      },
      toastStore,
    );
  } else {
    handleMessage(
      {
        message: `Rule not found for ID: ${ruleId}`,
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

<div class="card p-4">
  <div class="page-container p-0">
    <header class="flex justify-between">
      <Table.Search {handler} />
      <Table.RowsPerPage {handler} />
    </header>
    <table class="table table-hover table-compact w-full table-auto">
      <thead>
        <tr>
          <Table.Head {handler} orderBy="displayName">Rule Name</Table.Head>
          <Table.Head {handler} orderBy="description">Description</Table.Head>
          <Table.Head {handler} orderBy="updatedAt">Updated</Table.Head>
          <Table.Head {handler} orderBy="source">Source</Table.Head>
          <Table.Head {handler} orderBy="destination">Destination</Table.Head>
          <Table.Head {handler} orderBy="action">Action</Table.Head>
          <Table.Head {handler} orderBy="shared">Shared</Table.Head>
          <Table.Head {handler}>Delete</Table.Head>
        </tr>
        <tr>
          <Table.HeadFilter {handler} filterBy="displayName" />
          <Table.HeadFilter {handler} filterBy="description" />
          <Table.HeadFilter {handler} filterBy="updatedAt" />
          <Table.HeadFilter {handler} filterBy="source" />
          <Table.HeadFilter {handler} filterBy="destination" />
          <Table.HeadFilter {handler} filterBy="action" comparator={check.isLike} />
          <Table.HeadFilter {handler} filterBy="shared" comparator={check.isLike} />
          <th></th>
        </tr>
      </thead>
      <tbody>
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
              <td><a class="font-semibold" href={`/rules/${row.id}`} title={row.description}>{row.displayName}</a></td>
              <td>{row.description}</td>
              <td><DateTime distance time={row.updatedAt} /></td>
              <td>{row.source}</td>
              <td>{row.destination}</td>
              <td>{row.action}</td>
              <td>{row.shared}</td>
              <td>
                <button
                  type="button"
                  class="btn-icon btn-icon-sm variant-filled-error"
                  data-rule-id={row.id}
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
</div>
