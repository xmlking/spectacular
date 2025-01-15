<script lang="ts">
import MaybeError from '$lib/components/layout/maybe-error.svelte';
import { Logger } from '@spectacular/utils';
import type { PageData } from './$houdini';
import OrganizationDetails from './components/update-organization-details.svelte';

const log = new Logger('organizations.update.browser');

export let data: PageData;

// Variables

// Functions

// Reactivity
let { OrganizationData } = data;
$: ({ OrganizationData } = data);
</script>

<svelte:head>
  <title>Datablocks | Organizations</title>
  <meta name="description" content=" Update Organization" />
</svelte:head>

<div class="page-container">
  <section class="space-y-4">
    <h1 class="h1">Organizations</h1>
    <p>Update organization details</p>
  </section>

  <MaybeError
    entityName="User"
    result={$OrganizationData}
    let:data={{organizations_by_pk}}
  >
    {#if organizations_by_pk}
      <section class="space-y-4">
        <h2 class="h2">User Details</h2>
        <p>Update your account information</p>
        <OrganizationDetails organization={organizations_by_pk} />
      </section>
    {/if}
  </MaybeError>
</div>
