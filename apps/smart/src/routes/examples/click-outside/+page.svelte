<svelte:options runes={true} />
<script lang="ts">
import { clickOutside } from '@spectacular/ui/actions';
let counter = $state(0);
let second: HTMLElement;
let third: HTMLElement;
let include = [third];

function onClickOutside() {
  counter++;
}
</script>

<h1 class="h1"> Svelte Action: click ourside demo</h1>

<div class="grid auto-rows-min gap-4 md:grid-cols-3">
  <section class="aspect-video bg-muted/50 rounded-xl flex items-center justify-center" use:clickOutside={{onClickOutside, include}}>
    <p>click ourside this box</p>
  </section>
  <section class="aspect-video bg-muted/50 rounded-xl flex items-center justify-center" bind:this={second}><p>second box</p></section>
  <section class="aspect-video bg-muted/50 rounded-xl flex items-center justify-center" bind:this={third}><p>third box</p></section>
</div>

<!-- {@debug counter} -->
<p>Clicked: {counter} times</p>

