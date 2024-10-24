<script lang="ts">
  import { stopPropagation } from 'svelte/legacy';

import { browser } from '$app/environment';
import { enhance } from '$app/forms';
import * as m from '$i18n/messages';
import LangSwitch from '$lib/components/layout/lang-switch.svelte';
// import LoadingIndicatorSpinner from '$lib/components/layout/loading-indicator-spinner.svelte';
import LoadingIndicatorBar from '$lib/components/layout/loading-indicator-bar.svelte';
import { storeTheme } from '$lib/stores';
import { online } from '$lib/stores/window';
import { getNhostClient } from '$lib/stores/nhost';
import type { DrawerSettings, ModalSettings } from '@skeletonlabs/skeleton';
import { AppBar, LightSwitch, getDrawerStore, getModalStore, popup } from '@skeletonlabs/skeleton';
import { LogoIcon } from '@spectacular/skeleton/components/logos';
import type { SubmitFunction } from '@sveltejs/kit';
import {
  BookText,
  ChevronDown,
  Home,
  Menu,
  Palette,
  PersonStanding,
  PhoneOutgoing,
  Scroll,
  Search,
} from 'lucide-svelte';
import Avatar from './avatar.svelte';

const drawerStore = getDrawerStore();

// Local
let isOsMac = $state(false);
const modalStore = getModalStore();
const { elevated, isAuthenticated, user } = getNhostClient();

// Set Search Keyboard Shortcut
if (browser) {
  const os = navigator.userAgent;
  isOsMac = os.search('Mac') !== -1;
}

// Drawer Handler
function drawerOpen(): void {
  const s: DrawerSettings = { id: 'doc-sidenav' };
  drawerStore.open(s);
}

// Search
function triggerSearch(): void {
  const modal: ModalSettings = {
    type: 'component',
    component: 'modalSearch',
    position: 'item-start',
  };
  modalStore.trigger(modal);
}

// Keyboard Shortcut (CTRL/⌘+K) to Focus Search
function onWindowKeydown(e: KeyboardEvent): void {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    // Prevent default browser behavior of focusing URL bar
    e.preventDefault();
    // If modal currently open, close modal (allows to open/close search with CTRL/⌘+K)
    $modalStore.length ? modalStore.close() : triggerSearch();
  }
}

const themes = [
  { type: 'skeleton', name: 'Skeleton', icon: '💀' },
  { type: 'wintry', name: 'Wintry', icon: '🌨️' },
  { type: 'modern', name: 'Modern', icon: '🤖' },
  { type: 'rocket', name: 'Rocket', icon: '🚀' },
  { type: 'seafoam', name: 'Seafoam', icon: '🧜‍♀️' },
  { type: 'vintage', name: 'Vintage', icon: '📺' },
  { type: 'sahara', name: 'Sahara', icon: '🏜️' },
  { type: 'hamlindigo', name: 'Hamlindigo', icon: '👔' },
  { type: 'gold-nouveau', name: 'Gold Nouveau', icon: '💫' },
  { type: 'crimson', name: 'Crimson', icon: '⭕' },
  { type: 'custom', name: 'Custom', icon: '🎆', badge: 'New' },
];

const setTheme: SubmitFunction = ({ formData }) => {
  const theme = formData.get('theme')?.toString();

  if (theme) {
    document.body.setAttribute('data-theme', theme);
    $storeTheme = theme;
  }
};
</script>

