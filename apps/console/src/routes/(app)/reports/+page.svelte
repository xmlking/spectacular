<script lang="ts">
import { extent, ticks } from 'd3-array';
import { scaleBand, scaleOrdinal, scaleSequential, scaleTime } from 'd3-scale';
import { interpolateTurbo } from 'd3-scale-chromatic';
import { stack } from 'd3-shape';
import { format } from 'date-fns';
import {
  AreaStack,
  Axis,
  Bars,
  Chart,
  Highlight,
  Legend,
  LinearGradient,
  Spline,
  Svg,
  Tooltip,
  TooltipItem,
} from 'layerchart';
import { flatten } from 'svelte-ux/utils/array';
import { PeriodType, formatDate } from 'svelte-ux/utils/date';
import { createDateSeries } from '$lib/utils/genData';
import { temperature as temperatureData } from '$lib/utils/dateSeries';
import Preview from '$lib/components/preview.svelte';

const data = createDateSeries({
  count: 30,
  min: 20,
  max: 100,
  value: 'integer',
  keys: ['value', 'baseline'],
});

const keys = ['apples', 'bananas', 'oranges'];
const data1 = createDateSeries({ count: 30, min: 50, max: 100, value: 'integer', keys });
const stackData = stack().keys(keys)(data1);

const temperatureColor = scaleSequential(extent(temperatureData, (d) => d.value) as [number, number], interpolateTurbo);
</script>

<Preview>
  <div class="h-[300px] rounded border p-4">
    <Chart
      data={stackData}
      flatData={flatten(stackData)}
      x={(d) => d.data.date}
      xScale={scaleTime()}
      y={[0, 1]}
      yNice
      r="key"
      rScale={scaleOrdinal()}
      rDomain={keys}
      rRange={['var(--color-red-500)', 'var(--color-green-500)', 'var(--color-blue-500)']}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Axis placement="left" grid rule />
        <Axis placement="bottom" format={(d) => formatDate(d, PeriodType.Day, 'short')} rule />
        <AreaStack line={{ 'stroke-width': 2 }} />
      </Svg>
    </Chart>
  </div>
</Preview>

<Preview>
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
</Preview>

<h2>With Tooltip and Highlight</h2>

<Preview>
  <div class="h-[300px] rounded border p-4">
    <Chart
      data={stackData}
      flatData={flatten(stackData)}
      x={(d) => d.data.date}
      xScale={scaleTime()}
      y={[0, 1]}
      yNice
      r="key"
      rScale={scaleOrdinal()}
      rDomain={keys}
      rRange={['var(--color-red-500)', 'var(--color-green-500)', 'var(--color-blue-500)']}
      padding={{ left: 16, bottom: 24 }}
      tooltip
    >
      <Svg>
        <Axis placement="left" grid rule />
        <Axis placement="bottom" format={(d) => formatDate(d, PeriodType.Day, 'short')} rule />
        <AreaStack line={{ 'stroke-width': 2 }} />
        <Highlight points lines />
      </Svg>
      <Tooltip header={(data) => format(data.data.date, 'eee, MMMM do')} let:data>
        {#each keys as key}
          <TooltipItem label={key} value={data.data[key]} />
        {/each}
      </Tooltip>
    </Chart>
  </div>
</Preview>
<h2>Gradient encoding</h2>
<Preview>
  <div class="h-[300px] rounded border p-4">
    <Chart data={temperatureData} x="date" xScale={scaleTime()} y="value" yNice padding={{ left: 16, bottom: 24 }}>
      <Svg>
        <Axis placement="left" grid rule />
        <Axis placement="bottom" format={(d) => formatDate(d, PeriodType.Day, 'short')} rule />
        <LinearGradient stops={ticks(1, 0, 10).map(temperatureColor.interpolator())} vertical let:url>
          <Spline class="stroke-2" stroke={url} />
        </LinearGradient>
      </Svg>
      <Legend scale={temperatureColor} title="Temperature (°F)" placement="top-right" width={240} class="-top-[14px]" />
    </Chart>
  </div>
</Preview>
