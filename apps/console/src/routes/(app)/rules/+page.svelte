<script lang="ts">
import type { PageData } from './$houdini';
import RulesCard from './rules.svelte';

export let data: PageData;

$: ({ SearchRules: SearchRulesData } = data);
$: rules = $SearchRulesData.data?.rules ?? [];
</script>

<svelte:head>
  <title>Datablocks | Rules</title>
  <meta name="description" content="Rules list" />
</svelte:head>

<h2 class="h2">Rules</h2>

  {#if $SearchRulesData.fetching}
    <span>loading...</span>
  {:else}
      <span>done....</span>
      <RulesCard {rules}/>
  {/if}



