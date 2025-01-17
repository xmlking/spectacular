<script lang="ts">
import type { PageData } from './$houdini';
import MaybeError from '$lib/components/layout/maybe-error.svelte';
import Settings from './components/settings.svelte';
import SettingsWithDefaults from './components/settings-with-defaults.svelte';
import SettingsMetadata from './components/settings-metadata.svelte';
import { Logger } from '@spectacular/utils';

const log = new Logger('settings:browser');
export let data: PageData;

// Reactivity
let { SettingsData } = data;
$: ({ SettingsData } = data);
</script>

<svelte:head>
  <title>Datablocks | Settings</title>
  <meta name="description" content="Org Settings" />
</svelte:head>
<div class="page-container">
  <section class="space-y-4">
    <h1 class="h1">Configuration</h1>
    <p>Here you can change org settings</p>
  </section>

  <MaybeError
    entityName="Settings"
    result={$SettingsData}
    let:data={$SettingsData}
  >
    <section class="space-y-4">
      <SettingsMetadata data={$SettingsData} />
    </section>
  </MaybeError>
  <MaybeError
    entityName="Settings"
    result={$SettingsData}
    let:data={{ organizations_by_pk }}
  >
    {#if organizations_by_pk}
      <section class="space-y-4">
        <Settings organization={organizations_by_pk} />
      </section>
      <section class="space-y-4">
        <SettingsWithDefaults organization={organizations_by_pk} />
      </section>
    {/if}
  </MaybeError>
</div>
