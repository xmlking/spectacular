<script>
import Area from '$lib/components/layercake/Area.svelte';
import { LayerCake, Svg } from 'layercake';

import data from '$mocks/data/points';

const xKey = 'myX';
const yKey = 'myY';
data.forEach((d) => {
  d[yKey] = +d[yKey];
});
</script>

<div class="chart-container">
  <LayerCake x={xKey} y={yKey} yDomain={[0, null]} {data}>
    <Svg>
      <Area fill="#ff7ac7" />
    </Svg>
  </LayerCake>
</div>

<style>
/*
		The wrapper div needs to have an explicit width and height in CSS.
		It can also be a flexbox child or CSS grid element.
		The point being it needs dimensions since the <LayerCake> element will
		expand to fill it.
	*/
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
