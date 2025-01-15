<script lang="ts">
import { dev } from '$app/environment';
import { page } from '$app/stores';
import * as m from '$i18n/messages';
import { env } from '$env/dynamic/public';
import { TabAnchor, TabGroup } from '@skeletonlabs/skeleton';
import { UserRound } from 'lucide-svelte';
import { Turnstile } from 'svelte-turnstile';
// import { mode } from 'mode-watcher';
import { modeCurrent, modeUserPrefers } from '@skeletonlabs/skeleton';
import { turnstilePassed, turnstileResponse } from '$lib/stores/stores';

export let data;

// Functions
let showTurnstileOverlay = false;

function unPass() {
  $turnstilePassed = false;
  $turnstileResponse = '';
}

function pass(event: CustomEvent) {
  $turnstilePassed = true;
  $turnstileResponse = event.detail.token;
}

// Reactivity
let theme: 'light' | 'dark' | 'auto' | undefined;
$: theme = $modeUserPrefers ? 'light' : 'dark';
let siteKey = dev ? env.PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY_ALWAYS_PASSES! : env.PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!;
</script>

<div class="mx-auto flex max-w-md flex-col justify-center px-6 py-12 lg:px-8 lg:py-32">
  {#if data.flags.showBotProtection}
  <div>
    <Turnstile {siteKey} {theme}
      size="flexible"
      responseField={false}
      on:turnstile-error={unPass}
      on:turnstile-expired={unPass}
      on:turnstile-timeout={unPass}
      on:turnstile-callback={pass}
     />
  </div>
  {/if}
  <div class="card p-6 pb-8 pt-8">
    <div>
      <div class="mb-4 flex flex-row items-center justify-center">
        <div>
          <UserRound size={42} />
        </div>
      </div>
      <TabGroup justify="justify-center">
        <TabAnchor href="/signin" selected={$page.url.pathname === '/signin' || $page.url.pathname === '/reset'}>
          <span>{m.auth_labels_signin()}</span>
        </TabAnchor>
        <TabAnchor href="/signup" selected={$page.url.pathname === '/signup'}>
          <span>{m.auth_labels_signup()}</span>
        </TabAnchor>
      </TabGroup>
      <slot />
    </div>
  </div>
</div>
