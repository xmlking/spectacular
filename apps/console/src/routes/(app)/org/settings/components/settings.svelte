<script lang="ts">
import { type OrgSettingsFragment, fragment, graphql } from '$houdini';
import { loaded } from '$lib/graphql/loading';
import { DateTime } from '@spectacular/skeleton/components';
import * as Table from '@spectacular/skeleton/components/table';
import { DataHandler } from '@vincjo/datatables/legacy';
import { User } from 'lucide-svelte';

export let organization: OrgSettingsFragment;
$: data = fragment(
  organization,
  graphql(`
      fragment OrgSettingsFragment on organizations {
        settings(order_by: { key: asc }) {
          key
          value
          updatedAt
        }
      }
    `),
);
$: ({ settings } = $data);

const handler = new DataHandler(settings?.filter(loaded), { rowsPerPage: 10 });
$: handler.setRows(settings);
const rows = handler.getRows();
</script>

<div class="card p-4 space-y-10">
  <div class="flex flex-col gap-4">
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <User class="w-5 h-5" />
        <h1>Settings</h1>
      </div>
      <button class="btn variant-filled-primary"> Add Settings </button>
    </div>
    <p class="text-gray-600">Here you can change or add org settings</p>
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
          <td><DateTime distance time={row.updatedAt} /></td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
