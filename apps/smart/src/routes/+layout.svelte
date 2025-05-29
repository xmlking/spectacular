<script lang="ts">
import AppFooter from '$lib/components/layout/app-footer.svelte';
import AppHeader from '$lib/components/layout/app-header.svelte';
import AppSidebar from '$lib/components/layout/app-sidebar.svelte';
import Metadata from '$lib/components/layout/metadata.svelte';
import { page } from '$app/state';
import { locales, localizeHref } from '$i18n/runtime';
import * as Sidebar from '@repo/ui/components/sidebar';
import { Toaster } from '@repo/ui/components/sonner';
import { ModeWatcher } from 'mode-watcher';
import type { Snippet } from 'svelte';

import { config } from '$lib/stores/index.js';
import { updateTheme } from '$lib/utils.js';
import '../app.css';

type Props = {
  children?: Snippet;
};

let { children }: Props = $props();

$effect(() => {
  updateTheme($config.theme, page.url.pathname);
});
</script>

<ModeWatcher />
<Metadata />
<Toaster />

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

<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>
