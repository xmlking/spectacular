<script lang="ts">
import { page } from '$app/stores';
import { Meta } from '$lib/components';
import { nhost, user } from '$lib/stores/user';
import type { AuthErrorPayload } from '@nhost/nhost-js';
import { Avatar } from '@skeletonlabs/skeleton';
import { Debug } from '@spectacular/skeleton/components';
import type { PageData } from './$houdini';
import SecurityKeysCard from './security-keys.svelte';

// https://github.com/nhost/nhost/blob/main/examples/react-apollo/src/profile/security-keys.tsx
export let data: PageData;

$: ({ GetUser } = data);
$: securityKeys = $GetUser.data?.user?.securityKeys ?? [];

// Variables
let nickname: string;
let error: AuthErrorPayload | null;

// Functions
async function addSecurityKey() {
  console.log({ nickname });
  const { key, error: addKeyError } = await nhost.auth.addSecurityKey(nickname);
  // Something unexpected happened
  if (error) {
    console.log(error);
    error = addKeyError;
    return;
  }
  // Successfully added a new security key
  console.log(key?.id);
}

async function handleElevate() {
  const email = $user?.email
  if (email) {
        const { elevated, isError } = await nhost.auth.elevateEmailSecurityKey(email)
      if (elevated) {
          // notify
          console.log({elevated})
      }
      if (isError) {
        console.log({isError})
      }
  }

}

// Reactivity
$: meta = {
  title: 'Datablocks | Profile',
  canonical: $page.url.toString(),
};
</script>

<Meta {...meta} />

<svelte:head>
  <title>Datablocks | Profile</title>
  <meta name="description" content="Account Profile" />
</svelte:head>



<div class="page-container">


  {#if $GetUser.fetching}
    <span>loading...</span>
  {:else}

    <h3>Error:</h3>
    <section class="rounded-lg bg-slate-50">
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </section>


    <section class="rounded-lg bg-slate-50">
      <pre>{JSON.stringify($GetUser.data, null, 2)}</pre>
    </section>

    <section>
      <span>done....</span>
      <div class="relative inline-block">
        <span class="badge-icon variant-filled-warning absolute -top-0 -right-0 z-10">2</span>
        <Avatar />
      </div>
        <!-- {$GetUser.data....} -->
    </section>

    <section class="rounded-lg bg-slate-50">
      <SecurityKeysCard {securityKeys} />
    </section>
  {/if}

  <div class="page-section">
    <h2 class="h2">Profile</h2>
    <Debug data={$user} />
  </div>
  <section class="page-section">
    <h3 class="h3">WebAuthn</h3>
      <div class="card p-4">
      <title>Security keys</title>
      <table >
        <colgroup>
          <col />
          <col width="20%" />
        </colgroup>
        <!-- <tbody>
          {list.map(({ id, nickname }) => (
            <tr key={id}>
              <td>{nickname || id}</td>
              <td>
                <button type="button" class="btn variant-filled" on:click={() => handleRemoveKey(id)} color="red">
                  <Settings />
                </button>
              </td>
            </tr>
          ))}
        </tbody> -->
      </table>
        <form class="space-y-4" on:submit|preventDefault={addSecurityKey}>
          <input
            bind:value={nickname}
            placeholder='Nickname for the device (optional)'
            class="block w-full p-3 border rounded-md border-slate-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <button type="submit" class="btn variant-filled">Add a new device</button>
      </form>
    </div>
  </section>

  <section>
    <!-- <span>Elevated permissions: {String(elevated)}</span> -->
    <button type="button" class="btn variant-filled" on:click={handleElevate} >Elevate</button>
  </section>
</div>

