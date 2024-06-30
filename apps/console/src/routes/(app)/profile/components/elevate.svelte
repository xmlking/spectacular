<script lang="ts">
import type { GetUser$result } from '$houdini';
import { elevate } from '$lib/stores/user';
import type { AuthErrorPayload } from '@nhost/nhost-js';

export let message: App.Superforms.Message | undefined;
export let errors: string[];

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
  }
}
</script>

<div class="card p-4">
  <!-- <span>Elevated permissions: {String(elevated)}</span> -->
  <button type="button" class="btn variant-filled" on:click={handleElevate} >Elevate</button>
</div>
