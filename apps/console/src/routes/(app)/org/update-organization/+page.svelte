<script lang="ts">
import MaybeError from '$lib/components/layout/maybe-error.svelte';
import { Logger } from '@spectacular/utils';
import UpdateOrganizationsForm from '$lib/components/organizations/update-organizations-form.svelte';
import type { PageData } from './$houdini';

const log = new Logger('org:organizations:update:page');

export let data: PageData;

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
    <p>Update Organization</p>
  </section>

  <MaybeError
    entityName="Organization"
    result={$OrganizationData}
    let:data={{organizations_by_pk}}
  >
    {#if organizations_by_pk}
      <UpdateOrganizationsForm organization={organizations_by_pk} />
    {/if}
  </MaybeError>
</div>
