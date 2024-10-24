<script lang="ts">
import type { PageData } from './$houdini';
import RulesCard from './rules.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

let { Rules: RulesData } = $derived(data);
let rules = $derived($RulesData.data?.rules ?? []);
</script>

<svelte:head>
  <title>Datablocks | Rules</title>
  <meta name="description" content="Rules list" />
</svelte:head>

<h2 class="h2">Rules</h2>

  {#if $RulesData.fetching}
    <span>loading...</span>
  {:else}
      <span>done....</span>
      <RulesCard {rules}/>
  {/if}



