<script lang="ts">
import type { ChangeEventHandler } from 'svelte/elements';
import { getNhostClient } from '$lib/stores/nhost';
import { Logger } from '@spectacular/utils';
import { page } from '$app/stores';

const log = new Logger('profile:org-switcher:browser');

const nhost = getNhostClient();

// TODO load allowedOrgs from +layout.gql
export const allowedOrgs = [
  { value: '8dfd9a31-de01-47be-92a7-ba1c720c6270', name: 'Chinthagunta' },
  { value: 'd5dbb6b6-5e43-4dca-b855-be9b65b6695b', name: 'Species' },
  { value: 'd5dbb6b6-5e43-4dca-b855-be9b65b6695b', name: 'Something' },
];

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

<select
  class="select"
  bind:value={$page.data.orgId}
  on:change={handleSwitchOrg}
>
  {#each allowedOrgs as org}
    <option value={org.value} >{org.name}</option>
  {/each}
</select>
