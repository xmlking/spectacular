<script lang="ts">
import { Logger } from '@spectacular/utils';
import { Plus } from 'lucide-svelte';
import { TabGroup, Tab } from '@skeletonlabs/skeleton';
import Members from './components/members.svelte';
import Invitations from './components/invitations.svelte';
import InviteMembersForm from './components/invite-members-form.svelte';
import MaybeError from '$lib/components/layout/maybe-error.svelte';
import type { PageData } from './$houdini';

const log = new Logger('memberships:add:browser');
export let data: PageData;

// Variables
let tabSet = 0;

// Functions

// Reactivity
let { MembershipData } = data;
$: ({ MembershipData } = data);
</script>

<svelte:head>
  <title>Datablocks | Memberships</title>
  <meta name="description" content="memberships" />
</svelte:head>

<div class="page-container">
  <section class="space-y-4">
    <h1 class="h1">Members</h1>
    <p class="text-gray-500 mt-1">Manage organization members and invitations</p>
  </section>

  <MaybeError
    debug={true}
    entityName="Memberships"
    result={$MembershipData}
    let:data={{ organizations_by_pk }}
  >
    <section class="space-y-4">
      <InviteMembersForm />
    </section>

    <section class="space-y-4">
      <TabGroup>
        <Tab bind:group={tabSet} name="tab1" value={0}>Org Members</Tab>
        <Tab bind:group={tabSet} name="tab2" value={1}>Pending Invitations</Tab>
        <svelte:fragment slot="panel">
          {#if organizations_by_pk}
            {#if tabSet === 0}
              <Members organization={organizations_by_pk} />
            {:else if tabSet === 1}
              <Invitations organization={organizations_by_pk} />
            {/if}
          {/if}
        </svelte:fragment>
      </TabGroup>
    </section>
  </MaybeError>
</div>
