<script lang="ts">
import { PendingValue, type SearchPolicies$result, graphql } from '$houdini';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { loaded } from '$lib/graphql/loading';
import { getToastStore } from '@skeletonlabs/skeleton';
import { DateTime } from '@spectacular/skeleton/components';
import * as Table from '@spectacular/skeleton/components/table';
import { Logger } from '@spectacular/utils';
import { DataHandler, type Row, check } from '@vincjo/datatables';
/* eslint-disable */ // FIXME: remove
import { GraphQLError } from 'graphql';
import { Trash2 } from 'lucide-svelte';

const log = new Logger('policies:search-results:browser');
// Variables
export let data: SearchPolicies$result;
let { policies } = data;
$: ({ policies } = data);

const toastStore = getToastStore();

//Datatable handler initialization
const handler = new DataHandler(policies.filter(loaded), { rowsPerPage: 10 });
$: handler.setRows(policies);
const rows = handler.getRows();

// Functions
/**
 * Delete Polcy action
 */
let isDeleting = false;
const deletePolicy = graphql(`
    mutation DeletePolicy($policyId: uuid!, $ruleId: uuid!, $deletedAt: timestamptz!) {
      update_policies_by_pk(pk_columns: { id: $policyId }, _set: { deletedAt: $deletedAt }) {
        id
        ...Search_Policies_remove
      }
      update_rules(where: { shared: { _eq: false }, id: { _eq: $ruleId } }, _set: { deletedAt: $deletedAt }) {
        affected_rows
        returning {
          id
          displayName
        }
      }
    }
  `);

const handleDelete = async (policyId: string, ruleId: string) => {
  // before
  isDeleting = true;
  try {
    const deletedAt = new Date();
    const { data, errors: gqlErrors } = await deletePolicy.mutate({
      policyId,
      ruleId,
      deletedAt,
    });
    if (gqlErrors) {
      handleMessage(
        {
          message: `Error deleteing policy: ${policyId}, cause: ${gqlErrors[0].message} `,
          hideDismiss: false,
          timeout: 10000,
          type: 'error',
        },
        toastStore,
      );
      return;
    }
    if (data?.update_policies_by_pk && data?.update_rules?.affected_rows) {
      handleMessage(
        {
          message: `Policy and associated rule: ${data?.update_rules?.returning[0].displayName} deleted`,
          hideDismiss: false,
          timeout: 10000,
          type: 'success',
        },
        toastStore,
      );
    } else if (data?.update_policies_by_pk) {
      handleMessage(
        {
          message: `Policy ${data?.update_policies_by_pk.id} deleted`,
          hideDismiss: false,
          timeout: 10000,
          type: 'success',
        },
        toastStore,
      );
    } else {
      handleMessage(
        {
          message: `Policy not found for ID: ${policyId}`,
          hideDismiss: false,
          timeout: 50000,
          type: 'error',
        },
        toastStore,
      );
    }
  } catch (err) {
    // do we need try/catch for houdini???
    if (err instanceof GraphQLError) {
      log.error(err.message);
    } else {
      log.error(err);
      throw err;
    }
  } finally {
    // after
    isDeleting = false;
  }
};
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
          <Table.Head {handler} orderBy={(row) => row.rule.displayName}>Rule Name</Table.Head>
          <Table.Head {handler} orderBy="subjectDisplayName">Subject</Table.Head>
          <Table.Head {handler} orderBy="updatedAt">Updated</Table.Head>
          <Table.Head {handler} orderBy={(row) => row.rule.sourcePort}>Source</Table.Head>
          <Table.Head {handler} orderBy={(row) => row.rule.destinationPort}>Destination</Table.Head>
          <Table.Head {handler} orderBy="active">Active</Table.Head>
          <Table.Head {handler} orderBy={(row) => row.rule.shared}>Shared</Table.Head>
          <Table.Head {handler} >Delete</Table.Head>
        </tr>
        <tr>
          <Table.HeadFilter {handler} filterBy={(row) => row.rule.displayName} />
          <Table.HeadFilter {handler} filterBy="subjectDisplayName" />
          <Table.HeadFilter {handler} filterBy="updatedAt" />
          <Table.HeadFilter {handler} filterBy={(row) => row.rule.sourcePort} />
          <Table.HeadFilter {handler} filterBy={(row) => row.rule.destinationPort} />
          <Table.HeadFilter {handler} filterBy="active" comparator={check.isLike} />
          <Table.HeadFilter {handler} filterBy={(row) => row.rule.shared} comparator={check.isLike}/>
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
            </tr>
          {:else}
            <tr>
              <td>{row.rule.displayName}</td>
              <td>{row.subjectDisplayName}</td>
              <td><DateTime time={row.updatedAt}/></td>
              <td>{row.rule.sourcePort}</td>
              <td>{row.rule.destinationPort}</td>
              <td>{row.active}</td>
              <td>{row.rule.shared}</td>
              <td>
                <button
                type="button"
                class="btn-icon btn-icon-sm variant-filled-error"
                on:click={() => {handleDelete(row.id, row.rule.id) }}
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


