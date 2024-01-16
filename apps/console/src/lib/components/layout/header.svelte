<script lang="ts">
	import type { DrawerSettings, ModalSettings } from '@skeletonlabs/skeleton';
	import type { SubmitFunction } from '@sveltejs/kit';
	import {
		AppBar,
		LightSwitch,
		getModalStore,
		popup,
		getDrawerStore
	} from '@skeletonlabs/skeleton';
	import {
		Home,
		BookText,
		PersonStanding,
		PhoneOutgoing,
		Scroll,
		Menu,
		Palette,
		Github,
		Search,
		ChevronDown
	} from 'lucide-svelte';
	import LogoIcon from '@spectacular/skeleton/components/logos/LogoIcon.svelte';
	import type { User } from '@nhost/nhost-js';
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { storeTheme } from '$lib/stores/stores';
	import LangSwitch from '$lib/components/layout/lang-switch.svelte';
	const drawerStore = getDrawerStore();

	export let user: User | undefined;

	// Local
	let isOsMac = false;
	const modalStore = getModalStore();

	// Set Search Keyboard Shortcut
	if (browser) {
		let os = navigator.userAgent;
		isOsMac = os.search('Mac') !== -1;
	}

	// Drawer Handler
	function drawerOpen(): void {
		const s: DrawerSettings = { id: 'doc-sidenav' };
		drawerStore.open(s);
	}

	// Search
	function triggerSearch(): void {
		const modal: ModalSettings = {
			type: 'component',
			component: 'modalSearch',
			position: 'item-start'
		};
		modalStore.trigger(modal);
	}

	// Keyboard Shortcut (CTRL/⌘+K) to Focus Search
	function onWindowKeydown(e: KeyboardEvent): void {
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			// Prevent default browser behavior of focusing URL bar
			e.preventDefault();
			// If modal currently open, close modal (allows to open/close search with CTRL/⌘+K)
			$modalStore.length ? modalStore.close() : triggerSearch();
		}
	}

	const themes = [
		{ type: 'skeleton', name: 'Skeleton', icon: '💀' },
		{ type: 'wintry', name: 'Wintry', icon: '🌨️' },
		{ type: 'modern', name: 'Modern', icon: '🤖' },
		{ type: 'rocket', name: 'Rocket', icon: '🚀' },
		{ type: 'seafoam', name: 'Seafoam', icon: '🧜‍♀️' },
		{ type: 'vintage', name: 'Vintage', icon: '📺' },
		{ type: 'sahara', name: 'Sahara', icon: '🏜️' },
		{ type: 'hamlindigo', name: 'Hamlindigo', icon: '👔' },
		{ type: 'gold-nouveau', name: 'Gold Nouveau', icon: '💫' },
		{ type: 'crimson', name: 'Crimson', icon: '⭕' },
		{ type: 'custom', name: 'Custom', icon: '🎆', badge: 'New' }
	];

	const setTheme: SubmitFunction = ({ formData }) => {
		const theme = formData.get('theme')?.toString();

		if (theme) {
			document.body.setAttribute('data-theme', theme);
			$storeTheme = theme;
		}
	};
</script>

