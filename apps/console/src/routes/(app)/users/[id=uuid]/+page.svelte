<script lang="ts">
import { Logger } from '@spectacular/utils';
import { GraphQLErrors } from '@spectacular/skeleton/components';
import type { PageData } from './$houdini';
import UserDetails from './components/user-details.svelte';
import AddGroup from './components/addgroups.svelte';

const log = new Logger('users.update.browser');

export let data: PageData;

// Reactivity
let { UserData1 } = data;
$: ({ UserData1 } = data);
</script>

<svelte:head>
  <title>Users</title>
  <meta name="description" content="User Details" />
</svelte:head>

<section class="space-y-4">
  {#if $UserData1.errors}
    <GraphQLErrors errors={$UserData1.errors} />
  {:else if $UserData1.data}
    <UserDetails data={$UserData1?.data} />
  {/if}
</section>
<section class="space-y-4">
  {#if $UserData1.errors}
    <GraphQLErrors errors={$UserData1.errors} />
  {:else if $UserData1.data}
    <AddGroup data={$UserData1?.data} />
  {/if}
</section>
