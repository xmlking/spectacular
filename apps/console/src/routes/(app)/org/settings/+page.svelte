<script lang="ts">
import MaybeError from '$lib/components/layout/maybe-error.svelte';
import { Logger } from '@spectacular/utils';
import type { PageData } from './$houdini';
import SettingsMetadata from './components/settings-metadata.svelte';
import SettingsWithDefaults from './components/settings-with-defaults.svelte';
import Settings from './components/settings.svelte';

const log = new Logger('settings:browser');
  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

// Reactivity
// let { OrgSettingsData } = $state(data);
let { OrgSettingsData } = $derived(data);
</script>

<svelte:head>
  <title>Datablocks | Settings</title>
  <meta name="description" content="Org Settings" />
</svelte:head>

<div class="page-container">
  <section class="space-y-4">
    <h1 class="h1">Org Settings</h1>
    <p>Here you can change <strong>org</strong> settings</p>
  </section>

  <MaybeError
    entityName="Settings"
    result={$OrgSettingsData}

  >
    {#snippet children({ data })}
        <section class="space-y-4">
        <SettingsMetadata {data} />
      </section>
          {/snippet}
    </MaybeError>
  <MaybeError
    entityName="Settings"
    result={$OrgSettingsData}

  >
    {#snippet children({ data: { organizations_by_pk } })}
        {#if organizations_by_pk}
        <section class="space-y-4">
          <Settings organization={organizations_by_pk} />
        </section>
        <section class="space-y-4">
          <SettingsWithDefaults organization={organizations_by_pk} />
        </section>
      {/if}
          {/snippet}
    </MaybeError>
</div>
