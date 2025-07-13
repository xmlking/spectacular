<script lang="ts">
import { Logger } from '@repo/utils';
// import { createEnableMfaMachine, generateQrCodePromise } from '@nhost/nhost-js';
import { getToastStore } from '@skeletonlabs/skeleton';
import { getNhostClient } from '$lib/stores/nhost';

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
