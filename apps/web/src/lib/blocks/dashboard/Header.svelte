<script lang="ts">
	import { page } from '$app/stores';
	import { Hamburger } from '$lib/components';
	import {
		Avatar,
		Dropdown,
		DropdownDivider,
		DropdownHeader,
		DropdownItem,
		Navbar,
		NavBrand,
		NavHamburger,
		NavLi,
		NavUl
	} from 'flowbite-svelte';

	let path: string;
	$: path = $page.url.pathname;

	export let user:
		| {
				name?: string | null;
				email?: string | null;
				image?: string | null;
		  }
		| undefined;
</script>

<Navbar let:hidden let:toggle fluid={true} border={false} color="light">
	<div class="flex items-center">
		<Hamburger />
		<NavBrand href="/">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				class="ml-3 mr-3 h-10 w-10 rounded-full bg-indigo-500 p-2 text-white"
				viewBox="0 0 24 24"
			>
				<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
			</svg>
			<!--			<img src="/logos/6-1.svg" class="ml-3 mr-3 h-6 sm:h-9" alt="Datablocks Logo" />-->
			<span class="self-center whitespace-nowrap text-xl font-semibold">
				<span class="text-[#b1171c] dark:text-pink-500">Data</span><span
					class="text-[#515151] dark:text-white">Blocks</span
				>
			</span>
		</NavBrand>
	</div>
	<!--
	<div>
		<Button color="none" data-collapse-toggle="mobile-menu-3" aria-controls="mobile-menu-3" aria-expanded="false" class="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 mr-1">
			<Search variation="solid" />
		</Button>
		<div class="hidden relative md:block">
			<div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
				<Search />
			</div>
			<Input id="search-navbar" class="pl-10" placeholder="Search..." />
		</div>
	</div>
	-->
	<!-- keep NavHamburger here, to keep Hamburger to left on small screen-->
	<NavHamburger on:click={toggle} />

	<!-- TODO: dummy space to push -NavUl close to Dropdown -->
	<div />
	<div />
	<div />
	<div />
	<div />
	<div />
	<div />
	<div />
	<div />
	<div />
	<div />
	<NavUl {hidden}>
		<NavLi href="/dashboard" active={path == '/dashboard'}>Dashboard</NavLi>
		<NavLi
			data-sveltekit-preload-data=""
			href="/dashboard/policies"
			active={path == '/dashboard/policies'}>Policies</NavLi
		>
		<NavLi href="/dashboard/users" active={path == '/dashboard/users'}>Users</NavLi>
		<NavLi data-sveltekit-preload-data="" href="/play" active={path == '/play'}
			>Playground</NavLi
		>
	</NavUl>

	{#if user}
		<!-- TODO: see if we can use  `hidden` prop to hide Dropdown on small screen-->
		<div class="hidden md:block">
			<Avatar
				src={user.image ?? '/images/profile-picture-3.webp'}
				size="md"
				border
				referrerpolicy="no-referrer">{user.name?.substring(0, 2).toUpperCase()}</Avatar
			>
			<Dropdown arrowIcon={false} inline={true}>
				<DropdownHeader>
					<span class="block truncate text-sm font-medium" aria-label={user.email}
						>{user.name}</span
					>
				</DropdownHeader>
				<DropdownItem><a href="/dashboard/profile">Profile</a></DropdownItem>
				<DropdownItem><a href="/dashboard/settings">Settings</a></DropdownItem>
				<DropdownDivider />
				<DropdownItem>
					<a
						href="/auth/signout?callbackUrl=/blog"
						data-sveltekit-preload-data="off"
						data-sveltekit-preload-code="off">Sign Out</a
					>
				</DropdownItem>
			</Dropdown>
		</div>
	{/if}
</Navbar>
