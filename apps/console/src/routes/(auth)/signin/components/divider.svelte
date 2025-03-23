<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<!-- Divider -->
<div class="my-8 flex items-center">
  <div class="grow border-b border-slate-400"></div>
  <span class="shrink px-1 pb-1 text-xs uppercase text-gray-500"> {#if children}{@render children()}{:else}/{/if}</span>
  <div class="grow border-b border-slate-400"></div>
</div>
