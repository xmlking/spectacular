<script lang="ts">
import { i18n } from '$lib/i18n';
import { page } from '$app/stores';
import { ModeWatcher } from 'mode-watcher';
import { Toaster } from '@spectacular/ui/components/sonner';
import { ParaglideJS } from '@inlang/paraglide-sveltekit';
import Metadata from '$lib/components/layout/metadata.svelte';
import AppHeader from '$lib/components/layout/app-header.svelte';
import AppSidebar from '$lib/components/layout/app-sidebar.svelte';
import AppFooter from '$lib/components/layout/app-footer.svelte';
import * as Sidebar from '@spectacular/ui/components/sidebar';
import type { Snippet } from 'svelte';

import { updateTheme } from '$lib/utils.js';
import { config } from '$lib/stores/index.js';
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
