<script lang="ts">
import NetworkGraph from './components/network.svelte';
</script>

<svelte:head>
  <title>Datablocks | Network</title>
  <meta name="description" content="Datablocks  Network" />
</svelte:head>

<div class="page-container">
  <section class="space-y-4">
    <h1 class="h1">Network Builder</h1>
    <p>Virtual Private Network (W.I.P)</p>
  </section>

  <section class="space-y-4">
    <h3 class="h3">Builder</h3>
    <div class="card p-4">
      <div class="rounded border p-4">
        <NetworkGraph />
      </div>
    </div>
  </section>
</div>
