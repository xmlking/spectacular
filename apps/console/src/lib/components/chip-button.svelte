<script lang="ts">
export let tags: string[] | null;
</script>

{ #if tags === null}
  N/A
{:else}
  {#each tags as tag }
    <span class="chip {tag? 'variant-filled' : 'variant-soft'}">
      <span>{tag}</span>
      </span>&nbsp
  {/each}
{/if}
<slot />
