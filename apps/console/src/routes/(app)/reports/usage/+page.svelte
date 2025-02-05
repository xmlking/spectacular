<script lang="ts">
import DagreGraph from '../access/components/dagre.svelte';
import LayeredGraphLayout from '../access/components/layered-graph-layout.svelte';
import MultiLineChart from '../access/components/multi-line-chart.svelte';
import NetworkGraph from '../access/components/network.svelte';
import StackedAreaChart from '../access/components/stacked-area-chart.svelte';
</script>

<svelte:head>
  <title>Datablocks | Reports</title>
  <meta name="description" content="Reports" />
</svelte:head>

<div class="page-container">
  <section class="space-y-4">
    <h1 class="h1">Reports Gallery</h1>
    <p>These are sample graphs</p>
  </section>

  <section class="space-y-4">
    <h3 class="h3">Multi Line Chart</h3>
    <div class="card p-4">
      <div class="rounded border p-4">
        <MultiLineChart />
      </div>
    </div>
  </section>

  <section class="space-y-4">
    <h3 class="h3">Stacked Area Chart with XYLabels</h3>
    <div class="card p-4">
      <div class="rounded border p-4">
        <StackedAreaChart />
      </div>
    </div>
  </section>

  <section class="space-y-4">
    <h3 class="h3">Pipeline</h3>
    <div class="card p-4">
      <div class="rounded border p-4">
        <NetworkGraph />
      </div>
    </div>
  </section>

  <section class="space-y-4">
    <h3 class="h3">DagreGraph</h3>
    <div class="card p-4">
      <div class="rounded border p-4">
        <DagreGraph />
      </div>
    </div>
  </section>

  <section class="space-y-4">
    <h3 class="h3">Layered Graph Layout</h3>
    <div class="card p-4">
      <div class="rounded border p-4">
        <LayeredGraphLayout />
      </div>
    </div>
  </section>
</div>
