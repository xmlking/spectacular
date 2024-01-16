<!-- Layout: (root) -->
<script lang="ts">
	import {
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
	import { storeTheme, storeVercelProductionMode } from '$lib/stores/stores';
	import { dev, browser } from '$app/environment';
	import { page } from '$app/stores';
	import { setLanguageTag, sourceLanguageTag } from '$i18n/runtime';
	import type { AvailableLanguageTag } from '$i18n/runtime';
	import { afterNavigate } from '$app/navigation';
	import Header from '$lib/components/layout/header.svelte';
	import Footer from '$lib/components/layout/footer.svelte';
	import Sidebar from '$lib/components/layout/sidebar.svelte';
	import Drawer from '$lib/components/layout/drawer.svelte';
	import LangHeader from '$lib/components/layout/lang-header.svelte';
	import FlashMessageToast from '$lib/components/layout/flash-message-toast.svelte';
	import '../app.pcss';
	import { getTextDirection } from '$lib/i18n';

	export let data;

	// at the very top, set the locale before you access the store and before the actual rendering takes place
	// setLocale(data.locale);

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

	function matchPathWhitelist(routeId: string | null): boolean {
		console.log({ routeId });
		// If homepage route
		if (routeId === '/[[lang=lang]]') return true;
		// If any blog route `/[[lang=lang]]/blog`
		if (routeId?.includes('/blog')) return true;
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
	$: slotSidebarLeft = matchPathWhitelist($page.route.id)
		? 'w-0'
		: 'bg-surface-50-900-token lg:w-auto';
	$: allyPageSmoothScroll = !$prefersReducedMotionStore ? 'scroll-smooth' : '';

	//Determine the current language from the URL. Fall back to the source language if none is specified.
	$: lang = ($page.params.lang as AvailableLanguageTag) ?? sourceLanguageTag;
	//Set the language tag in the Paraglide runtime.
	//This determines which language the strings are translated to.
	//You should only do this in the template, to avoid concurrent requests interfering with each other.
	$: setLanguageTag(lang);

	//Determine the text direction of the current language
	$: textDirection = getTextDirection(lang);

	//Keep the <html> lang and dir attributes in sync with the current language
	$: if (browser) {
		document.documentElement.dir = textDirection;
		document.documentElement.lang = lang;
	}
</script>

<!-- Include alternate language links in the head -->
<LangHeader />

<!-- Overlays -->
<Modal components={modalComponentRegistry} />
<!-- Display flash toast message -->
<FlashMessageToast />
<Drawer />

<!-- App Shell -->
<AppShell {slotSidebarLeft} regionPage={allyPageSmoothScroll} slotFooter="bg-black p-4">
	<!-- Header -->
	<svelte:fragment slot="header">
		<Header user={data?.user} />
	</svelte:fragment>

	<!-- Sidebar (Left) -->
	<svelte:fragment slot="sidebarLeft">
		<Sidebar class="hidden w-[360px] overflow-hidden lg:grid" />
	</svelte:fragment>

	<!-- Page Content -->
	<!--
		Rerender the page whenever the language changes
		TODO: https://github.com/CUPUM/nplex/blob/main/src/lib/components/LangKey.svelte
		https://github.com/opral/monorepo/tree/paraglide-js-adapter-sveltekit/inlang/source-code/paraglide/paraglide-js-adapter-sveltekit

	-->
	{#key lang}
		<slot />
	{/key}

	<!-- Page Footer -->
	<svelte:fragment slot="pageFooter">
		<Footer />
	</svelte:fragment>
</AppShell>
