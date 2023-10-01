<!-- Layout: (root) -->
<script lang="ts">
	/* eslint-disable import/order */

	// Dependency: Floating UI for Popups
	import { storePopup } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	// 3rd party
	import { MetaTags } from 'svelte-meta-tags';

	// SvelteKit Imports
	import { browser, dev } from '$app/environment';
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
	import Drawer from '$lib/components/layout/Drawer.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';

	// Modal Components
	import Search from '$lib/modals/Search.svelte';

	// NOTE: (forms example uses direct method)
	import ModalExampleEmbed from '$lib/modals/examples/ModalExampleEmbed.svelte';
	import ModalExampleImage from '$lib/modals/examples/ModalExampleImage.svelte';
	import ModalExampleList from '$lib/modals/examples/ModalExampleList.svelte';

	// Global Stylesheets
	import '../app.postcss';

	// Handle Vercel Production Mode
	import type { LayoutServerData } from './$types';
	export let data: LayoutServerData;
	// Pass to Store for Ad Conditionals
	// IMPORTANT: DO NOT MODIFY THIS UNLESS YOU KNOW WHAT YOU'RE DOING
	import { storeTheme, storeVercelProductionMode } from '$lib/stores/stores';
	storeVercelProductionMode.set(data.vercelEnv === 'production');
	// Init Vercel Analytics
	// if ($storeVercelProductionMode) import('@vercel/analytics').then((mod) => mod.inject());
	import { inject } from '@vercel/analytics';
	inject({ mode: dev ? 'development' : 'production' });

	// SEO Meta tags
	const metaDefaults = Object.freeze({
		title: 'Home',
		description: 'Spectacular is a fully featured SvelteKit template for building reactive interfaces quickly using Svelte and Tailwind.',
		image: 'https://user-images.githubusercontent.com/1509726/212382766-f29b9c9a-82e3-44c2-b911-b17a9197e5b9.jpg',
	});

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

<MetaTags
  title="Home"
  titleTemplate="%s | Spectacular"
  description="Spectacular is a fully featured SvelteKit template for building reactive interfaces quickly using Svelte and Tailwind"
  canonical="https://www.chinthagunta.com/"
  openGraph={{
    url: 'https://www.url.ie/a',
    title: 'Open Graph Title',
    description: 'Open Graph Description',
    images: [
      {
        url: 'https://www.example.ie/og-image.jpg',
        alt: 'Og Image Alt',
        width: 800,
        height: 600,
        secureUrl: 'https://www.example.ie/og-image.jpg',
        type: 'image/jpeg'
      }
    ],
    videos: [
      {
        url: 'https://www.example.ie/og-video.mp4',
        width: 800,
        height: 600,
        secureUrl: 'https://www.example.ie/og-video.mp4',
        type: 'video/mp4'
      }
    ],
    audio: [
      {
        url: 'https://www.example.ie/og-audio.mp3',
        secureUrl: 'https://www.example.ie/og-audio.mp3',
        type: 'audio/mp3'
      }
    ],
    siteName: 'Spectacular'
  }}
  twitter={{
    handle: '@xmlking',
    site: '@crossbusiness',
    cardType: 'summary_large_image',
    title: 'Using More of Config',
    description: 'This example uses more of the available config options.',
    image: 'https://www.example.ie/twitter-image.jpg',
    imageAlt: 'Twitter image alt'
  }}
  facebook={{
    appId: '1234567890'
  }}
/>

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
