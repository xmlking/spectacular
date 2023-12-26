<script lang="ts">
	import { formatDate, PeriodType } from 'svelte-ux';
	import { scaleBand } from 'd3-scale';
	import { Chart, Svg, Axis, Bars } from 'layerchart';
	import { createDateSeries } from '$lib/utils/genData';

	const data = createDateSeries({
		count: 30,
		min: 20,
		max: 100,
		value: 'integer',
		keys: ['value', 'baseline']
	});
</script>

<div class="h-[300px] rounded border p-4">
	<Chart
		{data}
		x="date"
		xScale={scaleBand().padding(0.4)}
		y="value"
		yDomain={[0, null]}
		yNice
		padding={{ left: 16, bottom: 24 }}
	>
		<Svg>
			<Axis placement="left" grid rule />
			<Axis placement="bottom" format={(d) => formatDate(d, PeriodType.Day, 'short')} rule />
			<Bars radius={4} strokeWidth={1} class="fill-accent-500" />
		</Svg>
	</Chart>
</div>
