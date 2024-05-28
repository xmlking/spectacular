<!-- Layout: (root) -->
<script lang="ts">
import { browser, dev } from '$app/environment';
import { page } from '$app/stores';
import Drawer from '$lib/components/layout/drawer.svelte';
import FlashMessageToast from '$lib/components/layout/flash-message-toast.svelte';
import Footer from '$lib/components/layout/footer.svelte';
import GotoTop from '$lib/components/layout/go-to-top.svelte';
import Header from '$lib/components/layout/header.svelte';
import Sidebar from '$lib/components/layout/sidebar.svelte';
import { i18n } from '$lib/i18n';
import ModalExampleEmbed from '$lib/modals/examples/ModalExampleEmbed.svelte';
import ModalExampleImage from '$lib/modals/examples/ModalExampleImage.svelte';
import ModalExampleList from '$lib/modals/examples/ModalExampleList.svelte';
import Search from '$lib/modals/search.svelte';
import { scroll, storeTheme, storeVercelProductionMode } from '$lib/stores';
import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
import { ParaglideJS } from '@inlang/paraglide-js-adapter-sveltekit';
import { AppShell, Modal, initializeStores, prefersReducedMotionStore, storePopup } from '@skeletonlabs/skeleton';
import type { ModalComponent } from '@skeletonlabs/skeleton';
import { inject } from '@vercel/analytics';
import type { ComponentEvents } from 'svelte';
import { MetaTags } from 'svelte-meta-tags';
import { setupViewTransition } from 'sveltekit-view-transition';
// import HeadHrefLangs from '$lib/components/layout/head-href-langs.svelte';

// Global Stylesheets
import '../app.pcss';

export let data;

// Floating UI for Popups
storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

// initialize overlay components
initializeStores();

// Handle Vercel Production Mode
storeVercelProductionMode.set(data.vercelEnv === 'production');
// Init Vercel Analytics
// if ($storeVercelProductionMode) import('@vercel/analytics').then((mod) => mod.inject());
inject({ mode: dev ? 'development' : 'production' });

// SEO Meta tags
// eslint-disable-next-line  no-unused-vars, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
const metaDefaults = Object.freeze({
  title: 'Home',
  description:
    'Spectacular is a fully featured SvelteKit template for building reactive interfaces quickly using Svelte and Tailwind.',
  image: 'https://user-images.githubusercontent.com/1509726/212382766-f29b9c9a-82e3-44c2-b911-b17a9197e5b9.jpg',
});

// Registered list of Components for Modals
const modalComponentRegistry: Record<string, ModalComponent> = {
  modalSearch: { ref: Search },
  exampleList: { ref: ModalExampleList },
  exampleEmbed: { ref: ModalExampleEmbed },
  exampleImage: { ref: ModalExampleImage },
};

function matchPathWhitelist(pathname: string): boolean {
  // If homepage route
  if (i18n.route(pathname) === '/') return true;
  // If any blog route `/blog`
  if (i18n.route(pathname).includes('/blog')) return true;
  // If any blog route `/auth`
  if (i18n.route(pathname).includes('/auth')) return true;
  return false;
}

// Set body `data-theme` based on current theme status
storeTheme.subscribe(setBodyThemeAttribute);
function setBodyThemeAttribute(): void {
  if (!browser) return;
  document.body.setAttribute('data-theme', $storeTheme);
}

// View Transitions
setupViewTransition();

/**
 * bind current scrollX scrollY value to store
 */
function scrollHandler(event: ComponentEvents<AppShell>['scroll']) {
  scroll.set({
    x: event.currentTarget.scrollLeft,
    y: event.currentTarget.scrollTop,
  });
}

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
        type: 'image/jpeg',
      },
    ],
    videos: [
      {
        url: 'https://www.example.ie/og-video.mp4',
        width: 800,
        height: 600,
        secureUrl: 'https://www.example.ie/og-video.mp4',
        type: 'video/mp4',
      },
    ],
    audio: [
      {
        url: 'https://www.example.ie/og-audio.mp3',
        secureUrl: 'https://www.example.ie/og-audio.mp3',
        type: 'audio/mp3',
      },
    ],
    siteName: 'Spectacular',
  }}
  twitter={{
    handle: '@xmlking',
    site: '@crossbusiness',
    cardType: 'summary_large_image',
    title: 'Using More of Config',
    description: 'This example uses more of the available config options.',
    image: 'https://www.example.ie/twitter-image.jpg',
    imageAlt: 'Twitter image alt',
  }}
  facebook={{
    appId: '1234567890',
  }}
/>

<!-- Overlays -->
<Modal components={modalComponentRegistry} />
<!-- Display flash toast message -->
<FlashMessageToast />
<Drawer />

<ParaglideJS {i18n}>
  <!-- App Shell -->
  <AppShell {slotSidebarLeft} regionPage={allyPageSmoothScroll} slotFooter="bg-black p-4" on:scroll={scrollHandler}>
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
    <slot />

    <!-- Page Footer -->
    <svelte:fragment slot="pageFooter">
      <Footer />
    </svelte:fragment>
  </AppShell>
</ParaglideJS>
<!-- Change showAtPixel to 0 to show the button right after scroll -->
<GotoTop class="bottom-10 right-10" showAtPixel={300} />
