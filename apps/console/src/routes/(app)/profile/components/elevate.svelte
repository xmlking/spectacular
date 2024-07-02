<script lang="ts">
import { handleMessage } from '$lib/components/layout/toast-manager';
import { getNhostClient } from '$lib/stores/nhost';
import { getToastStore } from '@skeletonlabs/skeleton';
import { Alerts } from '@spectacular/skeleton/components/form';

// Variables
let message: App.Superforms.Message | undefined;
let errors: string[] = [];
const toastStore = getToastStore();
const { elevate } = getNhostClient();

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
<Alerts errors={errors} message={message} />
<div class="card p-4">
  <!-- <span>Elevated permissions: {String(elevated)}</span> -->
  <button type="button" class="btn variant-filled" on:click={handleElevate} >Elevate</button>
</div>
