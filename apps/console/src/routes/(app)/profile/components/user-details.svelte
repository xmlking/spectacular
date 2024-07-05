<script lang="ts">
import type { GetUser$result } from '$houdini';
import { Accordion, AccordionItem, AppBar, Avatar, NoirLight, filter } from '@skeletonlabs/skeleton';
import { UserRound } from 'lucide-svelte';

export let userDetails: GetUser$result['user'];
</script>

<AppBar>
	<svelte:fragment slot="lead"><UserRound /></svelte:fragment>
  <h2 class="h2" data-toc-ignore>{userDetails.displayName}</h2>
	<svelte:fragment slot="trail">
    <Avatar
    src={userDetails?.avatarUrl || undefined}
    initials={userDetails?.displayName}
    width="w-11"
    action={filter}
    actionParams="#NoirLight"
    />
  </svelte:fragment>
</AppBar>

<div class="card p-4">
<Accordion>
	<AccordionItem open>
		<svelte:fragment slot="summary"><div class="font-bold"> Name</div></svelte:fragment>
		<svelte:fragment slot="content">{userDetails?.displayName}</svelte:fragment>
		</AccordionItem>
		<AccordionItem>
		<svelte:fragment slot="summary"><div class="font-bold">Email Address</div></svelte:fragment>
		<svelte:fragment slot="content">{userDetails?.email}</svelte:fragment>
		</AccordionItem>
		<AccordionItem>
		<svelte:fragment slot="summary"><div class="font-bold">User ID</div></svelte:fragment>
		<svelte:fragment slot="content">{userDetails?.id}</svelte:fragment>
		</AccordionItem>
		<AccordionItem>
		<svelte:fragment slot="summary"><div class="font-bold">Roles</div></svelte:fragment>
		<svelte:fragment slot="content">{userDetails?.defaultRole}</svelte:fragment>
		</AccordionItem>
		<AccordionItem>
		<svelte:fragment slot="summary"> <div class="font-bold">Default Role</div></svelte:fragment>
		<svelte:fragment slot="content">{userDetails?.defaultRole}</svelte:fragment>
		</AccordionItem>
</Accordion>
</div>
