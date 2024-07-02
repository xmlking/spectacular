<script lang="ts">
import PasswordSigninForm from './components/password.svelte';
import PasswordlessSigninForm from './components/passwordless.svelte';
import SocialSigninForm from './components/social.svelte';
import Divider from './components/divider.svelte';

export let data;
</script>

<svelte:head>
  <title>Datablocks | Signin</title>
  <meta name="description" content="Signin Form" />
</svelte:head>

<PasswordSigninForm />
<Divider>Or</Divider>
<PasswordlessSigninForm />
<Divider>Or continue with</Divider>
<SocialSigninForm />
