<script lang="ts">
import MaybeError from '$lib/components/layout/maybe-error.svelte';
import * as Smart from '$lib/smart/components';
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
// let { UserSettingsData } = $state(data);
let { UserSettingsData } = $derived(data);
</script>

<svelte:head>
  <title>Datablocks | Settings</title>
  <meta name="description" content="User Settings" />
</svelte:head>

<div class="page-container">
  <section class="space-y-4">
    <h1 class="h1">User Settings</h1>
    <p>Here you can change <strong>user</strong> settings</p>
  </section>

  <MaybeError
    entityName="Settings"
    result={$UserSettingsData}

  >
    {#snippet children({ data })}
        <section class="space-y-4">
        <SettingsMetadata {data} />
      </section>
          {/snippet}
    </MaybeError>
  <MaybeError
    entityName="Settings"
    result={$UserSettingsData}

  >
    {#snippet children({ data: { user } })}
        {#if user}
        <section class="space-y-4">
          <Settings user={user} />
        </section>
        <section class="space-y-4">
          <SettingsWithDefaults user={user} />
        </section>
      {/if}
          {/snippet}
    </MaybeError>

  <div class="page-section">
    <h3 class="h2">AI Settings</h3>
    <p>Update AI model settings</p>
    <Smart.Settings />
  </div>
</div>
