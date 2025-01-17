<script lang="ts">
import { graphql, fragment, type SettingsWithDefaultsFragment } from '$houdini';
import { loaded } from '$lib/graphql/loading';
import * as Table from '@spectacular/skeleton/components/table';
import { DateTime } from '@spectacular/skeleton/components';
import { DataHandler } from '@vincjo/datatables/legacy';
import { Settings } from 'lucide-svelte';

export let organization: SettingsWithDefaultsFragment;
$: data = fragment(
  organization,
  graphql(`
      fragment SettingsWithDefaultsFragment on organizations {
        settingsWithDefaults(order_by: { key: asc }) {
          key
          value
          updatedAt
        }
      }
    `),
);
$: ({ settingsWithDefaults } = $data);

const handler = new DataHandler(settingsWithDefaults?.filter(loaded), { rowsPerPage: 10 });
$: handler.setRows(settingsWithDefaults);
const rows = handler.getRows();
</script>

<div class="card p-4">
  <div class="page-container p-0">
    <div class="flex items-center gap-2">
      <Settings class="w-5 h-5" />
      <h1>Settings with defaults</h1>
    </div>
    <table class="table table-hover table-compact w-full table-auto">
      <thead>
        <tr>
          <Table.Head {handler} orderBy="key">Key</Table.Head>
          <Table.Head {handler} orderBy="value">Value</Table.Head>
          <Table.Head {handler} orderBy="updatedAt">Updated At</Table.Head>
        </tr>
      </thead>
      <tbody>
        <!-- {#each $rows as row, i (row.key)} -->
        {#each $rows as row (row.key)}
          <tr>
            <td>{row.key}</td>
            <td
              >{#if typeof row.value === "object"}
                {JSON.stringify(row.value)}
              {:else}
                {row.value}
              {/if}</td
            >
            <td>
              {#if row.updatedAt}
                 <DateTime distance time={row.updatedAt} />
              {:else}
                 <p>N/A</p>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
