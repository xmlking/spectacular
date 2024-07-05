<script lang="ts">
import Divider from './components/divider.svelte';
import PasswordSigninForm from './components/password.svelte';
import PasswordlessSigninForm from './components/passwordless.svelte';
import SocialSigninForm from './components/social.svelte';

export let data;
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
