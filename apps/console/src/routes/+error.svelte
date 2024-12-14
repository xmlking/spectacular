<script lang="ts">
import { page } from '$app/stores';
import * as m from '$i18n/messages';
import { i18n } from '$lib/i18n';
import { ParaglideJS } from '@inlang/paraglide-sveltekit';
import { LogoAnim } from '@spectacular/skeleton/components/logos';

const details = $page.error?.details;
</script>

<ParaglideJS {i18n}>
  {#if $page}
    <div class="flex h-full w-full items-center justify-center">
      <div class="space-y-4 text-center">
        <LogoAnim />
        <h2 class="h2">
          {$page.status}:{#if $page.error}
            {$page.error.message}
          {/if}
        </h2>
        <p>{m.error_page_message()}</p>
        {#if details}
          <div class="text-sm">
            {#if typeof details == 'string'}
              <div>{details}</div>
            {:else}
              {#each Object.entries(details) as [key, value]}
                <div>{key}:{value}</div>
              {/each}
            {/if}
          </div>
        {/if}
      </div>
    </div>
  {/if}
</ParaglideJS>
