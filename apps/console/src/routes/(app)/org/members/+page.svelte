<script lang="ts">
import MaybeError from '$lib/components/layout/maybe-error.svelte';
import { Tab, TabGroup } from '@skeletonlabs/skeleton';
import { Logger } from '@spectacular/utils';
import { Plus } from 'lucide-svelte';
import type { PageData } from './$houdini';
import Invitations from './components/invitations.svelte';
import InviteMembersForm from './components/invite-members-form.svelte';
import Members from './components/members.svelte';

const log = new Logger('memberships:add:browser');
  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

// Variables
let tabSet = $state(0);

// Functions

// Reactivity
// let { MembershipData } = $state(data);
let { MembershipData } = $derived(data);
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

  >
    {#snippet children({ data: { organizations_by_pk } })}
        <section class="space-y-4">
        <InviteMembersForm />
      </section>

      <section class="space-y-4">
        <TabGroup>
          <Tab bind:group={tabSet} name="tab1" value={0}>Org Members</Tab>
          <Tab bind:group={tabSet} name="tab2" value={1}>Pending Invitations</Tab>
          {#snippet panel()}

              {#if organizations_by_pk}
                {#if tabSet === 0}
                  <Members organization={organizations_by_pk} />
                {:else if tabSet === 1}
                  <Invitations organization={organizations_by_pk} />
                {/if}
              {/if}

              {/snippet}
        </TabGroup>
      </section>
          {/snippet}
    </MaybeError>
</div>
