<script lang="ts">
import { goto } from '$app/navigation';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { NHOST_SESSION_KEY, ROUTE_SIGNIN } from '$lib/constants';
import { i18n } from '$lib/i18n';
import { getNhostClient } from '$lib/stores/nhost';
// Ref: https://github.com/hansaskov/my-skeleton-app/blob/master/src/lib/components/Avatar.svelte
import { Avatar, getToastStore, popup } from '@skeletonlabs/skeleton';
import Cookies from 'js-cookie';
import { CircleUserRound, LogOut, Plus, Settings } from 'lucide-svelte';

export let initials: string | undefined = undefined;
export let src: string | undefined = undefined;
export let elevated = false;
export let online = true;

const nhost = getNhostClient();
const toastStore = getToastStore();

async function signOut() {
  await nhost.auth.signOut({ all: true });
  Cookies.remove(NHOST_SESSION_KEY, { path: '/' });
  const message: App.Superforms.Message = { type: 'success', message: 'Signout sucessfull 😎' } as const;
  handleMessage(message, toastStore);
  await goto(i18n.resolveRoute(ROUTE_SIGNIN), {
    invalidateAll: true,
  });
}
</script>

 <!-- trigger -->
<button class="relative inline-block" use:popup={{event: 'click',target: 'avatarPopup'}}>
  {#if elevated}
    <span class="badge-icon variant-filled-success absolute w-3 h-3 -top-0 -right-0 z-10"></span>
  {/if}
  {#if !online}
    <span class="badge-icon variant-filled-error absolute w-3 h-3 -top-0 -left-0 z-10"></span>
  {/if}
  <Avatar
    {initials}
    {src}
    fill="fill-tertiary-50"
    width="w-11"
    border="border-2 border-surface-300-600-token hover:!border-primary-500"
    cursor="cursor-pointer"
  />
</button>
<!-- popup -->
 <div class="card w-60 p-4 shadow-xl" data-popup="avatarPopup">
  <nav class="list-nav">
    <ul>
      <li>
        <a href="/user/settings">
          <span class="w-6 text-center"><Settings class="w-5 justify-center" /></span>
          <span>Settings</span>
        </a>
      </li>
      <li>
        <a href="/user/profile">
          <span class="w-6 text-center"><CircleUserRound class="w-5 justify-center" /></span>
          <span>Profile</span>
        </a>
      </li>
      <hr class="!my-4" />
      <li>
        <button type="button" on:click={signOut} class="bg-primary-hover-token btn w-full rounded-container-token">
          <LogOut class="w-5 justify-center" />
          <p class="flex-grow text-justify">Sign out</p>
        </button>
      </li>
    </ul>
  </nav>
</div>
