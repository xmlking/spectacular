<script lang="ts">
import { PendingValue, type UserDetailsFragment, fragment, graphql } from '$houdini';
import { Accordion, AccordionItem, AppBar, Avatar, NoirLight, filter } from '@skeletonlabs/skeleton';
import { camelize } from '@spectacular/utils';
import { UserRound } from 'lucide-svelte';

export let user: UserDetailsFragment;
$: data = fragment(
  user,
  graphql(`
    fragment UserDetailsFragment on users @loading(cascade: true) {
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
  {#if $data.displayName === PendingValue}
  <div class="placeholder animate-pulse" />
  {:else}
  <h2 class="h2" data-toc-ignore>{$data.displayName}</h2>
  {/if}
	<svelte:fragment slot="trail">
    {#if $data.avatarUrl === PendingValue || $data.displayName === PendingValue }
    <div class="placeholder-circle w-16 animate-pulse" />
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
  <dl class="list-dl w-full">
    {#each Object.entries($data) as [key, value]}
    <div>
      <dt class="font-bold">{camelize(key)} :</dt>
      <dd>
        {#if value === PendingValue}
          <div class="placeholder animate-pulse" />
        {:else }
          {value}
        {/if}
      </dd>
    </div>
    {/each}
  </dl>
</div>
