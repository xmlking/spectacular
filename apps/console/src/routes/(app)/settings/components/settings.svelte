<script lang="ts">
  import { PendingValue, type OrgSettings$result, graphql } from "$houdini";
  import { loaded } from "$lib/graphql/loading";
  import * as Table from "@spectacular/skeleton/components/table";
  import { DataHandler, type Row, check } from "@vincjo/datatables/legacy";
  import { User, Plus } from "lucide-svelte";
  // Variables
  export let data: OrgSettings$result;
  let { organizations_by_pk } = data;
  $: ({ organizations_by_pk } = data);

  //Datatable handler initialization
  console.log(organizations_by_pk);
  const handler = new DataHandler(
    organizations_by_pk?.settings?.filter(loaded) || [],
    {
      rowsPerPage: 10,
    },
  );
  $: if (organizations_by_pk && organizations_by_pk.settings) {
    handler.setRows(organizations_by_pk.settings);
  }
  const rows = handler.getRows();
</script>

<div class="card p-4">
  <div class="page-container p-0">
    <div class="flex flex-col gap-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <User class="w-5 h-5" />
          <h1>Org Settings</h1>
        </div>
        <button class="btn variant-filled-primary"> Add Settings </button>
      </div>
      <p class="text-gray-600">Here you can change or add org settings</p>
    </div>
    <table class="table table-hover table-compact w-full table-auto">
      <thead>
        <tr>
          <Table.Head {handler} orderBy="key">Key</Table.Head>
          <Table.Head {handler} orderBy="value">Default Value</Table.Head>
        </tr>
      </thead>
      <tbody>
        {#each $rows as row}
          <tr>
            <td>{row.key}</td>
            <td
              >{#if typeof row.value === "object"}
                {JSON.stringify(row.value)}
              {:else}
                {row.value}
              {/if}</td
            >
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
