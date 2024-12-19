<script lang="ts">
import { Icon } from '@spectacular/skeleton/components/icons';
import { Github } from 'lucide-svelte';
import { getNhostClient } from '$lib/stores/nhost';
import { Logger } from '@spectacular/utils';
import { ROUTE_DASHBOARD } from '$lib/constants';
import { page } from '$app/stores';

const log = new Logger('auth:signin:social:browser');

// Variables
const nhost = getNhostClient();

const locale = 'en';

// Reactivity
$: urlOrigin = new URL($page.url).origin;
$: redirectTo = `${urlOrigin}${ROUTE_DASHBOARD}`;
$: log.debug('redirectTo', redirectTo);
</script>

<!-- Signin with social -->
<form method="POST">
  <div class="flex flex-row justify-evenly">
    <button type="button"  on:click={() => { nhost.auth.signIn({ provider: 'google', options: {redirectTo, locale} }) }} class="variant-filled-warning btn-icon"
      ><Icon name="google" /></button
    >
    <button type="button" on:click={() => { nhost.auth.signIn({ provider: 'github', options: {redirectTo, locale} }) }}  class="variant-filled-secondary btn-icon"><Github /></button>
    <button type="button" on:click={() => { nhost.auth.signIn({ provider: 'azuread', options: {redirectTo, locale} }) }} class="variant-filled-error btn-icon"
      ><Icon name="microsoft" /></button
    >
  </div>
</form>






<!--
<div class="flex flex-col md:flex-row justify-evenly space-x-1 space-y-4">
	<button type="button" class="btn variant-filled-warning">
		<span><Icon name="google" /></span>
		<span>Google</span>
	</button>
	<button type="button" class="btn variant-filled-success">
		<span><Github /></span>
		<span>GitHub</span>
	</button>
	<button type="button" class="btn variant-filled-error">
		<span><Icon name="microsoft" /></span>
		<span>AzureAD</span>
	</button>
		<button type="button" class="btn variant-filled-error">
		<span><Icon name="microsoft" /></span>
		<span>PingID</span>
	</button>
</div>
-->
