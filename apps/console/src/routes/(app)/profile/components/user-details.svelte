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
    {#if $data.avatarUrl === PendingValue || $data.displayName === PendingValue}
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
          {:else}
            {value}
          {/if}
        </dd>
      </div>
    {/each}
  </dl>
</div>

<div class="card bg-initial card-hover overflow-hidden"
  ><header>
      <div class="text-2xl">Edit Profile</div>
      <div>Update your account information</div>
  </header>
  <div class="grid grid-cols-2 gap-4">
          <div class="space-y-4">
            <div class="grid gap-2">
              <label for="displayName">Display Name</label>
              <input id="displayName" placeholder="John Doe" />
            </div>
            <div class="grid gap-2">
              <label for="email">Email</label>
              <input id="email" type="email" placeholder="example@email.com" />
            </div>
          </div>
          <div class="space-y-4">
            <div class="grid gap-2">
              <label for="phoneNumber">Phone Number</label>
              <input id="phoneNumber" type="tel" placeholder="+1 (555) 555-5555" />
            </div>
            <div class="grid gap-2">
              <label for="avatarUrl">Avatar URL</label>
              <input id="avatarUrl" type="url" placeholder="https://example.com/avatar.jpg" />
            </div>
          </div>
          <div class="col-span-2 space-y-4">
            <div class="grid gap-2">
              <label for="locale">Locale</label>
              <select id="locale">
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español (España)</option>
                  <option value="fr-FR">Français (France)</option>
                  <option value="de-DE">Deutsch (Deutschland)</option>
              </select>
            </div>
            <div class="grid gap-2">
              <label for="plan">Plan</label>
              <select id="plan">
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
  </div>
  <footer class="p-4 flex justify-start items-center space-x-4">
       <button class="btn variant-filled w-full">Save Changes</button>
  </footer>
  </div>
