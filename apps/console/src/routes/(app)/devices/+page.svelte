<script lang="ts">
import { DebugShell, GraphQLErrors } from '@spectacular/skeleton/components';
import { Logger } from '@spectacular/utils';
import SuperDebug from 'sveltekit-superforms';
import type { PageData } from './$houdini';
import SearchDevicesForm from './components/search-devices-form.svelte';
import SearchDevicesResult from './components/search-devices-result.svelte';

const log = new Logger('devices:search:browser');
export let data: PageData;

$: ({ SearchDevicesPage, form } = data);
</script>

<svelte:head>
  <title>Devices</title>
  <meta name="description" content="devices" />
</svelte:head>

<div class="page-container">
  <section class="space-y-4">
    <h1 class="h1">Devices</h1>
    <p>Search devices</p>
  </section>

  <section class="space-y-4">
    <SearchDevicesForm {form}/>
  </section>

  <section class="space-y-4">
    <DebugShell label="table-data">
      <SuperDebug label="table-data" data={$SearchDevicesPage} />
    </DebugShell>

    {#if $SearchDevicesPage.errors}
      <GraphQLErrors errors={$SearchDevicesPage.errors} />
    {:else if $SearchDevicesPage.data}
      <SearchDevicesResult data={$SearchDevicesPage.data}/>
    {/if}
  </section>
</div>
