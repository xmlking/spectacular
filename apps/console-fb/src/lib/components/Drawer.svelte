<script lang="ts">
import { fly } from 'svelte/transition';
import { twMerge } from 'tailwind-merge';

export let show = true;
export let asideClass = 'w-64';
// TODO replace this with flowbite Drawer https://flowbite-svelte.com/components/drawer
</script>

{#if show}
  <aside
    transition:fly={{ x: -250, opacity: 1 }}
    class={twMerge(asideClass, $$props.class)}
    {...$$restProps}
    aria-label="Sidebar"
  >
    <slot />
  </aside>
{/if}
