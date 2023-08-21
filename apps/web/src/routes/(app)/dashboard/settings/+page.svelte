<script lang="ts">
	import { addToast, ToastLevel } from '$lib/components/toast';
	import { Button, Heading, P } from 'flowbite-svelte';
</script>

<svelte:head>
	<title>Dashboard | Settings</title>
	<meta name="description" content="Dashboard Settings" />
</svelte:head>

<Heading tag="h4" class="pb-5">Feature-Flags</Heading>
<P
	>Feature flags enable experimental features in Console.<br />
	These features may be actively in development or in beta status.</P
>
<!-- TODO: like Hasura Feature-Flags -->

<Heading tag="h4" class="pb-5">Other Settings</Heading>
<Button
	on:click={() =>
		addToast({
			message: 'Hello, World!',
			dismissible: false,
			duration: 6000,
			type: ToastLevel.Error
		})}>Error</Button
>
<Button
	on:click={() =>
		addToast({
			message: 'Hello, World!',
			dismissible: true,
			duration: 6000,
			type: ToastLevel.Warning
		})}>Warning</Button
>
<Button
	on:click={() =>
		addToast({
			message: 'Hello, World!',
			dismissible: false,
			duration: 6000,
			type: ToastLevel.Success
		})}>Success</Button
>
<Button
	on:click={() =>
		addToast({
			message: 'Hello, World!',
			dismissible: true,
			duration: 6000,
			type: ToastLevel.Info
		})}>Info</Button
>
