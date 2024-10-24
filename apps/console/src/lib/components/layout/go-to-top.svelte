<script lang="ts">
import { browser } from '$app/environment';
import { scroll } from '$lib/stores';
import { cn } from '@spectacular/skeleton/utils';
import { ArrowUp } from 'lucide-svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import { derived } from 'svelte/store';


const className: $$Props['class'] = undefined;
export { className as class };
  interface Props {
    showAtPixel: number;
  }

  let { showAtPixel = 2000 }: Props = $props();

const elemPage = browser ? document.querySelector('#page') : null;

const gotoTop = () => {
  if (elemPage !== null) {
    elemPage.scrollTop = 0;
    // elemPage.scrollIntoView({ behavior: 'smooth' });
  }
};

// $: showGotoTop = $scroll.y  > showAtPixel;
const showGotoTop = derived(scroll, ($scroll) => {
  return $scroll.y > showAtPixel;
});
</script>

{#if $showGotoTop}
  <button
    type="button"
    onclick={gotoTop}
    title="Go To Top"
    class={cn(
      'fixed bottom-10 right-10 z-50 text-white',
      'transform transition hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none',
      'variant-filled-secondary btn-icon btn-icon-lg',
      className,
    )}
  >
    <ArrowUp />
    <span class="sr-only">Go to top</span>
  </button>
{/if}
