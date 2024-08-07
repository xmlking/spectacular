<script lang="ts">
import { default as Frame } from '$lib/components/utils/Frame.svelte';
import { CloseButton } from 'flowbite-svelte';
import { CheckCircleSolid, CloseCircleSolid, ExclamationCircleOutline, InfoCircleOutline } from 'flowbite-svelte-icons';
import { slide } from 'svelte/transition';
import { twMerge } from 'tailwind-merge';
import { ToastLevel, dismissToast, toasts } from './store';

export let divClass = 'w-full max-w-xs p-4 z-50';

export let placement:
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right' = 'center';
const placements = {
  'top-left': 'absolute top-0 left-0',
  'top-center': 'absolute top-0 left-1/2 -translate-x-1/2',
  'top-right': 'absolute top-0 right-0',
  center: 'absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2',
  'bottom-left': 'absolute bottom-0 left-0',
  'bottom-center': 'absolute bottom-0 left-1/2 -translate-x-1/2',
  'bottom-right': 'absolute bottom-0 right-0',
};

let toastsClass: string;
$: toastsClass = twMerge(divClass, placements[placement], $$props.class);

let iconClass: string;
$: iconClass = twMerge('inline-flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3');
</script>

{#if $toasts}
  <section class={toastsClass}>
    {#each $toasts as toast (toast.id)}
      <Frame rounded border transition={slide} class="mb-2 w-full max-w-xs p-4" {...$$restProps} role="alert">
        <div class="flex items-center">
          <Frame color={toast.type} rounded class={iconClass}>
            {#if toast.type === ToastLevel.Success}
              <CheckCircleSolid size="xs" ariaLabel="Success icon" />
            {:else if toast.type === ToastLevel.Error}
              <CloseCircleSolid size="xs" ariaLabel="Error icon" />
            {:else if toast.type === ToastLevel.Warning}
              <ExclamationCircleOutline size="xs" ariaLabel="Warning icon" />
            {:else}
              <InfoCircleOutline size="xs" ariaLabel="Info icon" />
            {/if}
          </Frame>
          <div class="w-full text-sm font-normal">
            {toast.message}
          </div>
          {#if toast.dismissible}
            <CloseButton aria-label="Close" on:click={() => dismissToast(toast.id)} />
          {/if}
        </div>
      </Frame>
    {/each}
  </section>
{/if}
