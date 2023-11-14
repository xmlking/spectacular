<script>
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';

	/** @type {import('./$types').Actions} */
	export let form;
</script>

<svelte:head>
	<title>Sign In</title>
</svelte:head>

<h1 class="text-center text-2xl font-semibold">Sign in with a magick link</h1>

{#if form?.error}
	<p class="mt-3 text-center font-semibold text-red-500">{form?.error}</p>
{/if}

{#if form?.isSuccess}
	<p class="mt-3 text-center font-semibold text-green-500">
		Click the link in the email to finish the sign in process
	</p>
{/if}

<form class="mx-auto max-w-xl space-y-5" method="POST">
	<Input label="Email" id="email" name="email" type="email" required />
	<Button class="w-full" type="submit">Sign In</Button>
</form>