<!-- NOTE: using stopPropagation to override Chrome for Windows search shortcut -->
<svelte:window onkeydown={stopPropagation(onWindowKeydown)} />
<!-- LoadingIndicatorBar should be placed here -->
<LoadingIndicatorBar />
<AppBar shadow="shadow-2xl" slotTrail="!space-x-2">
  {#snippet lead()}
  
      <div class="flex items-center space-x-4">
        <!-- Hamburger Menu -->
        <button onclick={drawerOpen} class="btn-icon btn-icon-sm lg:!hidden">
          <Menu />
        </button>
        <!-- Logo -->
        <a class="w-[32px] overflow-hidden lg:!ml-0 lg:w-auto" href="/" title="Go to Homepage">
          <LogoIcon />
        </a>
        <a href="/" title="Go to Homepage">
          <h2 class="hidden font-serif text-2xl md:block">Datablocks</h2>
        </a>
        <!-- LoadingIndicatorSpinner should be placed here -->
        <!-- <LoadingIndicatorSpinner /> -->
      </div>
    
  {/snippet}
  {#snippet trail()}
  
      <!-- Explore -->
      <div class="relative hidden lg:block">
        <!-- trigger -->
        <button class="btn hover:variant-soft-primary" use:popup={{ event: 'click', target: 'features' }}>
          <span>Explore</span>
          <ChevronDown size="20" class="opacity-50" />
        </button>
        <!-- popup -->
        <div class="card w-60 p-4 shadow-xl" data-popup="features">
          <nav class="list-nav">
            <ul>
              <li>
                <a href="/">
                  <span class="w-6 text-center"><Home /> </span>
                  <span>Home</span>
                </a>
              </li>
              <li>
                <a href="/docs/get-started">
                  <span class="w-6 text-center"><BookText /></span>
                  <span>Docs</span>
                </a>
              </li>
              <li>
                <a href="/blog">
                  <span class="w-6 text-center"><Scroll /></span>
                  <span>Blog</span>
                </a>
              </li>
              <hr class="!my-4" />
              <li>
                <a href="/about">
                  <span class="w-6 text-center"><PersonStanding /></span>
                  <span>About</span>
                </a>
              </li>
              <li>
                <a href="/contact">
                  <span class="w-6 text-center"><PhoneOutgoing size={20} /></span>
                  <span>Contact</span>
                </a>
              </li>
            </ul>
          </nav>
          <!-- <div class="arrow bg-surface-100-800-token" /> -->
        </div>
      </div>
      <!-- Theme -->
      <div>
        <!-- trigger -->
        <button
          class="btn hover:variant-soft-primary"
          use:popup={{ event: 'click', target: 'theme', closeQuery: 'a[href]' }}
        >
          <Palette class="md:!hidden" />
          <span class="hidden md:inline-block">Theme</span>
          <ChevronDown size="20" class="opacity-50" />
        </button>
        <!-- popup -->
        <div class="card w-60 p-4 shadow-xl" data-popup="theme">
          <div class="space-y-4">
            <section class="flex items-center justify-between">
              <h6 class="h6">Mode</h6>
              <!-- dark mode -->
              <LightSwitch />
            </section>
            <hr />
            <section class="flex items-center justify-between">
              <h6 class="h6">Lang</h6>
              <!-- locale -->
              <LangSwitch />
            </section>
            <hr />
            <nav class="list-nav -m-4 max-h-64 overflow-y-auto p-4 lg:max-h-[500px]">
              <form action="/?/setTheme" method="POST" use:enhance={setTheme}>
                <ul>
                  {#each themes as { icon, name, type, badge }}
                    <li>
                      <button
                        class="option h-full w-full"
                        type="submit"
                        name="theme"
                        value={type}
                        class:bg-primary-active-token={$storeTheme === type}
                      >
                        <span>{icon}</span>
                        <span class="flex-auto text-left">{name}</span>
                        {#if badge}<span class="variant-filled-secondary badge">{badge}</span>{/if}
                      </button>
                    </li>
                  {/each}
                </ul>
              </form>
            </nav>
          </div>
          <!-- <div class="arrow bg-surface-100-800-token" /> -->
        </div>
      </div>

      <!-- Search -->
      <div class="md:ml-4 md:inline">
        <button class="variant-soft btn space-x-4 hover:variant-soft-primary" onclick={triggerSearch}>
          <Search size={15} />
          <small class="hidden md:inline-block">{isOsMac ? '⌘' : 'Ctrl'}+K</small>
        </button>
      </div>

      <!-- Login/Avatar -->
      <section class="flex items-center justify-between gap-4">
        {#if $isAuthenticated && $user}
          {#if $user.avatarUrl}
            <Avatar src={$user.avatarUrl || undefined} elevated={$elevated} online={$online} />
          {:else}
            <Avatar initials={$user.email} elevated={$elevated} online={$online} />
          {/if}
        {:else}
          <a href="/signin?redirectTo=/dashboard" class="variant-filled-primary btn">{m.auth_labels_signin()}</a>
        {/if}
      </section>
    
  {/snippet}
</AppBar>
