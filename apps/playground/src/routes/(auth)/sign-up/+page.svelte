<script lang="ts">
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';
	import SignIn from '$lib/components/auth/sign-in.svelte';
	import SignUp from '$lib/components/auth/sign-up.svelte';
	import LL from '$lib/i18n/i18n-svelte';

	export let data;

	//let tab: string = $page.params.tab;
	//let tabSet: string = tab === 'sign-up' ? 'signUp' : 'signIn';
	let tabSet: string = 'signUp';
</script>

<TabGroup justify="justify-center">
	<Tab bind:group={tabSet} name="signInTab" value={'signIn'}>{$LL.auth.labels.signin()}</Tab>
	<Tab bind:group={tabSet} name="signUpTab" value={'signUp'}>{$LL.auth.labels.signup()}</Tab>
	<!-- Tab Panels --->
	<svelte:fragment slot="panel">
		{#if tabSet === 'signIn'}
			<SignIn {data} />
		{:else if tabSet === 'signUp'}
			<SignUp {data} />
		{/if}
	</svelte:fragment>
</TabGroup>
