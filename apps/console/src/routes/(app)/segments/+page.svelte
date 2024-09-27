<script lang="ts">
import LayeredGraphLayout from './components/layered-graph-layout.svelte';
</script>

<svelte:head>
  <title>Datablocks | Microsegmentation</title>
  <meta name="description" content="Micro Segmentation" />
</svelte:head>

<div class="page-container">
  <section class="space-y-4">
    <h1 class="h1">Micro Segmentation</h1>
    <p>Network micro segmentation(W.I.P)</p>
  </section>

  <section class="space-y-4">
    <h3 class="h3">Microsegmentation</h3>
    <div class="card p-4">
      <div class="rounded border p-4">
        <LayeredGraphLayout />
      </div>
    </div>
  </section>
</div>
