<script lang='ts'>
import { VisSingleContainer, VisGraph } from '@unovis/svelte';
import { GraphLayoutType, type GraphNodeShape } from '@unovis/ts';
import { data, type NodeDatum, type LinkDatum } from './dagar.data';

const layoutType = GraphLayoutType.Dagre;
const nodeLabel = (n: NodeDatum) => n.label;
const nodeShape = (n: NodeDatum) => n.shape as GraphNodeShape;
const nodeStroke = (l: LinkDatum) => l.color;
const linkFlow = (l: LinkDatum) => l.active;
const linkStroke = (l: LinkDatum) => l.color;
</script>

<VisSingleContainer {data} height={600}>
  <VisGraph
    {layoutType}
    {nodeLabel}
    {nodeShape}
    {nodeStroke}
    {linkFlow}
    {linkStroke}
  />
</VisSingleContainer>
