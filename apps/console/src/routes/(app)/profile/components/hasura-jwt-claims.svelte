<script lang="ts">
import * as m from '$i18n/messages';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { nhost } from '$lib/stores/user';
import { elevate, elevated } from '$lib/stores/user';
import { AppBar, getToastStore } from '@skeletonlabs/skeleton';
import { Alerts } from '@spectacular/skeleton/components/form';
import { UserRound } from 'lucide-svelte';
import SuperDebug from 'sveltekit-superforms';

// Variables
const claims = nhost.auth.getHasuraClaims();
let message: App.Superforms.Message | undefined;
const errors: string[] = [];
const toastStore = getToastStore();

// Functions
async function handleElevate() {
  const error = await elevate();
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
  }
}
</script>

<!-- Form Level Errors / Messages -->
<Alerts {errors} {message} />

<div class="card">
  <header class="card-header">{m.profile_hasura_jwt_label()}</header>
  <AppBar>
    <svelte:fragment slot="lead"><UserRound /></svelte:fragment>
   <h3 class="h3"><span class="gradient-heading">Elevation status: {$elevated}</span></h3>
    <svelte:fragment slot="trail">
      <button
        type="button"
        class="variant-filled-primary btn"
        on:click={() => nhost.auth.refreshSession()}
        >{m.profile_nhost_refresh_session()}</button
      >
      <button type="button" class="btn variant-filled" on:click={handleElevate}
        >Elevate</button
      >
    </svelte:fragment>
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
