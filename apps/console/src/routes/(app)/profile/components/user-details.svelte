<script lang="ts">
import { fragment, graphql, type UserDetailsFragment } from '$houdini';
import { Accordion, AccordionItem, AppBar, Avatar, NoirLight, filter } from '@skeletonlabs/skeleton';
import { UserRound } from 'lucide-svelte';

export let userDetails: UserDetailsFragment;
$: data = fragment(
  userDetails,
  graphql(`
    fragment UserDetailsFragment on users {
      id
      displayName
      email
      phoneNumber
      defaultOrg
      defaultRole
      avatarUrl
      locale
      plan: metadata(path: ".plan")
    }
  `),
);
</script>

<AppBar>
	<svelte:fragment slot="lead"><UserRound /></svelte:fragment>
  <h2 class="h2" data-toc-ignore>{$data.displayName}</h2>
	<svelte:fragment slot="trail">
    <Avatar
    src={$data.avatarUrl || undefined}
    initials={$data.displayName}
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
		<svelte:fragment slot="content">{$data.displayName}</svelte:fragment>
		</AccordionItem>
		<AccordionItem>
		<svelte:fragment slot="summary"><div class="font-bold">Email Address</div></svelte:fragment>
		<svelte:fragment slot="content">{$data.email}</svelte:fragment>
		</AccordionItem>
		<AccordionItem>
		<svelte:fragment slot="summary"><div class="font-bold">User ID</div></svelte:fragment>
		<svelte:fragment slot="content">{$data.id}</svelte:fragment>
		</AccordionItem>
		<AccordionItem>
		<svelte:fragment slot="summary"><div class="font-bold">Roles</div></svelte:fragment>
		<svelte:fragment slot="content">{$data.defaultRole}</svelte:fragment>
		</AccordionItem>
		<AccordionItem>
		<svelte:fragment slot="summary"> <div class="font-bold">Default Role</div></svelte:fragment>
		<svelte:fragment slot="content">{$data.defaultRole}</svelte:fragment>
		</AccordionItem>
</Accordion>
</div>
