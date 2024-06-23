<script lang="ts">
// Ref: https://github.com/hansaskov/my-skeleton-app/blob/master/src/lib/components/Avatar.svelte
import { Avatar, popup } from '@skeletonlabs/skeleton';
import type { PopupSettings } from '@skeletonlabs/skeleton';
import { Settings } from 'lucide-svelte';
import { CircleUserRound } from 'lucide-svelte';
import { LogOut } from 'lucide-svelte';

export let initials: string | undefined = undefined;
export let src: string | undefined = undefined;
</script>

<!-- Avatar button-->
 <!-- trigger -->
<button use:popup={{event: 'click',target: 'avatarPopup'}}>
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
              <a href="/settings">
                <span class="w-6 text-center"><Settings class="w-5 justify-center" /></span>
                <span>Settings</span>
              </a>
            </li>
            <li>
              <a href="/profile">
                <span class="w-6 text-center"><CircleUserRound class="w-5 justify-center" /></span>
                <span>Profile</span>
              </a>
            </li>
            <hr class="!my-4" />
            <li>
              <form method="POST" action="/signout">
                <button type="submit" class="bg-primary-hover-token btn w-full rounded-container-token">
                  <LogOut class="w-5 justify-center" />
                  <p class="flex-grow text-justify">Sign out</p>
                </button>
              </form>
            </li>
          </ul>
        </nav>
</div>
