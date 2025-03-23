<script lang="ts">
import { page } from '$app/stores';
import { type AllowedOrgsFragment, fragment, graphql } from '$houdini';
import { getNhostClient } from '$lib/stores/nhost';
import { Logger } from '@spectacular/utils';
import type { ChangeEventHandler } from 'svelte/elements';

const log = new Logger('profile:org-switcher:browser');

// Variables
const nhost = getNhostClient();
let value = $state($page.data.orgId);

// Reactivity
// let { AppLayout } = $state($page.data);
let { AppLayout } = $derived($page.data);
// let user: AllowedOrgsFragment = $state($AppLayout?.data?.user);
let user = $derived($AppLayout?.data?.user);
let data = $derived(fragment(
  user,
  graphql(`
      fragment AllowedOrgsFragment on users {
        allowedOrgs(order_by: { orgId: asc }) @list(name: "User_Allowed_Orgs") {
          orgId
          organization {
            displayName
          }
          role
        }
      }
    `),
));

// Functions
const handleSwitchOrg: ChangeEventHandler<HTMLSelectElement> = async (event) => {
  // const value = (event.target as HTMLSelectElement).value;
  const orgId = (event.target as HTMLSelectElement)?.selectedOptions[0]?.value;
  const status = await nhost.switchOrg(orgId);
  if (status) {
    log.debug('all good');
  } else {
    log.error('org switch failed');
  }
};
</script>

{#if $data}
  {@const allowedOrgs = $data.allowedOrgs}
  {#if allowedOrgs && allowedOrgs.length > 0}
    <select
      class="select"
      bind:value
      onchange={handleSwitchOrg}
    >
      {#each allowedOrgs as org}
          <option value={org.orgId}>{org.organization.displayName}</option>
      {/each}
    </select>
  {/if}
{/if}
