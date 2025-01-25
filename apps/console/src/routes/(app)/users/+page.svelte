<script lang="ts">
import { Logger } from '@spectacular/utils';
import MaybeError from '$lib/components/layout/maybe-error.svelte';
import SearchUsersForm from './components/search-users-form.svelte';
import SearchUsersResult from './components/search-users-result.svelte';
import type { PageData } from './$houdini';

const log = new Logger('users:search:browser');
export let data: PageData;

// Reactivity
let { SearchUsersAll } = data;
$: ({ SearchUsersAll } = data);
</script>

<svelte:head>
  <title>Datablocks | Users</title>
  <meta name="description" content="User list" />
</svelte:head>

<div class="page-container">
  <section class="space-y-4">
    <h1 class="h1">Users</h1>
    <p>Search, update, delete Users</p>
  </section>

  <section class="space-y-4">
    <SearchUsersForm formInitData={data.form}/>
  </section>

<section class="space-y-4">
  <MaybeError
    debug={true}
    entityName="SearchPolicies"
    result={$SearchUsersAll}
    let:data={{ users }}
  >
    <SearchUsersResult {users} />
  </MaybeError>
</section>

</div>
