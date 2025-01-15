<script lang="ts">
import { page } from '$app/stores';
import AppFooter from '$lib/components/layout/app-footer.svelte';
import AppHeader from '$lib/components/layout/app-header.svelte';
import AppSidebar from '$lib/components/layout/app-sidebar.svelte';
import Metadata from '$lib/components/layout/metadata.svelte';
import { i18n } from '$lib/i18n';
import { ParaglideJS } from '@inlang/paraglide-sveltekit';
import * as Sidebar from '@spectacular/ui/components/sidebar';
import { Toaster } from '@spectacular/ui/components/sonner';
import { ModeWatcher } from 'mode-watcher';
import type { Snippet } from 'svelte';

import { config } from '$lib/stores/index.js';
import { updateTheme } from '$lib/utils.js';
import '../app.pcss';

type Props = {
  children?: Snippet;
};

let { children }: Props = $props();

$effect(() => {
  updateTheme($config.theme, $page.url.pathname);
});
</script>

<ModeWatcher />
<Metadata />
<Toaster />

<ParaglideJS {i18n}>
<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<AppHeader />
		<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
			{@render children?.()}
		</div>
		<AppFooter />
	</Sidebar.Inset>
</Sidebar.Provider>
</ParaglideJS>
