<script lang="ts">
import { DebugShell, GraphQLErrors } from '@spectacular/skeleton/components';
import { Logger } from '@spectacular/utils';
import SuperDebug from 'sveltekit-superforms';
import type { PageData } from './$houdini';
import SearchOrganizationsForm from './components/search-organizations-form.svelte';
import SearchOrganizationsResult from './components/search-organizations-result.svelte';
import MaybeError from '$lib/components/layout/maybe-error.svelte';
import ListGroupsResult from '../groups/components/search-groups-result.svelte';

const log = new Logger('organizations:search:browser');
export let data: PageData;

// Reactivity
let { SearchOrganizations } = data;
$: ({ SearchOrganizations } = data);
</script>

<svelte:head>
  <title>Datablocks | Organizations</title>
  <meta name="description" content="Organizations list" />
</svelte:head>

<div class="page-container">
  <section class="space-y-4">
    <h1 class="h1">Organizations</h1>
    <p>Search, create, update, delete Organizations</p>
  </section>

  <section class="space-y-4">
    <SearchOrganizationsForm formInitData={data.form}/>
  </section>

<section class="space-y-4">
  <MaybeError
    debug={true}
    entityName="SearchPolicies"
    result={$SearchOrganizations}
    let:data={{ organizations }}
  >
    <SearchOrganizationsResult {organizations} />
  </MaybeError>
</section>

</div>
