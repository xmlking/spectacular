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
		CaretDownSolid,
		MagnifyingGlassSolid,
		GithubBrand,
		PaletteSolid,
		BarsSolid,
		HouseSolid,
		BookSolid,
		BullhornSolid,
		ScrewdriverWrenchSolid
	} from 'svelte-awesome-icons';
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import DocsIcon from '$lib/components/icons/Icon.svelte';
	import DocsLogoFull from '$lib/components/logos/LogoFull.svelte';
	import { storeTheme } from '$lib/stores/stores';
	import LocaleSwitcher from '$lib/components/LocaleSwitcher.svelte';
	const drawerStore = getDrawerStore();

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
		{ type: 'wintry', name: 'Wintry', icon: '🌨️', badge: 'New' },
		{ type: 'modern', name: 'Modern', icon: '🤖' },
		{ type: 'rocket', name: 'Rocket', icon: '🚀' },
		{ type: 'seafoam', name: 'Seafoam', icon: '🧜‍♀️' },
		{ type: 'vintage', name: 'Vintage', icon: '📺' },
		{ type: 'sahara', name: 'Sahara', icon: '🏜️' },
		{ type: 'hamlindigo', name: 'Hamlindigo', icon: '👔' },
		{ type: 'gold-nouveau', name: 'Gold Nouveau', icon: '💫' },
		{ type: 'crimson', name: 'Crimson', icon: '⭕' }
		// { type: 'seasonal', name: 'Seasonal', icon: '🎆' }
		// { type: 'test', name: 'Test', icon: '🚧' },
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

<AppBar
	shadow="shadow-2xl"
	gridColumns="grid-cols-3"
	slotDefault="place-self-center"
	slotTrail="place-content-end !space-x-2"
>
	<svelte:fragment slot="lead">
		<div class="flex items-center space-x-4">
			<!-- Hamburger Menu -->
			<button on:click={drawerOpen} class="btn-icon btn-icon-sm lg:!hidden">
				<BarsSolid size="24" />
			</button>
			<!-- Logo -->
			<a class="w-[32px] overflow-hidden lg:!ml-0 lg:w-auto" href="/" title="Go to Homepage">
				<DocsLogoFull />
			</a>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<!-- Explore -->
		<div class="relative hidden lg:block">
			<!-- trigger -->
			<button
				class="btn hover:variant-soft-primary"
				use:popup={{ event: 'click', target: 'features' }}
			>
				<span>Explore</span>
				<CaretDownSolid size="15" class="opacity-50" />
			</button>
			<!-- popup -->
			<div class="card w-60 p-4 shadow-xl" data-popup="features">
				<nav class="list-nav">
					<ul>
						<li>
							<a href="/">
								<span class="w-6 text-center"><HouseSolid /> </span>
								<span>Homepage</span>
							</a>
						</li>
						<li>
							<a href="/docs/get-started">
								<span class="w-6 text-center"><BookSolid /></span>
								<span>Documentation</span>
							</a>
						</li>
						<li>
							<a href="/blog">
								<span class="w-6 text-center"><BullhornSolid /></span>
								<span>Blog</span>
							</a>
						</li>
						<hr class="!my-4" />
						<li>
							<a href="/experiments/picture">
								<span class="w-6 text-center"
									><DocsIcon name="tailwind" width="w-5" height="h-5" /></span
								>
								<span>Picture</span>
							</a>
						</li>
						<li>
							<a href="/experiments/movies">
								<span class="w-6 text-center"
									><DocsIcon name="svelte" width="w-6" height="h-6" /></span
								>
								<span>Movies</span>
							</a>
						</li>
						<li>
							<a href="/experiments/picture">
								<span class="w-6 text-center"><ScrewdriverWrenchSolid /></span>
								<span>Experiments</span>
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
				<PaletteSolid class="md:!hidden" />
				<span class="hidden md:inline-block">Theme</span>
				<CaretDownSolid class="opacity-50" />
			</button>
			<!-- popup -->
			<div class="card w-60 p-4 shadow-xl" data-popup="theme">
				<div class="space-y-4">
					<section class="flex items-center justify-between">
						<h6 class="h6">Mode</h6>
						<LightSwitch />
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
											{#if badge}<span class="badge variant-filled-secondary"
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

		<!-- locale -->
		<LocaleSwitcher />

		<!-- Search -->
		<div class="md:ml-4 md:inline">
			<button
				class="btn variant-soft hover:variant-soft-primary space-x-4"
				on:click={triggerSearch}
			>
				<MagnifyingGlassSolid />
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
				<GithubBrand size="24" />
			</a>
		</section>
	</svelte:fragment>
</AppBar>
