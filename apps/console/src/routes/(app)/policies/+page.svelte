<script lang="ts">
import { Logger } from '@spectacular/utils';
import type { PageData } from './$houdini';
import SearchPoliciesForm from './components/search-policies-form.svelte';
import SearchPoliciesResult from './components/search-policies-result.svelte';
import MaybeError from '$lib/components/layout/maybe-error.svelte';

const log = new Logger('policies:search:browser');
export let data: PageData;

// Reactivity
let { SearchPolicies } = data;
$: ({ SearchPolicies } = data);
</script>

<svelte:head>
  <title>Datablocks | Policies</title>
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
  <MaybeError
    debug={true}
    entityName="SearchPolicies"
    result={$SearchPolicies}
    let:data={{ policies, policies_aggregate }}
  >
    <SearchPoliciesResult {policies} />
  </MaybeError>
</section>

</div>
