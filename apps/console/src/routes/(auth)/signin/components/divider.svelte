<script>
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();
</script>

<!-- Divider -->
<div class="my-8 flex items-center">
  <div class="grow border-b border-slate-400"></div>
  <span class="shrink px-1 pb-1 text-xs uppercase text-gray-500"> {#if children}{@render children()}{:else}/{/if}</span>
  <div class="grow border-b border-slate-400"></div>
</div>
