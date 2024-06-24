<script lang="ts">
import type { Rule } from '$houdini';
import { flip } from 'svelte/animate';
import { quintOut } from 'svelte/easing';
import { fade } from 'svelte/transition';
import RuleItem from './rule.svelte';

export const defaultDE = {
  duration: 450,
  easing: quintOut,
};

export let rules: Rule[];
</script>

<div class="divide-y divide-slate-200">
  {#each rules as rule (rule.id)}
    <div transition:fade={defaultDE} animate:flip={defaultDE}>
      <RuleItem {rule} />
    </div>
  {/each}
</div>
