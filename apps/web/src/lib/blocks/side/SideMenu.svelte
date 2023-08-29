<script lang="ts">
	import { page } from '$app/stores';
	import { Drawer } from '$lib/components';
	import { sidebarOpen } from '$lib/stores/sidebar.store';
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
	import { Icon } from 'flowbite-svelte-icons';

	// custom style
	let spanClass = 'flex-1 ml-3 whitespace-nowrap';
	let asideClass = 'w-64 hidden sm:block overflow-y-auto bg-gray-50 dark:bg-gray-700';
	// change dark:bg-gray-800 -> dark:bg-gray-700
	let divClass = 'overflow-y-auto py-4 px-3 rounded dark:bg-gray-700';

	$: activeUrl = $page.url.pathname;
</script>

<Drawer bind:show={$sidebarOpen} {asideClass}>
	<Sidebar {activeUrl}>
		<SidebarWrapper {divClass}>
			<SidebarGroup>
				<!--				<SidebarBrand site={{	name: 'Datablocks',href: '/',img: '/logos/6-1.svg' }}/>-->
				<SidebarItem
					href="/dashboard"
					label="Dashboard"
				>
					<svelte:fragment slot="icon"
						><Icon name="chart-pie-outline" size="md" class="mr-2 text-red-500 dark:text-blue-500" />
						<!-- <Icon name="chart-pie-outline" class="mr-2 text-red-500 dark:text-blue-500" /> -->
						</svelte:fragment
					>
				</SidebarItem>
				<SidebarItem label="Reports" {spanClass}>
					<svelte:fragment slot="icon"><Icon name="draw-square-outline" /></svelte:fragment>
					<svelte:fragment slot="subtext">
						<span
							class="ml-3 inline-flex items-center justify-center rounded-full bg-gray-200 px-2 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
							>Pro</span
						>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Notifications" {spanClass}>
					<svelte:fragment slot="icon"><Icon name="bell-outline" /></svelte:fragment>
					<svelte:fragment slot="subtext">
						<span
							class="ml-3 inline-flex h-3 w-3 items-center justify-center rounded-full bg-blue-200 p-3 text-sm font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-200"
							>3</span
						>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem
					label="Policies"
					href="/dashboard/policies"
				>
					<svelte:fragment slot="icon"><Icon name="shield-check-outline" /></svelte:fragment>
				</SidebarItem>
				<SidebarItem
					label="Golden Rule"
					href="/dashboard/rules"
				>
					<svelte:fragment slot="icon"><Icon name="scale-balanced-outline" /></svelte:fragment>
				</SidebarItem>
				<SidebarItem
					label="Devices"
					{spanClass}
					href="/dashboard/devices"
				>
					<svelte:fragment slot="icon"><Icon name="mobile-phone-outline" /></svelte:fragment>
					<svelte:fragment slot="subtext">
						<span
							class="ml-3 inline-flex items-center justify-center rounded-full bg-blue-200 px-2 text-sm font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-200"
							>beta</span
						>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem
					label="Device Pools"
					href="/dashboard/pools"
				>
					<svelete:fragment slot="icon"><Icon name="computer-speaker-outline" /></svelete:fragment>
				</SidebarItem>
				<SidebarItem
					label="Users"
					href="/dashboard/users"
				>
					<svelte:fragment slot="icon"><Icon name="users-outline" /></svelte:fragment>
				</SidebarItem>
				<SidebarItem
					label="Tenants"
					href="/dashboard/tenants"
				>
					<svelte:fragment slot="icon"><Icon name="users-group-outline" /></svelte:fragment>
				</SidebarItem>
				<SidebarItem
					label="Settings"
					href="/dashboard/settings"
				>
					<svelte:fragment slot="icon"><Icon name="cog-outline" /></svelte:fragment>
				</SidebarItem>
				<SidebarItem
					href="/auth/signout?callbackUrl=/blog"
					data-sveltekit-preload-data="off"
					data-sveltekit-preload-code="off"
					label="Sign Out"
				>
					<svelte:fragment slot="icon"><Icon name="arrow-right-to-bracket-outline" /></svelte:fragment>
				</SidebarItem>
			</SidebarGroup>
			<SidebarGroup border>
				<SidebarItem label="Upgrade to Pro">
					<svelte:fragment slot="icon"><Icon name="star-outline" /></svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Documentation">
					<svelte:fragment slot="icon"><Icon name="clipboard-list-outline" /></svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Help">
					<svelte:fragment slot="icon"><Icon name="question-circle-outline" /></svelte:fragment>
				</SidebarItem>
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>
</Drawer>
