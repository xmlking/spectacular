<script lang="ts">
import MaybeError from '$lib/components/layout/maybe-error.svelte';
import { Logger } from '@spectacular/utils';
import type { PageData } from './$houdini';
import SearchUsersForm from './components/search-users-form.svelte';
import SearchUsersResult from './components/search-users-result.svelte';

const log = new Logger('users:search:browser');
  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

// Reactivity
// let { SearchUsersAll } = $state(data);
let { SearchUsersAll } = $derived(data);
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
    entityName="SearchGroups"
    result={$SearchUsersAll}

  >
    {#snippet children({ data: { users } })}
            <SearchUsersResult {users} />
              {/snippet}
        </MaybeError>
</section>

</div>
