<script lang="ts">
import { page } from '$app/stores';
import { Meta } from '$lib/components';
import { elevate, nhost, user } from '$lib/stores/user';
import type { AuthErrorPayload } from '@nhost/nhost-js';
import { Debug } from '@spectacular/skeleton/components';
import type { PageData } from './$houdini';

import { Alerts } from '@spectacular/skeleton/components/form';
import ChangeEmailForm from './components/change-email.svelte';
import ChangePasswordForm from './components/change-password.svelte';
import ConnectSocials from './components/connect-socials.svelte';
import ElevateComp from './components/elevate.svelte';
import MultiFactorAuth from './components/multi-factor-auth.svelte';
import PersonalAccessTokens from './components/personal-access-tokens.svelte';
import SecurityKeyForm from './components/security-key-form.svelte';
import SecurityKeys from './components/security-keys.svelte';
import UserOrgRoles from './components/user-org-roles.svelte';

// https://github.com/nhost/nhost/blob/main/examples/react-apollo/src/profile/security-keys.tsx
export let data: PageData;

// Variables
let message: App.Superforms.Message | undefined;
let errors: string[] = [];

// Functions

// Reactivity
$: ({ GetUser } = data);
$: userOrgRoles = $GetUser.data?.user?.userOrgRoles ?? [];
$: userProviders = $GetUser.data?.user?.userProviders ?? [];
$: personalAccessTokens = $GetUser.data?.user?.personalAccessTokens ?? [];
$: securityKeys = $GetUser.data?.user?.securityKeys ?? [];
$: email = $GetUser.data?.user?.email;

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

  <!-- Form Level Errors / Messages -->
  <Alerts {errors} {message} />

  {#if $GetUser.fetching}
    <div class="placeholder animate-pulse" />
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
      <UserOrgRoles bind:message bind:errors {userOrgRoles} />
    </section>

    <section class="space-y-4">
      <h2 class="h2">Auth Providers</h2>
      <p>Add or delete auth providers</p>
      <ConnectSocials bind:message bind:errors {userProviders} />
    </section>

    <section class="space-y-4">
      <h2 class="h2">Personal Access Tokens</h2>
      <p>Add are delete your personal access tokens(PAT)</p>
      <PersonalAccessTokens bind:message bind:errors {personalAccessTokens}
      ></PersonalAccessTokens>
    </section>

    {#if email}
      <section class="space-y-4">
        <h2 class="h2">Change Email</h2>
        <p>To update your email, enter it and submit</p>
        <ChangeEmailForm initialData={{ email }} />
      </section>
    {/if}

    <section class="space-y-4">
      <h2 class="h2">Change Password</h2>
      <p>
        To update your password, enter password and conformPassword and submit
      </p>
      <ChangePasswordForm />
    </section>

    <section class="space-y-4">
      <h2 class="h2">Security Keys</h2>
      <p>
        Add are delete your security keys like TouchID, FaceID, YubiKeys etc
      </p>
      <SecurityKeys bind:message bind:errors {securityKeys} />
      <SecurityKeyForm bind:message bind:errors />
    </section>

    <section class="space-y-4">
      <h2 class="h2">Multi-Factor Authentication (MFA)</h2>
      <p>Add MFA</p>
      <MultiFactorAuth bind:message bind:errors />
    </section>

    <section class="space-y-4">
      <h2 class="h2">Elevate</h2>
      <p>Elevate user security level</p>
      <ElevateComp bind:message bind:errors />
    </section>
  {/if}
</div>
