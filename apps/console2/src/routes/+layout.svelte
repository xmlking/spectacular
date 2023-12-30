<!-- Layout: (root) -->
<script lang="ts">
	import {
		Toast,
		Modal,
		AppShell,
		storePopup,
		initializeStores,
		prefersReducedMotionStore
	} from '@skeletonlabs/skeleton';
	import type { ModalComponent } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { inject } from '@vercel/analytics';
	import Search from '$lib/modals/Search.svelte';
	import { LL, setLocale } from '$lib/i18n/i18n-svelte';
	import { storeTheme, storeVercelProductionMode } from '$lib/stores/stores';
	import { dev, browser } from '$app/environment';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import AppBar from '$lib/components/layout/AppBar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import Drawer from '$lib/components/layout/Drawer.svelte';
	import type { LayoutData } from './$types';
	import '../app.pcss';

	export let data: LayoutData;

	// at the very top, set the locale before you access the store and before the actual rendering takes place
	setLocale(data.locale);
	console.info($LL.log({ fileName: '+layout.svelte' }));

	// Floating UI for Popups
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	// initialize overlay components
	initializeStores();

	// Handle Vercel Production Mode
	storeVercelProductionMode.set(data.vercelEnv === 'production');
	// Init Vercel Analytics
	// if ($storeVercelProductionMode) import('@vercel/analytics').then((mod) => mod.inject());
	inject({ mode: dev ? 'development' : 'production' });

	// Registered list of Components for Modals
	const modalComponentRegistry: Record<string, ModalComponent> = {
		modalSearch: { ref: Search }
	};

	function matchPathWhitelist(pageUrlPath: string): boolean {
		// If homepage route
		if (pageUrlPath === '/') return true;
		// If any blog route
		if (pageUrlPath.includes('/blog')) return true;
		return false;
	}

	// Set body `data-theme` based on current theme status
	storeTheme.subscribe(setBodyThemeAttribute);
	function setBodyThemeAttribute(): void {
		if (!browser) return;
		document.body.setAttribute('data-theme', $storeTheme);
	}

	// Scroll heading into view
	function scrollHeadingIntoView(): void {
		if (!window.location.hash) return;
		const elemTarget: HTMLElement | null = document.querySelector(window.location.hash);
		if (elemTarget) elemTarget.scrollIntoView({ behavior: 'smooth' });
	}

	// Lifecycle
	afterNavigate((params) => {
		// Scroll to top
		const isNewPage = params.from?.url.pathname !== params.to?.url.pathname;
		const elemPage = document.querySelector('#page');
		if (isNewPage && elemPage !== null) {
			elemPage.scrollTop = 0;
		}
		// Scroll heading into view
		scrollHeadingIntoView();
	});
	// Reactive
	// Disable left sidebar on homepage
	$: slotSidebarLeft = matchPathWhitelist($page.url.pathname)
		? 'w-0'
		: 'bg-surface-50-900-token lg:w-auto';
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
		<Sidebar class="hidden w-[360px] overflow-hidden lg:grid" />
	</svelte:fragment>

	<!-- Page Content -->
	<slot />

	<!-- Page Footer -->
	<svelte:fragment slot="pageFooter">
		<Footer />
	</svelte:fragment>
</AppShell>
