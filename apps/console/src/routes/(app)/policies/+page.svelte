<script lang="ts">
import { DebugShell, GraphQLErrors } from '@spectacular/skeleton/components';
import { Logger } from '@spectacular/utils';
import SuperDebug from 'sveltekit-superforms';
import type { PageData } from './$houdini';
import SearchPoliciesForm from './components/search-policies-form.svelte';
import SearchPoliciesResult from './components/search-policies-result.svelte';

const log = new Logger('policies:search:browser');
export let data: PageData;

// Reactivity
let { SearchPolicies } = data;
$: ({ SearchPolicies } = data);
</script>

<svelte:head>
  <title>Policies</title>
  <meta name="description" content="policies" />
</svelte:head>

<div class="page-container">
  <section class="space-y-4">
    <h1 class="h1">Policies</h1>
    <p>Create, update, search, delete policies</p>
  </section>

  <section class="space-y-4">
    <SearchPoliciesForm formData={data.form}/>
  </section>

<section class="space-y-4">
  <DebugShell label="table-data">
    <SuperDebug label="table-data" data={$SearchPolicies} />
  </DebugShell>

  {#if $SearchPolicies.errors}
    <GraphQLErrors errors={$SearchPolicies.errors} />
  {:else if $SearchPolicies.data}
    <SearchPoliciesResult data={$SearchPolicies.data}/>
  {/if}
</section>

</div>
