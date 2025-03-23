<script lang="ts">
  import { run } from 'svelte/legacy';

import { type UserSettingsWithDefaultsFragment, fragment, graphql } from '$houdini';
import { loaded } from '$lib/graphql/loading';
import { DateTime } from '$lib/ui/components';
import * as Table from '$lib/ui/components/table';
import { DataHandler } from '@vincjo/datatables/legacy';
import { Settings } from 'lucide-svelte';

  interface Props {
    user: UserSettingsWithDefaultsFragment;
  }

  let { user }: Props = $props();
let data = $derived(fragment(
  user,
  graphql(`
      fragment UserSettingsWithDefaultsFragment on users {
        settingsWithDefaults(order_by: { key: asc }) {
          key
          value
          updatedAt
        }
      }
    `),
));
let { settingsWithDefaults } = $derived($data);

const handler = new DataHandler(settingsWithDefaults?.filter(loaded), { rowsPerPage: 10 });
run(() => {
    handler.setRows(settingsWithDefaults);
  });
const rows = handler.getRows();
</script>

<div class="card p-4 space-y-10">
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
