<script lang="ts">
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
	import {
		ArrowRightToBracketOutline,
		BellOutline,
		PieChartSolid,
		ClipboardListOutline,
		CogOutline,
		ComputerSpeakerOutline,
		DrawSquareOutline,
		MobilePhoneOutline,
		QuestionCircleOutline,
		ScaleBalancedOutline,
		ShieldCheckOutline,
		StarOutline,
		UsersGroupOutline,
		UsersOutline
	} from 'flowbite-svelte-icons';
	import { page } from '$app/stores';
	import { Drawer } from '$lib/components';
	import { sidebarOpen } from '$lib/stores/sidebar.store';

	// custom style
	let spanClass = 'flex-1 ml-3 whitespace-nowrap';
	let asideClass = 'w-64 hidden sm:block overflow-y-auto bg-gray-50 dark:bg-gray-700';
	// change dark:bg-gray-800 -> dark:bg-gray-700
	let divClass = 'overflow-y-auto py-4 px-3 rounded dark:bg-gray-700';

	$: activeUrl = $page.url.pathname;
</script>

<Drawer style="view-transition-name: side-menu;" bind:show={$sidebarOpen} {asideClass}>
	<Sidebar {activeUrl}>
		<SidebarWrapper {divClass}>
			<SidebarGroup>
				<!--				<SidebarBrand site={{	name: 'Datablocks',href: '/',img: '/logos/6-1.svg' }}/>-->
				<SidebarItem href="/dashboard" label="Dashboard">
					<svelte:fragment slot="icon"
						><PieChartSolid size="md" class="mr-2 text-red-500 dark:text-blue-500" />
						<!-- <ChartPieOutline" class="mr-2 text-red-500 dark:text-blue-500" /> -->
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Reports" {spanClass}>
					<svelte:fragment slot="icon"><DrawSquareOutline /></svelte:fragment>
					<svelte:fragment slot="subtext">
						<span
							class="ml-3 inline-flex items-center justify-center rounded-full bg-gray-200 px-2 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
							>Pro</span
						>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Notifications" {spanClass}>
					<svelte:fragment slot="icon"><BellOutline /></svelte:fragment>
					<svelte:fragment slot="subtext">
						<span
							class="ml-3 inline-flex h-3 w-3 items-center justify-center rounded-full bg-blue-200 p-3 text-sm font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-200"
							>3</span
						>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Policies" href="/dashboard/policies">
					<svelte:fragment slot="icon"><ShieldCheckOutline /></svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Golden Rule" href="/dashboard/rules">
					<svelte:fragment slot="icon"><ScaleBalancedOutline /></svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Devices" {spanClass} href="/dashboard/devices">
					<svelte:fragment slot="icon"><MobilePhoneOutline /></svelte:fragment>
					<svelte:fragment slot="subtext">
						<span
							class="ml-3 inline-flex items-center justify-center rounded-full bg-blue-200 px-2 text-sm font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-200"
							>beta</span
						>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Device Pools" href="/dashboard/pools">
					<svelete:fragment slot="icon"><ComputerSpeakerOutline /></svelete:fragment>
				</SidebarItem>
				<SidebarItem label="Users" href="/dashboard/users">
					<svelte:fragment slot="icon"><UsersOutline /></svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Tenants" href="/dashboard/tenants">
					<svelte:fragment slot="icon"><UsersGroupOutline /></svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Settings" href="/dashboard/settings">
					<svelte:fragment slot="icon"><CogOutline /></svelte:fragment>
				</SidebarItem>
				<SidebarItem
					href="/auth/signout?callbackUrl=/blog"
					data-sveltekit-preload-data="off"
					data-sveltekit-preload-code="off"
					label="Sign Out"
				>
					<svelte:fragment slot="icon"><ArrowRightToBracketOutline /></svelte:fragment>
				</SidebarItem>
			</SidebarGroup>
			<SidebarGroup border>
				<SidebarItem label="Upgrade to Pro">
					<svelte:fragment slot="icon"><StarOutline /></svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Documentation">
					<svelte:fragment slot="icon"><ClipboardListOutline /></svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Help">
					<svelte:fragment slot="icon"><QuestionCircleOutline /></svelte:fragment>
				</SidebarItem>
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>
</Drawer>
