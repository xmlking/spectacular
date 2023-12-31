<script lang="ts">
	import { dev } from '$app/environment';
	import { page } from '$app/stores';

	// we don't want to use <svelte:window bind:online> here, because we only care about the online
	// state when the page first loads
	let online = typeof navigator !== 'undefined' ? navigator.onLine : true;

	async function goBack() {
		history.back();
	}
</script>

<svelte:head>
	<title>Error: {$page.status} : {$page.error.message}</title>
</svelte:head>

<div class="flex min-h-full flex-col bg-white pb-12 pt-16">
	<main
		class="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-4 sm:px-6 lg:px-8"
	>
		<div class="flex flex-shrink-0 justify-center">
			<a href="/" class="inline-flex">
				<span class="sr-only">TrustZero</span>
				<img
					class="h-12 w-auto"
					src="https://tailwindui.com/img/logos/workflow-mark.svg?color=teal&shade=600"
					alt=""
				/>
			</a>
		</div>
		<div class="py-16">
			<div class="text-center">
				<p class="text-sm font-semibold uppercase tracking-wide text-teal-600">
					{$page.status} error
				</p>
				<h1 class="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
					Something's wrong here.
				</h1>
				<p class="mt-2 text-base text-gray-500">
					Sorry, we couldn’t serve the page you’re looking for.
				</p>
				<div class="mt-6">
					<a
						href={'#'}
						on:click={goBack}
						class="text-base font-medium text-teal-600 hover:text-teal-500"
						>Go back<span aria-hidden="true"> &rarr;</span></a
					>
				</div>
			</div>
		</div>
	</main>
</div>

<!--<p>{$page.error?.message}</p>-->

<!--{#if dev && $page.error.stack}-->
<!--	<pre>{$page.error.stack}</pre>-->
<!--{/if}-->

<div class="text-center text-gray-500">
	{#if online}
		{#if $page.error.message}
			<p class="error">{$page.status}: {$page.error.message}</p>
		{:else}
			<p class="error">Encountered a {$page.status} error</p>
		{/if}

		{#if $page.status >= 500}
			{#if dev && $page.error.stack}
				<pre>{$page.error.stack}</pre>
			{:else}
				<p>Please try reloading the page.</p>
			{/if}
		{/if}
	{:else}
		<h1>It looks like you're offline</h1>

		<p>Reload the page once you've found the internet.</p>
	{/if}
</div>

<style lang="postcss">
	.error {
		@apply text-gray-600;
	}
</style>
