<script lang="ts">
import { page } from '$app/stores';
import { PendingValue } from '$houdini';
import { Meta } from '$lib/components';
import { allLoaded, loaded, loading } from '$lib/graphql/loading';
import { GraphQLErrors } from '@spectacular/skeleton/components';
import type { PageData } from './$houdini';
import ChangeEmailForm from './components/change-email.svelte';
import ChangePasswordForm from './components/change-password.svelte';
import ConnectSocials from './components/connect-socials.svelte';
import HasuraJwtClaims from './components/hasura-jwt-claims.svelte';
import MultiFactorAuth from './components/multi-factor-auth.svelte';
import PersonalAccessTokenForm from './components/personal-access-token-form.svelte';
import PersonalAccessTokens from './components/personal-access-tokens.svelte';
import SecurityKeyForm from './components/security-key-form.svelte';
import SecurityKeys from './components/security-keys.svelte';
import UserDetails from './components/user-details.svelte';
import UserOrgRoles from './components/user-org-roles.svelte';

/**
 * Loading states example: https://houdini-intro.pages.dev/
 * Docs: https://houdinigraphql.com/guides/loading-states
 */
export let data: PageData;

// Variables

// Functions

// Reactivity
let { GetUser } = data;
$: ({ GetUser } = data);

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

  {#if $GetUser.errors}
    <GraphQLErrors errors={$GetUser.errors} />
  {:else if $GetUser.data?.user}
    {@const user = $GetUser.data.user}
    {@const { email, securityKeys } = user}

    <section class="space-y-4">
      <h2 class="h2">User Details</h2>
      <p>Update user details</p>
      <UserDetails {user} />
    </section>

    <section class="space-y-4">
      <h2 class="h2">User Org Roles</h2>
      <p>Orgs and roles you are granted</p>
      <UserOrgRoles {user} />
    </section>

    <section class="space-y-4">
      <h2 class="h2">Auth Providers</h2>
      <p>Add or delete auth providers</p>
      <ConnectSocials {user} />
    </section>

    <section class="space-y-4">
      <h2 class="h2">Personal Access Tokens</h2>
      <p>Add are delete your personal access tokens(PAT)</p>
      <PersonalAccessTokenForm />
      <PersonalAccessTokens {user}></PersonalAccessTokens>
    </section>

    <section class="space-y-4">
      <h2 class="h2">Change Email</h2>
      <p>Change the password of the current user.</p>
      {#if loaded(email)}
        <ChangeEmailForm initialData={{ email: email || "" }} />
      {:else}
        <div class="placeholder animate-pulse" />
      {/if}
    </section>

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
      {#if allLoaded(securityKeys) && securityKeys.length > 0}
      <SecurityKeys {securityKeys} />
      {/if}
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
