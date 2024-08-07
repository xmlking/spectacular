<script lang="ts">
/**
		Generates an HTML y-axis.
		@type {Boolean} [gridlines=true] - Extend lines from the ticks into the chart space
		@type {Boolean} [tickMarks=false] - Show a vertical mark for each tick.
		@type {Function} [formatTick=d => d] - A function that passes the current tick value and expects a nicely formatted value in return.
		@type {Number|Array|Function} [ticks=4] - If this is a number, it passes that along to the [d3Scale.ticks](https://github.com/d3/d3-scale) function. If this is an array, hardcodes the ticks to those values. If it's a function, passes along the default tick values and expects an array of tick values in return.
		@type {Number} [xTick=0] - How far over to position the text marker.
		@type {Number} [dxTick=0] - Any optional value passed to the `dx` attribute on the text marker and tick mark (if visible). This is ignored on the text marker if your scale is ordinal.
		@type {Number} [yTick=0] - How far up and down to position the text marker.
		@type {Number} [dyTick=0] - Any optional value passed to the `dy` attribute on the text marker and tick mark (if visible). This is ignored on the text marker if your scale is ordinal.
	*/
import { getContext } from 'svelte';
const { padding, xRange, yScale } = getContext('LayerCake');
export let gridlines = true;
export let tickMarks = false;
export let formatTick = (d) => d;
export let ticks = 4;
export let xTick = 0;
export let yTick = 0;
export let dxTick = 0;
export let dyTick = -4;
export let textAnchor = 'start';
$: isBandwidth = typeof $yScale.bandwidth === 'function';
$: tickVals = Array.isArray(ticks)
  ? ticks
  : isBandwidth
    ? $yScale.domain()
    : typeof ticks === 'function'
      ? ticks($yScale.ticks())
      : $yScale.ticks(ticks);
</script>

<g class="axis y-axis" transform="translate({-$padding.left}, 0)">
  {#each tickVals as tick}
    <g
      class="tick tick-{tick}"
      transform="translate({$xRange[0] + (isBandwidth ? $padding.left : 0)}, {$yScale(tick)})"
    >
      {#if gridlines !== false}
        <line
          class="gridline"
          x2="100%"
          y1={yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}
          y2={yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}
        />
      {/if}
      {#if tickMarks === true}
        <line
          class="tick-mark"
          x1="0"
          x2={isBandwidth ? -6 : 6}
          y1={yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}
          y2={yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}
        />
      {/if}
      <text
        x={xTick}
        y={yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}
        dx={isBandwidth ? -9 : dxTick}
        dy={isBandwidth ? 4 : dyTick}
        style="text-anchor:{isBandwidth ? 'end' : textAnchor};">{formatTick(tick)}</text
      >
    </g>
  {/each}
</g>

<style>
.tick {
  font-size: 0.725em;
  font-weight: 200;
}
.tick line {
  stroke: #aaa;
}
.tick .gridline {
  stroke-dasharray: 2;
}
.tick text {
  fill: #666;
}
.tick.tick-0 line {
  stroke-dasharray: 0;
}
</style>
