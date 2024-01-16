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

	beforeNavigate(({ from, to }) => {
		if ($flash && from?.url.toString() != to?.url.toString()) {
			$flash = undefined;
		}
		if (to?.route.id) {
			isLoadingPage.set(true);
		}
	});

	let isGotoNavigated = false;
	afterNavigate(({ type }) => {
		isGotoNavigated = ['goto'].includes(type as string);
		isLoadingPage.set(false);
	});

	flash.subscribe(($flash) => {
		if (!$flash) return;
		if (!isGotoNavigated) return;

		handleMessage($flash, toastStore);
	});
</script>

<Toast position="b" />
<!-- <Toast position="br" rounded="rounded-lg" padding="px-3 py-2" /> -->
