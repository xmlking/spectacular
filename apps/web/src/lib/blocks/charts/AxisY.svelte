<script>
	import AxisY from '$lib/components/layercake/AxisY.svelte';
	import data from '$mocks/data/points';
	import { LayerCake, Svg } from 'layercake';
	const xKey = 'myX';
	const yKey = 'myY';
</script>

<div class="chart-container">
	<LayerCake x={xKey} y={yKey} {data}>
		<Svg>
			<AxisY ticks={4} />
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
