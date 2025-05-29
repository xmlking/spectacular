<script lang="ts">
import { page } from '$app/stores';
import { type AllowedOrgsFragment, fragment, graphql } from '$houdini';
import { getNhostClient } from '$lib/stores/nhost';
import { Logger } from '@repo/utils';
import type { ChangeEventHandler } from 'svelte/elements';

const log = new Logger('profile:org-switcher:browser');

// Variables
const nhost = getNhostClient();
let value = $page.data.orgId;

// Reactivity
let { AppLayout } = $page.data;
$: ({ AppLayout } = $page.data);
let user: AllowedOrgsFragment = $AppLayout?.data?.user;
$: user = $AppLayout?.data?.user;
$: data = fragment(
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
);

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
      on:change={handleSwitchOrg}
    >
      {#each allowedOrgs as org}
          <option value={org.orgId}>{org.organization.displayName}</option>
      {/each}
    </select>
  {/if}
{/if}
