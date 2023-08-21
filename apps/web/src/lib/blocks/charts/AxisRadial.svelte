<script lang="ts">
	import AxisRadial from '$lib/components/layercake/AxisRadial.svelte';
	import { LayerCake, Svg } from 'layercake';
	// This example loads csv data as json using @rollup/plugin-dsv
	import data from '$mocks/data/radarScores';
	const seriesKey = 'name';
	const xKey = ['fastball', 'change', 'slider', 'cutter', 'curve'];
	const seriesNames = Object.keys(data[0]).filter((d) => d !== seriesKey);
	const padding = 35;
</script>

<div class="chart-container">
	<LayerCake
		padding={{ top: padding, right: padding, bottom: padding, left: padding }}
		x={xKey}
		xDomain={[0, 10]}
		xRange={({ height }) => [0, height / 2]}
		{data}
	>
		<Svg>
			<AxisRadial />
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
