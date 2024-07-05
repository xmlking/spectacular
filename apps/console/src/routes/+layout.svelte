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
import Search from '$lib/modals/search.svelte';
import { scroll, storeTheme, storeVercelProductionMode } from '$lib/stores';
import { setLoadingState } from '$lib/stores/loading';
import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
import { ParaglideJS } from '@inlang/paraglide-js-adapter-sveltekit';
import { Modal, initializeStores, prefersReducedMotionStore, storePopup } from '@skeletonlabs/skeleton';
import type { ModalComponent } from '@skeletonlabs/skeleton';
// biome-ignore lint/style/useImportType: biome still don't understand svelte
import { AppShell } from '@skeletonlabs/skeleton';
import { Logger, startsWith } from '@spectacular/utils';
import { inject } from '@vercel/analytics';
import { mountVercelToolbar } from '@vercel/toolbar/vite';
import { type ComponentEvents, onMount } from 'svelte';
import { setupViewTransition } from 'sveltekit-view-transition';
import '../app.pcss';
import { setNhostClient } from '$lib/stores/nhost';

const log = new Logger('layout:root:browser');

export let data;

//*** initializations ***//
// Floating UI for Popups
storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

// initialize overlay components
initializeStores();
// initialize LoadingState
setLoadingState();
// initialize nhost client
 // TODO: initialize different clients for server-side and client-side
const nhost = setNhostClient()

// Handle Vercel Production Mode
storeVercelProductionMode.set(data.vercelEnv === 'production');
// Init Vercel Analytics
// if ($storeVercelProductionMode) import('@vercel/analytics').then((mod) => mod.inject());
inject({ mode: dev ? 'development' : 'production' });
// initialize Vercel Toolbar in dev
if (dev) {
  onMount(() => mountVercelToolbar());
}

// Registered list of Components for Modals
const modalComponentRegistry: Record<string, ModalComponent> = {
  modalSearch: { ref: Search },
};

const noSidebarPaths = ['/signin', '/signup', '/reset', '/privacy', '/terms', '/docs', '/blog', '/about', '/contact'];
function matchNoSidebarPaths(pathname: string): boolean {
  const canonicalPath = i18n.route(pathname);
  if (canonicalPath === '/' || startsWith(canonicalPath, noSidebarPaths)) {
    return true;
  }
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
$: slotSidebarLeft = matchNoSidebarPaths($page.url.pathname) ? 'w-0' : 'bg-surface-50-900-token lg:w-auto';
$: allyPageSmoothScroll = !$prefersReducedMotionStore ? 'scroll-smooth' : '';

// update nhost session
// HINT: https://blog.flotes.app/posts/performant-reactivity
$: ({ session } = data);
$: if (browser) {
  if (session) {
    log.debug('trigger SESSION_UPDATE', { session });
    nhost.auth.client.interpreter?.send('SESSION_UPDATE', { data: { session } });
  } else {
    log.debug('session empty, trigger SIGNOUT');
    // nhost.auth.client.interpreter?.send('SIGNOUT');
    (async () => {
      const { error } = await nhost.auth.signOut();
      if (error) log.error({ error });
    })();
  }
}

// if(browser) {
//   cookieStore.onchange = (event: CookieChangeEvent) => {
//      console.log("cookie changed", {event});
//     if(event.deleted[0] && event.deleted[0].name === NHOST_SESSION_KEY) {
//        console.log("cookie deleted", {deleted: event.deleted[0].name});
//        init();
//     }
//     if(event.changed[0] && event.changed[0].name === NHOST_SESSION_KEY) {
//        console.log("cookie changed", {changed: event.changed[0].name});
//        init();
//     }
//   };
// }
</script>

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
      <Header />
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
