<script lang="ts">
import { type AuthProvidersFragment, PendingValue, fragment, graphql } from '$houdini';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { getNhostClient } from '$lib/stores/nhost';
import type { NhostClient, Provider } from '@nhost/nhost-js';
import { getToastStore } from '@skeletonlabs/skeleton';
import { Alerts } from '@spectacular/skeleton/components/form';
import { Icon } from '@spectacular/skeleton/components/icons';
import { Github } from 'lucide-svelte';
import { onMount } from 'svelte';
const nhost = getNhostClient();
export let user: AuthProvidersFragment;
$: data = fragment(
  user,
  graphql(`
      fragment AuthProvidersFragment on users {
        providers: userProviders(order_by: { providerId: asc }) @list(name: "Auth_Providers") @loading {
          id
          providerId
          providerUserId
          updatedAt
        }
      }
  `),
);
$: ({ providers } = $data);

let Ids: string[] = [];
let message: App.Superforms.Message | undefined;
const errors: string[] = [];
let error: string | null = null;
let errorDescription: string | null = null;
const toastStore = getToastStore();
$: Ids = providers?.map((provider) => provider.providerId);
$: isGithub = Ids?.includes('github');
$: isAzure = Ids?.includes('azuread');
$: isGoogle = Ids?.includes('google');
onMount(() => {
  const searchParams = new URLSearchParams(window.location.search);
  error = searchParams.get('error');
  errorDescription = searchParams.get('errorDescription');
  if (errorDescription) {
    errors.push(errorDescription);
    handleMessage(
      {
        message: `Socail Connect Action failed with error ${errorDescription} `,
        hideDismiss: false,
        timeout: 10000,
        type: 'error',
      },
      toastStore,
    );
    // Remove the error parameters
    searchParams.delete('error');
    searchParams.delete('errorDescription');
    // update URL without parameters
    const url = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.replaceState({}, '', url);
  }
});
async function login(nhost: NhostClient, provider: Provider) {
  const redirectTo = '/profile';
  const error = await nhost.auth.connectProvider({
    provider,
    options: {
      redirectTo,
    },
  });
}
function click(event: MouseEvent, provider: Provider) {
  login(nhost, provider);
}
</script>
{#if errorDescription}
  <Alerts {errors} {message} />
{/if}
<div class="card p-4 flex">
  {#if !isGithub}
      <button
        type="button"
        class="variant-filled-primary btn ml-0"
        on:click={(event)=>click(event,'github')}
      >
      <Github/>&nbsp; Connect with Github</button>
    {:else}
      <button type="button" class="variant-ghost-primary btn ml-0"><Github/>&nbsp; Github Connnected</button>
  {/if}
  {#if !isAzure}
      <button
        class="variant-filled-primary btn ml-auto"
        on:click={(event)=>click(event,'azuread')}
      ><Icon name="microsoft" />&nbsp; Connect with Microsoft</button
    >
    {:else}
       <button type="button" class="variant-ghost-primary btn ml-auto"><Icon name="microsoft" />&nbsp; Microsoft Connnected</button>
  {/if}
  {#if !isGoogle}
      <button
        type="button"
        class="variant-filled-primary btn ml-auto"
        on:click={(event)=>click(event,'google')}
      ><Icon name="google" />&nbsp; Connect with Google</button
    >
    {:else}
       <button type="button" class="variant-ghost-primary btn ml-auto"><Icon name="google" />&nbsp; Google connnected</button>
  {/if}
</div>
