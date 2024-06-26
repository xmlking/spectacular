<script lang="ts">
import { page } from '$app/stores';
import { Meta } from '$lib/components';
import { elevate, nhost, user } from '$lib/stores/user';
import type { AuthErrorPayload } from '@nhost/nhost-js';
import { Debug } from '@spectacular/skeleton/components';
import type { PageData } from './$houdini';
import PersonalAccessTokens from './personal-access-tokens.svelte';
import Providers from './providers.svelte';
import SecurityKeys from './security-keys.svelte';
import UserOrgRoles from './user-org-roles.svelte';

// https://github.com/nhost/nhost/blob/main/examples/react-apollo/src/profile/security-keys.tsx
export let data: PageData;

$: ({ GetUser } = data);
$: userOrgRoles = $GetUser.data?.user?.userOrgRoles ?? [];
$: userProviders = $GetUser.data?.user?.userProviders ?? [];
$: personalAccessTokens = $GetUser.data?.user?.personalAccessTokens ?? [];
$: securityKeys = $GetUser.data?.user?.securityKeys ?? [];

// Variables
let nickname: string;
let error: AuthErrorPayload | null;

// Functions
async function addSecurityKey() {
  console.log({ nickname });
  error = await elevate()
   if (error) {
    console.log(error);
    return;
  }
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
  error = await elevate()
  if (!error) {
        // TODO notify
      console.log('elevated successfully');
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
  <meta name="description" content="Edit Profile" />
</svelte:head>

<div class="page-container">
  <section class="space-y-4">
		<h1 class="h1">Profile</h1>
		<p>Update your profile details</p>
	</section>

  {#if error}
    <section class="space-y-4">
      <h2 class="h2">Error</h2>
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </section>
  {/if}

  {#if $GetUser.fetching}
    <span>loading...</span>
  {:else}

    <section class="space-y-4">
		<h2 class="h2">Contact</h2>
		<p>Update user contact details</p>
    <div class="card p-4">
      <pre>{JSON.stringify($GetUser.data?.user, null, 2)}</pre>
    </div>
	</section>

  <section class="space-y-4">
		<h2 class="h2">User Org Roles</h2>
		<p>Add or delete user org roles</p>
    <UserOrgRoles {userOrgRoles} ></UserOrgRoles>
	</section>

  <section class="space-y-4">
		<h2 class="h2">Auth Providers</h2>
		<p>Add or delete auth providers</p>
    <Providers {userProviders} ></Providers>
	</section>

    <section class="space-y-4">
		<h2 class="h2">Personal Access Tokens</h2>
		<p>Add are delete your personal access tokens(PAT)</p>
    <PersonalAccessTokens {personalAccessTokens} ></PersonalAccessTokens>
	</section>

  <section class="space-y-4">
		<h2 class="h2">Security Keys</h2>
		<p>Add are delete your security keys like TouchID, FaceID, YubiKeys etc</p>
    <SecurityKeys {securityKeys} />
	</section>


  <section class="space-y-4">
		<h2 class="h2">WebAuthn</h2>
		<p>Add are delete your security keys</p>
    <div class="card p-4">
      <title>Security keys</title>
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

  <section class="space-y-4">
		<h2 class="h2">Elevate</h2>
		<p>Add are delete your security keys</p>
    <div class="card p-4">
      <!-- <span>Elevated permissions: {String(elevated)}</span> -->
      <button type="button" class="btn variant-filled" on:click={handleElevate} >Elevate</button>
    </div>
	</section>

  {/if}
</div>

