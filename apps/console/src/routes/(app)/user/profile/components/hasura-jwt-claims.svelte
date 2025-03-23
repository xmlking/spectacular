<script lang="ts">
import { invalidate } from '$app/navigation';
import * as m from '$i18n/messages';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { getNhostClient } from '$lib/stores/nhost';
import { AppBar, getToastStore } from '@skeletonlabs/skeleton';
import { Alerts } from '$lib/ui/components/form';
import { UserRound } from 'lucide-svelte';
import SuperDebug from 'sveltekit-superforms';

// Variables
let message: App.Superforms.Message | undefined = $state();
const errors: string[] = [];
const toastStore = getToastStore();
const nhost = getNhostClient();
const { elevated } = nhost;
let claims = $state(nhost.auth.getHasuraClaims());

// Functions
async function handleRefresh() {
  await nhost.auth.refreshSession();
  // update new claims
  claims = nhost.auth.getHasuraClaims();
}

async function handleElevate() {
  const error = await nhost.elevate();
  if (error) {
    errors.push(error.message);
  } else {
    message = {
      message: 'elevated successfully',
      hideDismiss: true,
      timeout: 10000,
      type: 'success',
    };
    handleMessage(message, toastStore);
    // update new claims
    claims = nhost.auth.getHasuraClaims();
  }
}
</script>

<!-- Form Level Errors / Messages -->
<Alerts {errors} {message} />

<div class="card">
  <header class="card-header">
    <div class="text-xl">{m.profile_hasura_jwt_claims_label()}</div>
    <!-- <div>Here you can see your session claims</div> -->
  </header>
  <AppBar>
    {#snippet lead()}
        <UserRound />
      {/snippet}
   <h3 class="h3"><span class="gradient-heading">Elevation status: {$elevated}</span></h3>
    {#snippet trail()}
      
        <button
          type="button"
          class="variant-filled-primary btn"
          onclick={handleRefresh}
          >{m.profile_nhost_refresh_session_label()}</button
        >
        <button type="button" class="btn variant-filled" onclick={handleElevate}
          >Elevate</button
        >
      
      {/snippet}
  </AppBar>
  <section class="p-4 space-y-4">
    <SuperDebug label="Claims" data={claims} />
  </section>
</div>

<style lang="postcss">
  .gradient-heading {
    @apply bg-clip-text text-transparent box-decoration-clone;
    /* Direction */
    @apply bg-gradient-to-br;
    /* Color Stops */
    @apply from-primary-500 via-tertiary-500 to-secondary-500;
  }
</style>
