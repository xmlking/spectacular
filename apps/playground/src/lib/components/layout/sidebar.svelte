<script lang="ts">
import { page } from '$app/stores';
import { menuNavLinks } from '$lib/links';
import { AppRail, AppRailAnchor, AppRailTile, getDrawerStore } from '@skeletonlabs/skeleton';
import { Icon } from '@spectacular/skeleton/components/icons';

// Local
let currentRailCategory: keyof typeof menuNavLinks | undefined = undefined;
const drawerStore = getDrawerStore();

function onClickAnchor(): void {
  currentRailCategory = undefined;
  drawerStore.close();
}

// Lifecycle
page.subscribe((page) => {
  // ex: /basePath/...
  let basePath: string = page.url.pathname.split('/')[1];
  if (!basePath) return;
  // Translate base path to link section
  if (['docs', 'essentials', 'resources'].includes(basePath)) currentRailCategory = '/docs';
  if (['tokens', 'base', 'elements', 'blocks'].includes(basePath)) currentRailCategory = '/elements';
  if (['components', 'actions'].includes(basePath)) currentRailCategory = '/svelte';
  if (['experiments'].includes(basePath)) currentRailCategory = '/experiments';
});

// Reactive
$: submenu = menuNavLinks[currentRailCategory ?? '/docs'];
$: listboxItemActive = (href: string) => ($page.url.pathname?.includes(href) ? 'bg-primary-active-token' : '');
</script>

<div
  class="bg-surface-50-900-token grid h-full grid-cols-[auto_1fr] border-r border-surface-500/30 {$$props.class ?? ''}"
>
  <!-- App Rail -->
  <AppRail background="bg-transparent" border="border-r border-surface-500/30">
    <!-- Mobile Only -->
    <!-- prettier-ignore -->
    <AppRailAnchor href="/" class="lg:hidden" on:click={() => { onClickAnchor() }}>
			<svelte:fragment slot="lead"><Icon name="home" width="w-6" height="h-6" /></svelte:fragment>
			<span>Home</span>
		</AppRailAnchor>
    <!-- prettier-ignore -->
    <AppRailAnchor href="/blog" class="lg:hidden" on:click={() => { onClickAnchor() }}>
			<svelte:fragment slot="lead"><Icon name="bullhorn" width="w-6" height="h-6" /></svelte:fragment>
			<span>Blog</span>
		</AppRailAnchor>
    <!-- --- / --- -->
    <AppRailTile bind:group={currentRailCategory} name="docs" value={'/docs'}>
      <svelte:fragment slot="lead"><Icon name="book" width="w-6" height="h-6" /></svelte:fragment>
      <span>Docs</span>
    </AppRailTile>
    <hr class="opacity-30" />
    <AppRailTile bind:group={currentRailCategory} name="elements" value={'/elements'}>
      <svelte:fragment slot="lead"><Icon name="tailwind" width="w-6" height="h-6" /></svelte:fragment>
      <span>Tailwind</span>
    </AppRailTile>
    <AppRailTile bind:group={currentRailCategory} name="svelte" value={'/svelte'}>
      <svelte:fragment slot="lead"><Icon name="svelte" width="w-6" height="h-6" /></svelte:fragment>
      <span>Svelte</span>
    </AppRailTile>
    <AppRailTile bind:group={currentRailCategory} name="experiments" value={'/experiments'}>
      <svelte:fragment slot="lead"><Icon name="screwdriverWrench" width="w-6" height="h-6" /></svelte:fragment>
      <span>Experiments</span>
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
          {#each segment.list as { href, label, badge }}
            <li on:keypress on:click={drawerStore.close}>
              <a {href} class={listboxItemActive(href)} data-sveltekit-preload-data="hover">
                <span class="flex-auto">{@html label}</span>
                {#if badge}<span class="variant-filled-secondary badge">{badge}</span>{/if}
              </a>
            </li>
          {/each}
        </ul>
      </nav>
      <!-- Divider -->
      {#if i + 1 < submenu.length}<hr class="!my-6 opacity-50" />{/if}
    {/each}
  </section>
</div>
