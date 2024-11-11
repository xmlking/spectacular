<svelte:options runes={true} />
<script lang="ts">
  import { buttonVariants } from '@spectacular/ui/components/button';
  import { hover } from "$lib/actions";
  import { writable } from "svelte/store";

  const hovered = writable(false);

</script>

<h1> Svelte Action: hover demo</h1>
<div class="card">
  <button class={buttonVariants({ variant: "outline" })}  use:hover={hovered} >Mouse Over Me: {$hovered}</button>
  <p>Hovered: {$hovered}</p>
</div>
