<script lang='ts'>
import { VisGraph, VisSingleContainer } from '@unovis/svelte';
import { GraphLayoutType, GraphNodeShape } from '@unovis/ts';
import { data, type LinkDatum, type NodeDatum, panels } from './lgl.data';

const layoutElkSettings = {
  'layered.crossingMinimization.forceNodeModelOrder': 'true',
  'elk.direction': 'RIGHT',
  'elk.padding': '[top=30.0,left=10.0,bottom=30.0,right=10.0]',
  'nodePlacement.strategy': 'SIMPLE',
};

const nodeShape = GraphNodeShape.Square;
const nodeStrokeWidth = 1.5;
const nodeLabel = (n: NodeDatum) => n.id;
const layoutType = GraphLayoutType.Elk;
const layoutElkNodeGroups = [(d: NodeDatum) => d.group ?? null, (d: NodeDatum) => d.subGroup ?? null];
</script>

<div class="chart">
  <VisSingleContainer {data} height={'60vh'}>
    <VisGraph
      {nodeShape}
      {nodeStrokeWidth}
      {nodeLabel}
      {layoutType}
      {layoutElkNodeGroups}
      {layoutElkSettings}
      {panels}
      disableZoom
    />
  </VisSingleContainer>
</div>

<style>
  @font-face {
    font-family: 'Font Awesome 6 Free';
    src: url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/webfonts/fa-solid-900.woff2)
      format('woff2');
  }

  .chart {
    --vis-graph-icon-font-family: 'Font Awesome 6 Free';
  }
</style>
