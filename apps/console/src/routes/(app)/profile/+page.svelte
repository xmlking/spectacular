<script lang="ts">
import { page } from '$app/stores';
import { Meta } from '$lib/components';
import type { PageData } from './$houdini';
import ChangeEmailForm from './components/change-email.svelte';
import ChangePasswordForm from './components/change-password.svelte';
import ConnectSocials from './components/connect-socials.svelte';
import HasuraJwtClaims from './components/hasura-jwt-claims.svelte';
import MultiFactorAuth from './components/multi-factor-auth.svelte';
import PersonalAccessTokens from './components/personal-access-tokens.svelte';
import SecurityKeyForm from './components/security-key-form.svelte';
import SecurityKeys from './components/security-keys.svelte';
import UserDetails from './components/user-details.svelte';
import UserOrgRoles from './components/user-org-roles.svelte';

// https://github.com/nhost/nhost/blob/main/examples/react-apollo/src/profile/security-keys.tsx
export let data: PageData;

// Variables

// Functions

// Reactivity
$: ({ GetUser } = data);
$: userDetails = $GetUser.data?.user;
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

  {#if $GetUser.fetching}
    <div class="placeholder animate-pulse" />
  {:else}
    {#if userDetails}
      <section class="space-y-4">
        <h2 class="h2">User Details</h2>
        <p>Update user details</p>
        <UserDetails {userDetails} />
      </section>
    {/if}

    <section class="space-y-4">
      <h2 class="h2">User Org Roles</h2>
      <p>Orgs and roles you are granted</p>
      <UserOrgRoles {userOrgRoles} />
    </section>

    <section class="space-y-4">
      <h2 class="h2">Auth Providers</h2>
      <p>Add or delete auth providers</p>
      <ConnectSocials {userProviders} />
    </section>

    <section class="space-y-4">
      <h2 class="h2">Personal Access Tokens</h2>
      <p>Add are delete your personal access tokens(PAT)</p>
      <PersonalAccessTokens {personalAccessTokens}></PersonalAccessTokens>
    </section>

    {#if email}
      <section class="space-y-4">
        <h2 class="h2">Change Email</h2>
        <p>Change the password of the current user.</p>
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
      <SecurityKeyForm />
      <SecurityKeys {securityKeys} />
    </section>

    <section class="space-y-4">
      <h2 class="h2">Multi-Factor Authentication (MFA)</h2>
      <p>Add MFA</p>
      <MultiFactorAuth />
    </section>

    <section class="space-y-4">
      <h2 class="h2">JWT Claims</h2>
      <p>
        You can <b>refresh</b> session token or <b>elevate</b> user security level
        here
      </p>
      <HasuraJwtClaims />
    </section>
  {/if}
</div>
