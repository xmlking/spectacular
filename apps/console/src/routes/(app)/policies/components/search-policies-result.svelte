<script lang="ts">
import {
  type DeletePolicy$result,
  type DeleteRule$result,
  PendingValue,
  type SearchPolicies$result,
  cache,
  graphql,
} from '$houdini';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { loaded } from '$lib/graphql/loading';
import { getLoadingState } from '$lib/stores/loading';
import { getToastStore } from '@skeletonlabs/skeleton';
import { DateTime } from '@spectacular/skeleton/components';
import * as Table from '@spectacular/skeleton/components/table';
import { Logger } from '@spectacular/utils';
import { DataHandler, type Row, check } from '@vincjo/datatables/legacy';
import { Trash2 } from 'lucide-svelte';
import type { MouseEventHandler } from 'svelte/elements';
import { message } from 'sveltekit-superforms';

const log = new Logger('policies:search-results:browser');
// Variables
export let data: SearchPolicies$result;
let { policies } = data;
$: ({ policies } = data);

const toastStore = getToastStore();
const loadingState = getLoadingState();

//Datatable handler initialization
const handler = new DataHandler(policies.filter(loaded), { rowsPerPage: 10 });
$: handler.setRows(policies);
const rows = handler.getRows();

// Functions
/**
 * Delete Polcy action
 */
let isDeleting = false;
const deleteRule = graphql(`
    mutation DeleteRule($id: uuid!) {
      delete_rules_by_pk(id: $id) {
        ...Search_Rules_remove
      }
    }
  `);
const deletePolicy = graphql(`
    mutation DeletePolicy($id: uuid!) {
      delete_policies_by_pk(id: $id) {
        ...Search_Policies_remove
      }
    }
  `);
const handleDelete: MouseEventHandler<HTMLButtonElement> = async (event) => {
  const { id, ruleId, ruleShared, displayName } = event.currentTarget.dataset;
  if (!id || !ruleId || !displayName) {
    log.error('Misconfiguration: did you mess adding `data-id/data-rule-id/data-display-name` attributes?');
    return;
  }
  // before
  isDeleting = true;
  let deletedId: string | undefined;
  let message: string | undefined;
  let error: string | undefined;
  // Delete role if not shared, this will cascade delete the policy as well.
  if (ruleShared === 'false') {
    const { data, errors: gqlErrors } = await deleteRule.mutate({
      id: ruleId,
    });
    // Manuvally delete the policy from cache as policy is deleted via cascade when parent `rule` is deleted
    const policy = cache.get('policies', { id });
    policy.delete();

    if (gqlErrors) {
      error = `Error deleteing policy: "${displayName}", cause: ${gqlErrors[0].message} `;
    } else {
      message = `Policy and associated rule: "${displayName}" deleted`;
      deletedId = data?.delete_rules_by_pk?.id;
    }
  } else {
    const { data, errors: gqlErrors } = await deletePolicy.mutate({
      id,
    });

    if (gqlErrors) {
      error = `Error deleteing policy: "${displayName}", cause: ${gqlErrors[0].message} `;
    } else {
      message = `Policy "${displayName}" deleted`;
      deletedId = data?.delete_policies_by_pk?.id;
    }
  }

  if (error) {
    handleMessage(
      {
        message: error,
        hideDismiss: false,
        timeout: 10000,
        type: 'error',
      },
      toastStore,
    );
    return;
  }

  if (deletedId && message) {
    handleMessage(
      {
        message,
        hideDismiss: false,
        timeout: 10000,
        type: 'success',
      },
      toastStore,
    );
  } else {
    handleMessage(
      {
        message: `Policy not found for ID: ${id}`,
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
          <Table.Head {handler} orderBy={(row) => row.rule.displayName}
            >Rule Name</Table.Head
          >
          <Table.Head {handler} orderBy="subjectDisplayName">Subject</Table.Head
          >
          <Table.Head {handler} orderBy="updatedAt">Updated</Table.Head>
          <Table.Head {handler} orderBy={(row) => row.rule.sourcePort}
            >Source</Table.Head
          >
          <Table.Head {handler} orderBy={(row) => row.rule.destinationPort}
            >Destination</Table.Head
          >
          <Table.Head {handler} orderBy="active">Active</Table.Head>
          <Table.Head {handler} orderBy={(row) => row.rule.shared}
            >Shared</Table.Head
          >
          <Table.Head {handler}>Delete</Table.Head>
        </tr>
        <tr>
          <Table.HeadFilter
            {handler}
            filterBy={(row) => row.rule.displayName}
          />
          <Table.HeadFilter {handler} filterBy="subjectDisplayName" />
          <Table.HeadFilter {handler} filterBy="updatedAt" />
          <Table.HeadFilter {handler} filterBy={(row) => row.rule.sourcePort} />
          <Table.HeadFilter
            {handler}
            filterBy={(row) => row.rule.destinationPort}
          />
          <Table.HeadFilter
            {handler}
            filterBy="active"
            comparator={check.isLike}
          />
          <Table.HeadFilter
            {handler}
            filterBy={(row) => row.rule.shared}
            comparator={check.isLike}
          />
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
            </tr>
          {:else}
            <tr>
              <td
                ><a
                  class="font-semibold"
                  href={`/policies/${row.id}`}
                  title={row.rule.description}>{row.rule.displayName}</a
                ></td
              >
              <td>{row.subjectDisplayName}</td>
              <td><DateTime distance time={row.updatedAt} /></td>
              <td>{row.rule.sourcePort}</td>
              <td>{row.rule.destinationPort}</td>
              <td>{row.active}</td>
              <td>{row.rule.shared}</td>
              <td>
                <button
                  type="button"
                  class="btn-icon btn-icon-sm variant-filled-error"
                  data-id={row.id}
                  data-rule-id={row.rule.id}
                  data-rule-shared={row.rule.shared}
                  data-display-name={row.rule.displayName}
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
