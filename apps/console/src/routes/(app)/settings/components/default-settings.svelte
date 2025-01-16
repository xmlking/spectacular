<script lang="ts">
  import { type OrgSettings$result } from "$houdini";
  import { loaded } from "$lib/graphql/loading";
  import * as Table from "@spectacular/skeleton/components/table";
  import { DataHandler, type Row, check } from "@vincjo/datatables/legacy";
  import { Settings } from "lucide-svelte";
  // Variables
  export let data: OrgSettings$result;
  let { organizations_by_pk, setting_keys } = data;
  $: ({ organizations_by_pk, setting_keys } = data);

  //Datatable handler initialization
  const handler = new DataHandler(
    organizations_by_pk?.settingsWithDefaults?.filter(loaded) || [],
    {
      rowsPerPage: 10,
    },
  );

  // Function to get default value for a given key
  function getDefaultValue(key) {
    const setting = setting_keys.find((item) => item.key === key);
    return setting ? setting.default_value : null;
  }

  // Ensure all settings have default values and add missing settings
  function ensureDefaultValues(settings) {
    const settingKeys = setting_keys || [];
    const settingsMap = new Map(
      settings.map((setting) => [setting.key, setting]),
    );

    settingKeys.forEach((settingKey) => {
      if (!settingsMap.has(settingKey.key)) {
        settingsMap.set(settingKey.key, {
          key: settingKey.key,
          value: getDefaultValue(settingKey.key),
        });
      }
    });

    return Array.from(settingsMap.values()).map((setting) => {
      return setting;
    });
  }

  // Ensure default values for settingsWithDefaults
  $: {
    const orgSettings = organizations_by_pk;
    if (orgSettings) {
      orgSettings.settingsWithDefaults = ensureDefaultValues(
        orgSettings.settingsWithDefaults,
      );
      handler.setRows(orgSettings.settingsWithDefaults);
    }
  }
  const rows = handler.getRows();
</script>

<div class="card p-4">
  <div class="page-container p-0">
    <div class="flex items-center gap-2">
      <Settings class="w-5 h-5" />
      <h1>Combined Settings Overview</h1>
    </div>
    <table class="table table-hover table-compact w-full table-auto">
      <thead>
        <tr>
          <Table.Head {handler} orderBy="key">Key</Table.Head>
          <Table.Head {handler} orderBy="value">Default Value</Table.Head>
        </tr>
      </thead>
      <tbody>
        <!-- {#each $rows as row, i (row.id)} -->
        {#each $rows as setting (setting.key)}
          {#key setting.key}
            <tr>
              <td>{setting.key}</td>
              <td
                >{#if typeof setting.value === "object"}
                  {JSON.stringify(setting.value)}
                {:else}
                  {setting.value}
                {/if}</td
              >
            </tr>
          {/key}
        {/each}
      </tbody>
    </table>
  </div>
</div>
