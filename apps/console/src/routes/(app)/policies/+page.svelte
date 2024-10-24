<script lang="ts">
  import { run } from 'svelte/legacy';

import { DebugShell, GraphQLErrors } from '@spectacular/skeleton/components';
import { Logger } from '@spectacular/utils';
import SuperDebug from 'sveltekit-superforms';
import type { PageData } from './$houdini';
import SearchPoliciesForm from './components/search-policies-form.svelte';
import SearchPoliciesResult from './components/search-policies-result.svelte';

const log = new Logger('policies:search:browser');
  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

// Reactivity
let { SearchPolicies } = $state(data);
run(() => {
    ({ SearchPolicies } = data);
  });
</script>

<svelte:head>
  <title>Policies</title>
  <meta name="description" content="policies" />
</svelte:head>

<div class="page-container">
  <section class="space-y-4">
    <h1 class="h1">Policies</h1>
    <p>Search, create, update, delete policies</p>
  </section>

  <section class="space-y-4">
    <SearchPoliciesForm formInitData={data.form}/>
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
