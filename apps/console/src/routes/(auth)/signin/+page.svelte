<script lang="ts">
import Divider from './components/divider.svelte';
import PasswordSigninForm from './components/password.svelte';
import PasswordlessSigninForm from './components/passwordless.svelte';
import SocialSigninForm from './components/social.svelte';
import { Logger } from '@spectacular/utils';
import { getNhostClient } from '$lib/stores/nhost';
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
import { i18n } from '$lib/i18n';
import { ROUTE_DASHBOARD } from '$lib/constants';

const log = new Logger('auth:signin:browser');

export let data;

// Variables
const nhost = getNhostClient();

onMount(async () => {
  const isAuthenticated = nhost.auth.isAuthenticated();
  if (isAuthenticated) {
    await goto(i18n.resolveRoute(ROUTE_DASHBOARD));
  }
});
</script>

<svelte:head>
  <title>Datablocks | Signin</title>
  <meta name="description" content="Signin Form" />
</svelte:head>

<PasswordSigninForm />
{#if data.flags.showMagicLink}
<Divider>Or</Divider>
<PasswordlessSigninForm />
{/if}
{#if data.flags.showSocial}
<Divider>Or continue with</Divider>
<SocialSigninForm />
{/if}
