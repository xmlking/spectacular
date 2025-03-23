<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
import { page } from '$app/stores';
import { i18n } from '$lib/i18n';
import { hrefToCategoryIndex, menuNavLinks } from '$lib/links';
import { getNhostClient } from '$lib/stores/nhost';
import { AppRail, AppRailAnchor, AppRailTile, getDrawerStore } from '@skeletonlabs/skeleton';
import { Icon } from '$lib/ui/components/icons';
import { WandSparkles } from 'lucide-svelte';
  interface Props {
    [key: string]: any
  }

  let { ...props }: Props = $props();

// Local
let currentRailCategory: keyof typeof menuNavLinks | undefined = $state(undefined);
const drawerStore = getDrawerStore();
const { user } = getNhostClient();

function onClickAnchor(): void {
  currentRailCategory = undefined;
  drawerStore.close();
}

// Lifecycle
page.subscribe((page) => {
  // ex: /basePath/...
  const canonicalPath = i18n.route(page.url.pathname);
  const basePath = canonicalPath.split('/')[1];
  if (!basePath) return;
  // Translate base path to link section
  currentRailCategory = hrefToCategoryIndex[basePath] ?? '/bookstore';
});

// Reactive
let submenu = $derived(menuNavLinks[currentRailCategory ?? '/bookstore']);
let listboxItemActive = $derived((href: string) => ($page.url.pathname?.includes(href) ? 'bg-primary-active-token' : ''));
</script>

<div
  class="bg-surface-50-900-token grid h-full grid-cols-[auto_1fr] border-r border-surface-500/30 {props.class ?? ''}"
>
  <!-- App Rail -->
  <AppRail background="bg-transparent" border="border-r border-surface-500/30">
    <!-- Mobile Only -->
    <!-- prettier-ignore -->
    <AppRailAnchor href="/" class="lg:hidden" on:click={() => { onClickAnchor() }}>
			{#snippet lead()}
            <Icon name="home" width="w-6" height="h-6" />
          {/snippet}
			<span>Home</span>
		</AppRailAnchor>
    <!-- prettier-ignore -->
    <AppRailAnchor href="/blog" class="lg:hidden" on:click={() => { onClickAnchor() }}>
			{#snippet lead()}
            <Icon name="bullhorn" width="w-6" height="h-6" />
          {/snippet}
			<span>Blog</span>
		</AppRailAnchor>
    <!-- --- / --- -->
    <AppRailTile bind:group={currentRailCategory} name="bookstore" value={'/bookstore'}>
      {#snippet lead()}
            <Icon name="book" width="w-6" height="h-6" />
          {/snippet}
      <span>Bookstore</span>
    </AppRailTile>
    <hr class="opacity-30" />
    <AppRailTile bind:group={currentRailCategory} name="flows" value={'/flows'}>
      {#snippet lead()}
            <Icon name="tailwind" width="w-6" height="h-6" />
          {/snippet}
      <span>Flows</span>
    </AppRailTile>
    <AppRailTile bind:group={currentRailCategory} name="reports" value={'/reports'}>
      {#snippet lead()}
            <Icon name="svelte" width="w-6" height="h-6" />
          {/snippet}
      <span>Reports</span>
    </AppRailTile>
    <AppRailTile bind:group={currentRailCategory} name="account" value={'/account'}>
      {#snippet lead()}
            <Icon name="screwdriverWrench" width="w-6" height="h-6" />
          {/snippet}
      <span>Account</span>
    </AppRailTile>
    <AppRailTile bind:group={currentRailCategory} name="account" value={'/ai'}>
      {#snippet lead()}
            <WandSparkles class="inline-block outline-none"/> 
          {/snippet}
      <span>Smart</span>
    </AppRailTile>
  </AppRail>
  <!-- Nav Links -->
  <section class="space-y-4 overflow-y-auto p-4 pb-20">
    {#each submenu as segment, i}
      <!-- Title -->
      <p class="pl-4 text-2xl font-bold">{segment.title}</p>
      <!-- Nav List -->
      <nav class="list-nav">
        <ul>
          {#each segment.list as { href, label, badge, preload, roles }}
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            {#if !roles || ($user?.defaultRole && roles.some( r => r === $user.defaultRole))}
            <li onkeypress={bubble('keypress')} onclick={drawerStore.close}>
              <a {href} class={listboxItemActive(href)} data-sveltekit-preload-data={preload || 'hover'}>
                <span class="flex-auto">{@html label}</span>
                {#if badge}<span class="variant-filled badge">{badge}</span>{/if}
              </a>
            </li>
            {/if}
          {/each}
        </ul>
      </nav>
      <!-- Divider -->
      {#if i + 1 < submenu.length}<hr class="!my-6 opacity-50" />{/if}
    {/each}
  </section>
</div>
