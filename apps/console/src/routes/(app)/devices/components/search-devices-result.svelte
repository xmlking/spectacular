<script lang="ts">
import { PendingValue, type SearchDevices$result } from '$houdini';
import { loaded } from '$lib/graphql/loading';
import { getLoadingState } from '$lib/stores/loading';
import { DateTime } from '@spectacular/skeleton/components';
import * as Table from '@spectacular/skeleton/components/table';
import { Logger } from '@spectacular/utils';
import { DataHandler, check } from '@vincjo/datatables';

const log = new Logger('devices:search-results:browser');

// Variables
export let data: SearchDevices$result;
let { devices } = data;
$: ({ devices } = data);

const loadingState = getLoadingState();

//Datatable handler initialization
const handler = new DataHandler(devices.filter(loaded), { rowsPerPage: 10 });
$: handler.setRows(devices);
const rows = handler.getRows();

// Reactivity
$: loadingState.setFormLoading(false);
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
          <Table.Head {handler} orderBy="displayName">Device Name</Table.Head>
          <Table.Head {handler} orderBy="ip">IP Address</Table.Head>
          <Table.Head {handler} orderBy="description">Description</Table.Head>
          <Table.Head {handler} orderBy="updatedAt">Updated</Table.Head>
          <Table.Head {handler} orderBy="proxy_ip">Proxy IP</Table.Head>
          <Table.Head {handler} orderBy="alternate_dns">Alternate DNS</Table.Head>
          <Table.Head {handler} orderBy="public_ip">Public IP</Table.Head>
        </tr>
        <tr>
          <Table.HeadFilter {handler} filterBy="displayName" />
          <Table.HeadFilter {handler} filterBy="ip" />
          <Table.HeadFilter {handler} filterBy="description" />
          <Table.HeadFilter {handler} filterBy="updatedAt" />
          <Table.HeadFilter {handler} filterBy="proxy_ip" comparator={check.isLike} />
          <Table.HeadFilter {handler} filterBy="alternate_dns" comparator={check.isLike} />
          <Table.HeadFilter {handler} filterBy="public_ip" />
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
              <td><a class="font-semibold" href={`/devices/${row.id}`} title={row.description}>{row.displayName}</a></td>
              <td>{row.ip}</td>
              <td>{row.description}</td>
              <td><DateTime distance time={row.updatedAt} /></td>
              <td>{row.proxy_ip ? 'Yes' : 'No'}</td>
              <td>{row.alternate_dns ? 'Yes' : 'No'}</td>
              <td>{row.public_ip}</td>
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
