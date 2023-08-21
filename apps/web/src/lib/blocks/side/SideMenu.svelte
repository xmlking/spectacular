<script lang="ts">
	import { page } from '$app/stores';
	import { Drawer } from '$lib/components';
	import { sidebarOpen } from '$lib/stores/sidebar.store';
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
	import {
		ArrowRightOnRectangle,
		Bell,
		ChartPie,
		ClipboardDocumentList,
		Cog,
		DevicePhoneMobile,
		HandRaised,
		RectangleGroup,
		Scale,
		ShieldCheck,
		Squares2x2,
		Star,
		UserGroup,
		Users
	} from 'svelte-heros-v2';

	// custom style
	let spanClass = 'flex-1 ml-3 whitespace-nowrap';
	let asideClass = 'w-64 hidden sm:block overflow-y-auto bg-gray-50 dark:bg-gray-700';
	// change dark:bg-gray-800 -> dark:bg-gray-700
	let divClass = 'overflow-y-auto py-4 px-3 rounded dark:bg-gray-700';

	$: activeUrl = $page.url.pathname;
</script>

<Drawer bind:show={$sidebarOpen} {asideClass}>
	<Sidebar>
		<SidebarWrapper {divClass}>
			<SidebarGroup>
				<!--				<SidebarBrand site={{	name: 'Datablocks',href: '/',img: '/logos/6-1.svg' }}/>-->
				<SidebarItem
					href="/dashboard"
					icon={{ name: ChartPie, class: 'text-red-500 mr-2 dark:text-blue-500' }}
					label="Dashboard"
				>
					<svelte:fragment slot="icon"
						><ChartPie class="mr-2 text-red-500 dark:text-blue-500" /></svelte:fragment
					>
				</SidebarItem>
				<SidebarItem label="Reports" {spanClass}>
					<svelte:fragment slot="icon"><Squares2x2 /></svelte:fragment>
					<svelte:fragment slot="subtext">
						<span
							class="ml-3 inline-flex items-center justify-center rounded-full bg-gray-200 px-2 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
							>Pro</span
						>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Notifications" {spanClass}>
					<svelte:fragment slot="icon"><Bell /></svelte:fragment>
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
					active={activeUrl === '/dashboard/policies'}
				>
					<svelte:fragment slot="icon"><ShieldCheck /></svelte:fragment>
				</SidebarItem>
				<SidebarItem
					label="Golden Rule"
					href="/dashboard/rules"
					active={activeUrl === '/dashboard/rules'}
				>
					<svelte:fragment slot="icon"><Scale /></svelte:fragment>
				</SidebarItem>
				<SidebarItem
					label="Devices"
					{spanClass}
					href="/dashboard/devices"
					active={activeUrl === 'dashboard/devices'}
				>
					<svelte:fragment slot="icon"><DevicePhoneMobile /></svelte:fragment>
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
					active={activeUrl === 'dashboard/pool'}
				>
					<svelete:fragment slot="icon"><RectangleGroup /></svelete:fragment>
				</SidebarItem>
				<SidebarItem
					label="Users"
					href="/dashboard/users"
					active={activeUrl === '/dashboard/users'}
				>
					<svelte:fragment slot="icon"><Users /></svelte:fragment>
				</SidebarItem>
				<SidebarItem
					label="Tenants"
					href="/dashboard/tenants"
					active={activeUrl === '/dashboard/tenants'}
				>
					<svelte:fragment slot="icon"><UserGroup /></svelte:fragment>
				</SidebarItem>
				<SidebarItem
					label="Settings"
					href="/dashboard/settings"
					active={activeUrl === '/dashboard/settings'}
				>
					<svelte:fragment slot="icon"><Cog /></svelte:fragment>
				</SidebarItem>
				<SidebarItem
					href="/auth/signout?callbackUrl=/blog"
					data-sveltekit-preload-data="off"
					data-sveltekit-preload-code="off"
					label="Sign Out"
				>
					<svelte:fragment slot="icon"><ArrowRightOnRectangle /></svelte:fragment>
				</SidebarItem>
			</SidebarGroup>
			<SidebarGroup border>
				<SidebarItem label="Upgrade to Pro">
					<svelte:fragment slot="icon"><Star /></svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Documentation">
					<svelte:fragment slot="icon"><ClipboardDocumentList /></svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Help">
					<svelte:fragment slot="icon"><HandRaised /></svelte:fragment>
				</SidebarItem>
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>
</Drawer>
