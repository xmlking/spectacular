<script lang="ts">
import { page } from '$app/stores';
import { PendingValue } from '$houdini';
import { Meta } from '$lib/components';
import MaybeError from '$lib/components/layout/maybe-error.svelte';
import { allLoaded, loaded, loading } from '$lib/graphql/loading';
import { Tab, TabGroup } from '@skeletonlabs/skeleton';
import { GraphQLErrors } from '$lib/ui/components';
import type { PageData } from './$houdini';
import ChangeEmailForm from './components/change-email.svelte';
import ChangePasswordForm from './components/change-password.svelte';
import ConnectSocials from './components/connect-socials.svelte';
import HasuraJwtClaims from './components/hasura-jwt-claims.svelte';
import Invitations from './components/invitations.svelte';
import Memberships from './components/memberships.svelte';
import MultiFactorAuth from './components/multi-factor-auth.svelte';
import PersonalAccessTokenForm from './components/personal-access-token-form.svelte';
import PersonalAccessTokens from './components/personal-access-tokens.svelte';
import SecurityKeyForm from './components/security-key-form.svelte';
import SecurityKeys from './components/security-keys.svelte';
import UserDetails from './components/user-details.svelte';


  interface Props {
    /**
 * Loading states example: https://houdini-intro.pages.dev/
 * Docs: https://houdinigraphql.com/guides/loading-states
 */
    data: PageData;
  }

  let { data }: Props = $props();

// Variables
let tabSet = $state(0);

// Functions

// Reactivity
// let { ProfileData } = $state(data);
let { ProfileData } = $derived(data);

let meta = $derived({
  title: 'Datablocks | Profile',
  canonical: $page.url.toString(),
});
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

  <MaybeError
    entityName="User"
    result={$ProfileData}

  >
  {#snippet children({ data: { user } })}
        {#if user}
      {@const { email } = user}

      <section class="space-y-4">
        <h2 class="h2">User Details</h2>
        <p>Update your account information</p>
        <UserDetails {user} />
      </section>

      <section class="space-y-4">
        <h2 class="h2">Memberships</h2>
        <p>Org memberships and pending invitations</p>
        <TabGroup>
          <Tab bind:group={tabSet} name="tab1" value={0}>Memberships</Tab>
          <Tab bind:group={tabSet} name="tab2" value={1}>Pending Invitations</Tab>
          {#snippet panel()}

              {#if user}
                {#if tabSet === 0}
                  <Memberships {user} />
                {:else if tabSet === 1}
                  <Invitations {user} />
                {/if}
              {/if}

                  {/snippet}
        </TabGroup>
      </section>

      <section class="space-y-4">
        <h2 class="h2">Authentication Providers</h2>
        <p>Connect/Disconnect Authentication Providers</p>
        <ConnectSocials {user} />
      </section>

      <section class="space-y-4">
        <h2 class="h2">Personal Access Tokens</h2>
        <p>Add are remove your Personal Access Tokens(PAT)</p>
        <PersonalAccessTokenForm />
        <PersonalAccessTokens {user}></PersonalAccessTokens>
      </section>

      <section class="space-y-4">
        <h2 class="h2">Change Email</h2>
        <p>Change the Email of the current user.</p>
        {#if loaded(email)}
          <ChangeEmailForm initialData={{ email: email || "" }} />
        {:else}
          <div class="placeholder animate-pulse"></div>
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
        <SecurityKeys {user} />
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
          {/snippet}
    </MaybeError>
</div>
