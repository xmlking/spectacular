<script lang="ts">
import { PendingValue, type SettingsData$result, graphql } from '$houdini';
import { loaded } from '$lib/graphql/loading';
import * as Table from '@spectacular/skeleton/components/table';
import { Logger } from '@spectacular/utils';
import { DataHandler, type Row, check } from '@vincjo/datatables/legacy';
import { Settings, User } from 'lucide-svelte';

const log = new Logger('settings:allowed-keys:browser');
// Variables
export let data: SettingsData$result;

let { settings_metadata } = data;
$: ({ settings_metadata } = data);

//Datatable handler initialization
const handler = new DataHandler(settings_metadata.filter(loaded), {
  rowsPerPage: 10,
});
$: handler.setRows(settings_metadata);
const rows = handler.getRows();
</script>

<div class="card p-4">
  <div class="page-container p-0">
    <div class="flex items-center gap-2">
      <Settings class="w-5 h-5" />
      <h1>Settings Metadata</h1>
    </div>
    <table class="table table-hover table-compact w-full table-auto">
      <thead>
        <tr>
          <Table.Head {handler} orderBy={(row) => row.rule.displayName}
            >Key</Table.Head
          >
          <Table.Head {handler} orderBy="description">Description</Table.Head>
          <Table.Head {handler} orderBy="allowed_values"
            >Allowed Values</Table.Head
          >
          <Table.Head {handler} orderBy="default_value"
            >Default Value</Table.Head
          >
        </tr>
      </thead>
      <tbody>
        <!-- {#each $rows as row, i (row.id)} -->
        {#each $rows as row}
          <tr>
            <td>{row.key}</td>
            <td>{row.description}</td>
            <td
              >{#if Array.isArray(row.allowed_values)}
                {row.allowed_values.join(", ")}
              {:else}
                {JSON.stringify(row.allowed_values)}
              {/if}</td
            >
            <td
              >{#if typeof row.default_value === "object"}
                {JSON.stringify(row.default_value)}
              {:else}
                {row.default_value}
              {/if}</td
            >
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
