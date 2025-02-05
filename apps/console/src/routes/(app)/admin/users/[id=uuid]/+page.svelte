<script lang="ts">
import MaybeError from '$lib/components/layout/maybe-error.svelte';
import { GraphQLErrors } from '@spectacular/skeleton/components';
import { Logger } from '@spectacular/utils';
import type { PageData } from './$houdini';
import UserDetails from './components/user-details.svelte';
import UserGroups from './components/user-groups.svelte';

const log = new Logger('users.update.browser');

export let data: PageData;

// Reactivity
let { UserData } = data;
$: ({ UserData } = data);
</script>

<svelte:head>
  <title>Users</title>
  <meta name="description" content="User Details" />
</svelte:head>

<div class="page-container">
  <section class="space-y-4">
    <h1 class="h1">User Details</h1>
    <p>View user details, assign groups</p>
  </section>

  <MaybeError
    entityName="User"
    result={$UserData}
    let:data={{ user }}
  >
    {#if user}
    <section class="space-y-4">
      <h2 class="h2">User Details</h2>
      <p>Update your account information</p>
     <UserDetails {user} />
    </section>
    <section class="space-y-4">
      <h2 class="h2">User Groups</h2>
      <p>Drag and Drop Groups to add/remove groups to user</p>
       <UserGroups {user} />
    </section>
  {/if}
 </MaybeError>
</div>
