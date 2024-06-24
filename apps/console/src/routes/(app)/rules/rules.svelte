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

export function hasId(obj) {
  if (obj == null || typeof obj !== 'object') return false;
  return !!('id' in obj);
}

export function toWithId(obj) {
  if (hasId(obj)) return obj;
  throw new Error('.id is required');
}

$: rulesWithId = rules.map(toWithId);
</script>

<div class="divide-y divide-slate-200">
  {#each rulesWithId as rule (rule.id)}
    <div transition:fade={defaultDE} animate:flip={defaultDE}>
      <RuleItem {rule} />
    </div>
  {/each}
</div>
