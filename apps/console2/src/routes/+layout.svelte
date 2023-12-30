<script lang="ts">
	import {
		AppShell,
		Toast,
		Modal,
		initializeStores,
		prefersReducedMotionStore,
		storePopup
	} from '@skeletonlabs/skeleton';
	import type { ModalComponent } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import Search from '$lib/modals/Search.svelte';
	import AppBar from '$lib/components/layout/AppBar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { LL, setLocale } from '$lib/i18n/i18n-svelte';
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

	// Registered list of Components for Modals
	const modalComponentRegistry: Record<string, ModalComponent> = {
		modalSearch: { ref: Search }
	};

	// Reactive
	$: allyPageSmoothScroll = !$prefersReducedMotionStore ? 'scroll-smooth' : '';
</script>

<!-- Overlays -->
<Modal components={modalComponentRegistry} />
<Toast />

<!-- App Shell -->
<AppShell regionPage={allyPageSmoothScroll}>
	<!-- Header -->
	<svelte:fragment slot="header">
		<AppBar />
	</svelte:fragment>

	<!-- Page Content -->
	<slot />

	<!-- Page Footer -->
	<svelte:fragment slot="pageFooter">
		<Footer />
	</svelte:fragment>
</AppShell>
