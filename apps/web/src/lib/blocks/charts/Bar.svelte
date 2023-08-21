<script lang="ts">
	import Bar from '$lib/components/layercake/Bar.svelte';
	import data from '$mocks/data/groups';
	import { scaleBand } from 'd3-scale';
	import { LayerCake, Svg } from 'layercake';
	const xKey = 'value';
	const yKey = 'year';
</script>

<div class="chart-container">
	<LayerCake
		padding={{ top: 10 }}
		x={xKey}
		y={yKey}
		yScale={scaleBand().paddingInner([0.05]).round(true)}
		yDomain={['1979', '1980', '1981', '1982', '1983']}
		xDomain={[0, null]}
		{data}
	>
		<Svg>
			<Bar />
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
