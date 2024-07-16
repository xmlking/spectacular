<script lang="ts">
import { type AuthProvidersFragment, PendingValue, fragment, graphql } from '$houdini';
import { getNhostClient } from '$lib/stores/nhost';
import type { NhostClient, Provider } from '@nhost/nhost-js';
import { Icon } from '@spectacular/skeleton/components/icons';
import { Github } from 'lucide-svelte';
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
$: Ids = providers?.map((provider) => provider.providerId);
$: isGithub = Ids?.includes('github');
$: isAzure = Ids?.includes('azuread');
$: isGoogle = Ids?.includes('google');
async function login(nhost: NhostClient, provider: Provider) {
  const { providerUrl } = await nhost.auth.connectProvider({
    provider,
  });
}
function click(event: MouseEvent, provider: Provider) {
  login(nhost, provider);
}
</script>

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
