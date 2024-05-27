<script lang="ts">
import { fly } from 'svelte/transition';
import { count } from './count.js';
</script>

<div class="flex h-8 w-8 items-center justify-center rounded bg-gray-800 text-xs font-medium text-white">
  {#key $count}
    <div class="absolute" in:fly={{ y: -32, duration: 500 }} out:fly={{ y: 32, duration: 500 }}>
      {$count}
    </div>
  {/key}
</div>

<span class="font-mono text-xs text-gray-400">TIMES CLICKED OUTSIDE</span>
