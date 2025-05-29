<script lang="ts">
import MaybeError from '$lib/components/layout/maybe-error.svelte';
import { DebugShell, GraphQLErrors } from '$lib/ui/components';
import { Logger } from '@repo/utils';
import SuperDebug from 'sveltekit-superforms';
import type { PageData } from './$houdini';
import ListGroupsForm from './components/search-groups-form.svelte';
import ListGroupsResult from './components/search-groups-result.svelte';

const log = new Logger('groups:search:browser');
export let data: PageData;

// Reactivity
let { ListGroups } = data;
$: ({ ListGroups } = data);
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
    <ListGroupsForm formInitData={data.form}/>
  </section>

<section class="space-y-4">
  <MaybeError
    debug={true}
    entityName="SearchGroups"
    result={$ListGroups}
    let:data={{ groups }}
  >
    <ListGroupsResult {groups} />
  </MaybeError>
</section>

</div>
