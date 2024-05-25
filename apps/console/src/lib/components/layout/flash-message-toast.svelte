<script lang="ts" context="module">
// Scroll heading into view
function scrollHeadingIntoView(): void {
	if (!window.location.hash) return;
	const elemTarget: HTMLElement | null = document.querySelector(window.location.hash);
	if (elemTarget) elemTarget.scrollIntoView({ behavior: 'smooth' });
}
</script>

<script lang="ts">
// Ref: https://github.com/hansaskov/my-skeleton-app/blob/master/src/lib/components/FlashMessageToast.svelte
import { getFlash } from 'sveltekit-flash-message/client';
import { Toast, getToastStore } from '@skeletonlabs/skeleton';
import { page } from '$app/stores';
import { afterNavigate, beforeNavigate } from '$app/navigation';
import { isLoadingPage } from '$lib/stores/loading';
import { handleMessage } from './toast-manager';

const toastStore = getToastStore();

const flash = getFlash(page, {
	clearOnNavigate: false
	// flashCookieOptions: { sameSite: 'lax' }
});

// Lifecycle
beforeNavigate(({ from, to }) => {
	if ($flash && from?.url.toString() != to?.url.toString()) {
		$flash = undefined;
	}
	if (to?.route.id) {
		isLoadingPage.set(true);
	}
});

let isGotoNavigated = false;
afterNavigate(({ type, from, to }) => {
	// Flash Messages
	isGotoNavigated = ['goto'].includes(type as string);
	// Loading Animation
	isLoadingPage.set(false);
	// Scroll to top
	const isNewPage = from?.url.pathname !== to?.url.pathname;
	const elemPage = document.querySelector('#page');
	if (isNewPage && elemPage !== null) {
		elemPage.scrollTop = 0;
	}
	// Scroll heading into view
	scrollHeadingIntoView();
});

flash.subscribe(($flash) => {
	if (!$flash) return;
	if (!isGotoNavigated) return;

	handleMessage($flash, toastStore);

	// // Clear the flash message to avoid double-toasting.
	// $flash = undefined;
});
</script>

<Toast position="b" />
<!-- <Toast position="br" rounded="rounded-lg" padding="px-3 py-2" /> -->
