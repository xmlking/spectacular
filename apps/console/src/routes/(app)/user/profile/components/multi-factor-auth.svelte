<script lang="ts">
import { getNhostClient } from '$lib/stores/nhost';
// import { createEnableMfaMachine, generateQrCodePromise } from '@nhost/nhost-js';
import { getToastStore } from '@skeletonlabs/skeleton';
import { Logger } from '@spectacular/utils';

// Variables
const log = new Logger('user:profile:mfa:browser');
const toastStore = getToastStore();
const nhost = getNhostClient();

// const machine =  createEnableMfaMachine(nhost.auth.client)
//  generateQrCodePromise(machine)
</script>

<div class="card p-4">
  <p>TODO: MFA</p>
</div>
