<script lang="ts">
import { DebugShell, GraphQLErrors } from '@spectacular/skeleton/components';
import { Logger } from '@spectacular/utils';
import SuperDebug from 'sveltekit-superforms';
import type { PageData } from './$houdini';
import SearchRulesForm from './components/search-rules-form.svelte';
import SearchRulesResult from './components/search-rules-result.svelte';

const log = new Logger('rules:search:browser');
export let data: PageData;

// Reactivity
let { SearchRules } = data;
$: ({ SearchRules } = data);
</script>

<svelte:head>
  <title>Rules</title>
  <meta name="description" content="rules" />
</svelte:head>

<div class="page-container">
  <section class="space-y-4">
    <h1 class="h1">Rules</h1>
    <p>Search, create, update, delete rules</p>
  </section>

  <section class="space-y-4">
    <SearchRulesForm formInitData={data.form}/>
  </section>

  <section class="space-y-4">
    <DebugShell label="table-data">
      <SuperDebug label="table-data" data={$SearchRules} />
    </DebugShell>

    {#if $SearchRules.errors}
      <GraphQLErrors errors={$SearchRules.errors} />
    {:else if $SearchRules.data}
      <SearchRulesResult data={$SearchRules.data}/>
    {/if}
  </section>
</div>