<!-- NOTE: using stopPropagation to override Chrome for Windows search shortcut -->
<svelte:window on:keydown|stopPropagation={onWindowKeydown} />
<AppBar shadow="shadow-2xl" slotTrail="!space-x-2">
	<svelte:fragment slot="lead">
		<div class="flex items-center space-x-4">
			<!-- Hamburger Menu -->
			<button on:click={drawerOpen} class="btn-icon btn-icon-sm lg:!hidden">
				<Menu />
			</button>
			<!-- Logo -->
			<a class="w-[32px] overflow-hidden lg:!ml-0 lg:w-auto" href="/" title="Go to Homepage">
				<LogoIcon />
			</a>
			<h2 class="hidden font-serif text-2xl md:block">Datablocks</h2>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<!-- Login -->
		<div class="ml-10 space-x-4">
			{#if user}
				<form action="/auth/sign-out" method="post">
					<button
						type="submit"
						class="inline-block rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-base font-medium text-white hover:bg-opacity-75"
					>
						Sign out
					</button>
				</form>
			{:else}
				<a
					href="/auth/sign-in"
					class="inline-block rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-base font-medium text-white hover:bg-opacity-75"
				>
					Sign in
				</a>
				<a
					href="/auth/sign-up"
					class="inline-block rounded-md border border-transparent bg-white px-4 py-2 text-base font-medium text-indigo-600 hover:bg-indigo-50"
				>
					Sign up
				</a>
			{/if}
		</div>
		<!-- Explore -->
		<div class="relative hidden lg:block">
			<!-- trigger -->
			<button
				class="btn hover:variant-soft-primary"
				use:popup={{ event: 'click', target: 'features' }}
			>
				<span>Explore</span>
				<ChevronDown size="20" class="opacity-50" />
			</button>
			<!-- popup -->
			<div class="card w-60 p-4 shadow-xl" data-popup="features">
				<nav class="list-nav">
					<ul>
						<li>
							<a href="/">
								<span class="w-6 text-center"><Home /> </span>
								<span>Homepage</span>
							</a>
						</li>
						<li>
							<a href="/docs/get-started">
								<span class="w-6 text-center"><BookText /></span>
								<span>Documentation</span>
							</a>
						</li>
						<li>
							<a href="/blog">
								<span class="w-6 text-center"><Scroll /></span>
								<span>Blog</span>
							</a>
						</li>
						<hr class="!my-4" />
						<li>
							<a href="/about">
								<span class="w-6 text-center"><PersonStanding /></span>
								<span>About</span>
							</a>
						</li>
						<li>
							<a href="/contact">
								<span class="w-6 text-center"><PhoneOutgoing size={20} /></span>
								<span>Contact</span>
							</a>
						</li>
					</ul>
				</nav>
				<!-- <div class="arrow bg-surface-100-800-token" /> -->
			</div>
		</div>
		<!-- Theme -->
		<div>
			<!-- trigger -->
			<button
				class="btn hover:variant-soft-primary"
				use:popup={{ event: 'click', target: 'theme', closeQuery: 'a[href]' }}
			>
				<Palette class="md:!hidden" />
				<span class="hidden md:inline-block">Theme</span>
				<ChevronDown size="20" class="opacity-50" />
			</button>
			<!-- popup -->
			<div class="card w-60 p-4 shadow-xl" data-popup="theme">
				<div class="space-y-4">
					<section class="flex items-center justify-between">
						<h6 class="h6">Mode</h6>
						<!-- dark mode -->
						<LightSwitch />
					</section>
					<hr />
					<section class="flex items-center justify-between">
						<h6 class="h6">Lang</h6>
						<!-- locale -->
						<LangSwitch />
					</section>
					<hr />
					<nav class="list-nav -m-4 max-h-64 overflow-y-auto p-4 lg:max-h-[500px]">
						<form action="/?/setTheme" method="POST" use:enhance={setTheme}>
							<ul>
								{#each themes as { icon, name, type, badge }}
									<li>
										<button
											class="option h-full w-full"
											type="submit"
											name="theme"
											value={type}
											class:bg-primary-active-token={$storeTheme === type}
										>
											<span>{icon}</span>
											<span class="flex-auto text-left">{name}</span>
											{#if badge}<span class="variant-filled-secondary badge"
													>{badge}</span
												>{/if}
										</button>
									</li>
								{/each}
							</ul>
						</form>
					</nav>
				</div>
				<!-- <div class="arrow bg-surface-100-800-token" /> -->
			</div>
		</div>

		<!-- Search -->
		<div class="md:ml-4 md:inline">
			<button
				class="variant-soft btn space-x-4 hover:variant-soft-primary"
				on:click={triggerSearch}
			>
				<Search size={15} />
				<small class="hidden md:inline-block">{isOsMac ? '⌘' : 'Ctrl'}+K</small>
			</button>
		</div>

		<!-- Social -->
		<section class="hidden space-x-1 sm:inline-flex">
			<a
				class="btn-icon hover:variant-soft-primary"
				href="https://github.com/xmlking/spectacular"
				target="_blank"
				rel="noreferrer"
			>
				<Github />
			</a>
		</section>
	</svelte:fragment>
</AppBar>
