<script lang="ts">
	import Area from '$lib/components/layercake/Area.svelte';
	import AxisX from '$lib/components/layercake/AxisX.svelte';
	import AxisY from '$lib/components/layercake/AxisY.svelte';
	import Line from '$lib/components/layercake/Line.svelte';
	import points from '$mocks/data/points';
	import { LayerCake, Svg } from 'layercake';
	const xKey = 'myX';
	const yKey = 'myY';
</script>

<div class="chart-container">
	<LayerCake
		padding={{ top: 8, right: 10, bottom: 20, left: 25 }}
		x={xKey}
		y={yKey}
		yNice={4}
		yDomain={[0, null]}
		data={points}
	>
		<Svg>
			<AxisX />
			<AxisY ticks={4} />
			<Line />
			<Area />
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
