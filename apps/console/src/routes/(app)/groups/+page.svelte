<script lang="ts">
import { DebugShell, GraphQLErrors } from '@spectacular/skeleton/components';
import { Logger } from '@spectacular/utils';
import SuperDebug from 'sveltekit-superforms';
import type { PageData } from './$houdini';
import SearchGroupsForm from './components/search-groups-form.svelte';
import SearchGroupsResult from './components/search-groups-result.svelte';

const log = new Logger('groups:search:browser');
export let data: PageData;

// Reactivity
let { SearchGroups } = data;
$: ({ SearchGroups } = data);
</script>

<svelte:head>
  <title>Datablocks | Groups</title>
  <meta name="description" content="Groups list" />
</svelte:head>

<div class="page-container">
  <section class="space-y-4">
    <h1 class="h1">Groups</h1>
    <p>Search, create, update, delete Groups</p>
  </section>

  <section class="space-y-4">
    <SearchGroupsForm formInitData={data.form}/>
  </section>

<section class="space-y-4">
  <DebugShell label="table-data">
    <SuperDebug label="table-data" data={$SearchGroups} />
  </DebugShell>

  {#if $SearchGroups.errors}
    <GraphQLErrors errors={$SearchGroups.errors} />
  {:else if $SearchGroups.data}
    <SearchGroupsResult data={$SearchGroups.data}/>
  {/if}
</section>

</div>
