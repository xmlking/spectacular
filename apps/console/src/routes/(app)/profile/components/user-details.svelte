<script lang="ts">
import { PendingValue, type UserDetailsFragment, fragment, graphql } from '$houdini';
import { Accordion, AccordionItem, AppBar, Avatar, NoirLight, filter } from '@skeletonlabs/skeleton';
import { UserRound } from 'lucide-svelte';

export let user: UserDetailsFragment;
$: data = fragment(user, graphql(`
    fragment UserDetailsFragment on users @loading {
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
  `));
</script>

<AppBar>
	<svelte:fragment slot="lead"><UserRound /></svelte:fragment>
  {#if $data.displayName === PendingValue}
  <div class="placeholder animate-pulse" />
  {:else}
  <h2 class="h2" data-toc-ignore>{$data.displayName}</h2>
  {/if}
	<svelte:fragment slot="trail">
    {#if $data.avatarUrl === PendingValue}
    <div class="placeholder animate-pulse" />
    {:else}
    <Avatar
    src={$data.avatarUrl || undefined}
    initials={$data.displayName}
    width="w-11"
    action={filter}
    actionParams="#NoirLight"
    />
   {/if}
  </svelte:fragment>
</AppBar>

<div class="card p-4">
  {#if $data.id === PendingValue}
  <div class="placeholder animate-pulse" />
  {:else}
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
      <svelte:fragment slot="summary"><div class="font-bold">Default Org</div></svelte:fragment>
      <svelte:fragment slot="content">{$data.defaultOrg}</svelte:fragment>
      </AccordionItem>
      <AccordionItem>
      <svelte:fragment slot="summary"> <div class="font-bold">Default Role</div></svelte:fragment>
      <svelte:fragment slot="content">{$data.defaultRole}</svelte:fragment>
      </AccordionItem>
  </Accordion>
  {/if}
</div>
