<script lang="ts">
// Ref: https://github.com/hansaskov/my-skeleton-app/blob/master/src/lib/components/Avatar.svelte
import { Avatar, popup } from '@skeletonlabs/skeleton';
import type { PopupSettings } from '@skeletonlabs/skeleton';
import { Settings } from 'lucide-svelte';
import { CircleUserRound } from 'lucide-svelte';
import { LogOut } from 'lucide-svelte';

const popupSettings: PopupSettings = {
  event: 'click',
  target: 'avatarPopup',
  placement: 'bottom-end',
  // Close the popup when the item is clicked
  closeQuery: '.listbox-item',
};

export let initials: string | undefined = undefined;
export let src: string | undefined = undefined;
</script>

<!-- Avatar button-->
<button use:popup={popupSettings}>
  <Avatar
    {initials}
    {src}
    fill="fill-tertiary-50"
    width="w-11"
    border="border-2 	border-surface-300-600-token hover:!border-primary-500"
    cursor="cursor-pointer"
  /></button
>

<!-- Pop up -->
<div class="card w-48 rounded-container-token" data-popup="avatarPopup">
  <div class="w-full">
    <a href="/settings" class="bg-primary-hover-token btn w-full rounded-container-token">
<!--      <iconify-icon class="w-5 justify-center" icon="lucide:settings" />-->
      <Settings class="w-5 justify-center" />
      <p class="flex-grow text-justify">Settings</p>
    </a>
    <hr />
    <a href="/profile" class="bg-primary-hover-token btn w-full rounded-container-token">
      <CircleUserRound class="w-5 justify-center" />
      <p class="flex-grow text-justify">Profile</p>
    </a>
    <hr />
    <form method="POST" action="/signout">
      <button type="submit" class="bg-primary-hover-token btn w-full rounded-container-token">
        <LogOut class="w-5 justify-center" />
        <p class="flex-grow text-justify">Log out</p>
      </button>
    </form>
  </div>
</div>
