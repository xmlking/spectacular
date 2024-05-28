<script lang="ts">
import { page } from '$app/stores';
import { Footer, Header } from '$lib/blocks/dashboard';
import { SideMenu } from '$lib/blocks/side';
import { addToast } from '$lib/components/toast';
import { DarkMode } from 'flowbite-svelte';
import { onMount } from 'svelte';
import { getFlash } from 'sveltekit-flash-message/client';
import { setupViewTransition } from 'sveltekit-view-transition';

export let data;

/**
 * Setup Flash Message listener
 */
const flash = getFlash(page);
flash.subscribe(($flash) => {
  if (!$flash) return;
  addToast($flash);

  // Clearing the flash message could sometimes
  // be needed here to avoid double-toasting.
  flash.set(undefined);
});

/**
 *
 */
async function getAzureProfilePicture(access_token: string) {
  const res = await fetch('https://graph.microsoft.com/v1.0/me/photos/48x48/$value', {
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'image/jpg',
    },
    cache: 'force-cache',
  });
  if (!res.ok) throw { code: res.status, message: res.statusText };

  const pictureBuffer = await res.arrayBuffer();
  const pictureBase64 = btoa(String.fromCharCode(...new Uint8Array(pictureBuffer)));
  // const pictureBase64 = Buffer.from(data).toString('base64');
  return `data:image/jpeg;base64, ${pictureBase64}`;
}

let { session } = data;
const user = session?.user;

onMount(async () => {
  // if (user) user.image ??= await getAzureProfilePicture(session.token);
});

// console.log('session>>>', session);

// TODO: https://twitter.com/karimfromjordan/status/1692859106699169883
const { transition } = setupViewTransition();

// HINT: added `right-4 top-24` to original `btnClass`
let btnClass =
  'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-lg p-2.5 fixed right-4 top-24 z-50';
</script>

<DarkMode {btnClass} />

<div class="flex h-screen flex-col">
  <!--  start::navbar   -->
  <Header {user} />
  <!--  end::navbar     -->
  <div class="flex flex-1 overflow-hidden">
    <!--   start::Sidebar    -->
    <SideMenu />
    <!--   end::Sidebar      -->
    <!--   start::Main Content     -->
    <main use:transition={'main'} class="container mx-auto overflow-y-auto px-8 py-32 dark:text-white">
      <slot />
    </main>
    <!--   end::Main Content      -->
  </div>
  <!--   start::Footer    -->
  <Footer />
  <!--   end::Footer      -->
</div>

<style lang="postcss">
/*** view-transition animations for DASHBOARD ***/
:global(::view-transition-old(main)),
:global(::view-transition-new(main)) {
  animation-duration: 600ms;
}
</style>
