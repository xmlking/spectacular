<script lang="ts">
  import { run } from 'svelte/legacy';

import { type AuthProvidersFragment, PendingValue, fragment, graphql } from '$houdini';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { getNhostClient } from '$lib/stores/nhost';
import type { NhostClient, Provider } from '@nhost/nhost-js';
import { getToastStore } from '@skeletonlabs/skeleton';
import { Modal, getModalStore, initializeStores } from '@skeletonlabs/skeleton';
import type { ModalSettings } from '@skeletonlabs/skeleton';
import { Alerts } from '$lib/ui/components/form';
import { Icon } from '$lib/ui/components/icons';
import { Github } from 'lucide-svelte';
import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import { deleteSocialConnect } from '../mutations';
const modalStore = getModalStore();
initializeStores();
const nhost = getNhostClient();
  interface Props {
    user: AuthProvidersFragment;
  }

  let { user }: Props = $props();
let data = $derived(fragment(
  user,
  graphql(`
      fragment AuthProvidersFragment on users {
        providers: userProviders(order_by: { providerId: asc })
          @list(name: "Auth_Providers")
          @loading {
          id
          providerId
          providerUserId
          updatedAt
        }
      }
    `),
));
let { providers } = $derived($data);

// let Ids: string[] = $state([]);
let message: App.Superforms.Message | undefined = $state();
const errors: string[] = [];
let error: string | null = null;
let errorDescription: string | null = $state(null);
const toastStore = getToastStore();
let Ids = $derived(providers?.map((provider) => provider.providerId));
let isGithub = $derived(Ids?.includes('github'));
let isAzure = $derived(Ids?.includes('azuread'));
let isGoogle = $derived(Ids?.includes('google'));
//to get details
let gitid = $state('');
let azureid = $state('');
let googleid = $state('');
run(() => {
  for (const item of providers || []) {
    switch (item?.providerId) {
      case 'github':
        gitid = item?.id;
        break;
      case 'azuread':
        azureid = item?.id;
        break;
      case 'google':
        googleid = item?.id;
        break;
    }
  }
});
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

async function handleDelete(id: string, provider: string) {
  const { errors, data } = await deleteSocialConnect.mutate({ id });
  if (data) {
    message = {
      message: `Deleted ${provider} connection`,
      hideDismiss: true,
      timeout: 10000,
      type: 'success',
    };
    handleMessage(message, toastStore);
    window.location.reload();
  }
}
function modalConfirm(id: string, provider: string): void {
  const modal: ModalSettings = {
    type: 'confirm',
    // Data
    title: 'Please Confirm',
    body: `Are you sure you want remove ${provider} connection?`,
    // TRUE if confirm pressed, FALSE if cancel pressed
    response: (r: boolean) => {
      if (r) {
        handleDelete(id, provider);
      }
    },
  };
  modalStore.trigger(modal);
}
</script>

<Modal />
{#if errorDescription}
  <Alerts {errors} {message} />
{/if}
<div class="card p-4 flex">
  {#if !isGithub}
    <button
      type="button"
      class="variant-filled-primary btn ml-0"
      onclick={(event) => click(event, "github")}
    >
      <Github />&nbsp; Connect with Github</button
    >
  {:else}
    <button
      type="button"
      class="variant-ghost-primary btn ml-0"
      title={`Connected with Github`}
      onclick={() => modalConfirm(gitid, "Github")}
      ><Github />&nbsp; Github Connected</button
    >
  {/if}
  {#if !isAzure}
    <button
      class="variant-filled-primary btn ml-auto"
      onclick={(event) => click(event, "azuread")}
      ><Icon name="microsoft" />&nbsp; Connect with Microsoft</button
    >
  {:else}
    <button
      type="button"
      class="variant-ghost-primary btn ml-auto"
      title={`Connected with Microsoft`}
      onclick={() => modalConfirm(azureid, "Microsoft")}
      ><Icon name="microsoft" />&nbsp; Microsoft Connected</button
    >
  {/if}
  {#if !isGoogle}
    <button
      type="button"
      class="variant-filled-primary btn ml-auto"
      onclick={(event) => click(event, "google")}
      ><Icon name="google" />&nbsp; Connect with Google</button
    >
  {:else}
    <button
      type="button"
      class="variant-ghost-primary btn ml-auto"
      title={`Connected with Google`}
      onclick={() => modalConfirm(googleid, "Google")}
      ><Icon name="google" />&nbsp; Google Connected</button
    >
  {/if}
</div>
