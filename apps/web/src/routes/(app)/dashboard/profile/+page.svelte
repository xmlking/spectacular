<script lang="ts">
	import { page } from '$app/stores';
	import { Avatar } from 'flowbite-svelte';
</script>

<svelte:head>
	<title>Dashboard/Profile</title>
	<meta name="description" content="Dashboard Profile" />
</svelte:head>

{#if $page.data.session}
	<h2 class="pb-4 text-2xl font-bold text-gray-800 dark:text-white">Profile</h2>
	<div class="relative overflow-x-auto">
		<Avatar
			src={$page.data.session.user?.image ?? '/images/profile-picture-3.webp'}
			referrerpolicy="no-referrer"
		/>
		<table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
			<tbody>
				{#each Object.entries($page.data.session.user ?? {}) as [key, value]}
					<tr class="border-b bg-white dark:border-gray-800 dark:bg-gray-900">
						<th
							scope="row"
							class="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white"
						>
							{key}
						</th>
						<td class="px-6 py-2">
							{value}
						</td>
					</tr>
				{/each}
				{#each Object.entries($page.data.session ?? {}) as [key, value]}
					{#if key != 'user'}
						<tr class="border-b bg-white dark:border-gray-800 dark:bg-gray-900">
							<th
								scope="row"
								class="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white"
							>
								{key}
							</th>
							<td class="px-6 py-2">
								{value}
							</td>
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>
	</div>

	<!-- <div>
		<pre>{JSON.stringify($page.data.session, null, 4)}</pre>
	</div> -->
{/if}
