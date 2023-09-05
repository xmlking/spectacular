<!-- Layout: (root) -->
<script lang="ts">
	// Dependency: Floating UI for Popups
	import { storePopup } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	// SvelteKit Imports
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';

	// Types
	import type { ModalComponent } from '@skeletonlabs/skeleton';

	// Stores
	import { storePreview } from '$lib/components/themer/stores';

	// Components & Utilities
	import { AppShell, Modal, Toast, initializeStores, prefersReducedMotionStore } from '@skeletonlabs/skeleton';
	initializeStores();

	// Docs Components
	import AppBar from '$lib/components/layout/AppBar.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import Drawer from '$lib/components/layout/Drawer.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	// Modal Components
	import Search from '$lib/modals/Search.svelte';
	// NOTE: (forms example uses direct method)
	import ModalExampleList from '$lib/modals/examples/ModalExampleList.svelte';
	import ModalExampleEmbed from '$lib/modals/examples/ModalExampleEmbed.svelte';
	import ModalExampleImage from '$lib/modals/examples/ModalExampleImage.svelte';
	// Global Stylesheets
	import '../app.postcss';

	// Handle Vercel Production Mode
	import type { LayoutServerData } from './$types';
	export let data: LayoutServerData;
	// Pass to Store for Ad Conditionals
	// IMPORTANT: DO NOT MODIFY THIS UNLESS YOU KNOW WHAT YOU'RE DOING
	import { storeTheme, storeVercelProductionMode } from '$lib/stores/stores';
	storeVercelProductionMode.set(data.vercelEnv === 'production');
	// Init Vercel Analytics TODO
	// if ($storeVercelProductionMode) import('@vercel/analytics').then((mod) => mod.inject());

	// SEO Meta tags
	// TODO

	// Registered list of Components for Modals
	const modalComponentRegistry: Record<string, ModalComponent> = {
		modalSearch: { ref: Search },
		exampleList: { ref: ModalExampleList },
		exampleEmbed: { ref: ModalExampleEmbed },
		exampleImage: { ref: ModalExampleImage }
	};

	function matchPathWhitelist(pageUrlPath: string): boolean {
		// If homepage route
		if (pageUrlPath === '/') return true;
		// If any blog route
		if (pageUrlPath.includes('/blog')) return true;
		return false;
	}

	// Set body `data-theme` based on current theme status
	storePreview.subscribe(setBodyThemeAttribute);
	storeTheme.subscribe(setBodyThemeAttribute);
	function setBodyThemeAttribute(): void {
		if (!browser) return;
		document.body.setAttribute('data-theme', $storePreview ? 'generator' : $storeTheme);
	}

	// Scroll heading into view
	function scrollHeadingIntoView(): void {
		if (!window.location.hash) return;
		const elemTarget: HTMLElement | null = document.querySelector(window.location.hash);
		if (elemTarget) elemTarget.scrollIntoView({ behavior: 'smooth' });
	}

	// Lifecycle
	afterNavigate((params: any) => {
		// Scroll to top
		const isNewPage: boolean = params.from && params.to && params.from.route.id !== params.to.route.id;
		const elemPage = document.querySelector('#page');
		if (isNewPage && elemPage !== null) {
			elemPage.scrollTop = 0;
		}
		// Scroll heading into view
		scrollHeadingIntoView();
	});
	// Reactive
	// Disable left sidebar on homepage
	$: slotSidebarLeft = matchPathWhitelist($page.url.pathname) ? 'w-0' : 'bg-surface-50-900-token lg:w-auto';
	$: allyPageSmoothScroll = !$prefersReducedMotionStore ? 'scroll-smooth' : '';
</script>

<!-- Overlays -->
<Modal components={modalComponentRegistry} />
<Toast />
<Drawer />

<!-- App Shell -->
<AppShell {slotSidebarLeft} regionPage={allyPageSmoothScroll} slotFooter="bg-black p-4">
	<!-- Header -->
	<svelte:fragment slot="header">
		<AppBar />
	</svelte:fragment>

	<!-- Sidebar (Left) -->
	<svelte:fragment slot="sidebarLeft">
		<Sidebar class="hidden lg:grid w-[360px] overflow-hidden" />
	</svelte:fragment>

	<!-- Page Content -->
	<slot />

	<!-- Page Footer -->
	<svelte:fragment slot="pageFooter">
		<Footer />
	</svelte:fragment>
</AppShell>
