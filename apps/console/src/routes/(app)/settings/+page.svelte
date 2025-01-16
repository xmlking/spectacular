<script lang="ts">
  import type { PageData } from "./$houdini";
  import SettingKeys from "./components/setting-keys.svelte";
  import Settings from "./components/settings.svelte";
  import MaybeError from "$lib/components/layout/maybe-error.svelte";
  import DefaultSettings from "./components/default-settings.svelte";

  export let data: PageData;
  // Reactivity
  let { OrgSettings } = data;
  $: ({ OrgSettings } = data);
</script>

<svelte:head>
  <title>Datablocks | Settings</title>
  <meta name="description" content="User Settings" />
</svelte:head>
<div class="page-container">
  <section class="space-y-4">
    <h1 class="h1">Configuration</h1>
    <p>Here you can change org settings</p>
  </section>
  <section class="space-y-4">
    <MaybeError
      debug={true}
      entityName="OrgSettings"
      result={$OrgSettings}
      let:data={$OrgSettings}
    >
      <SettingKeys data={$OrgSettings} />
    </MaybeError>
  </section>
  <MaybeError
    debug={false}
    entityName="OrgSettings"
    result={$OrgSettings}
    let:data={$OrgSettings}
  >
    <Settings data={$OrgSettings} />
  </MaybeError>
  <MaybeError
    debug={false}
    entityName="OrgSettings"
    result={$OrgSettings}
    let:data={$OrgSettings}
  >
    <DefaultSettings data={$OrgSettings} />
  </MaybeError>
</div>
