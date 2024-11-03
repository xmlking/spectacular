<script lang="ts">
	import type { SVGAttributes } from "svelte/elements";

	let restProps: SVGAttributes<SVGElement> = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" width="100pt" height="100pt" version="1.1" viewBox="0 0 100 100"  {...restProps}>
	<path d="m43 37c0 2.668-4 2.668-4 0s4-2.668 4 0"></path>
	<path d="m61 37c0 2.668-4 2.668-4 0s4-2.668 4 0"></path>
	<path d="m35 54h13v13h-10.191c-3.0508 0-5.8906 1.5195-7.5781 4.0586l-3.8906 5.8281c-0.30078 0.44141-0.39844 0.98047-0.30078 1.5 0.10156 0.51953 0.41016 0.96875 0.85156 1.2695s0.98047 0.39844 1.5 0.30078c0.51953-0.10156 0.98047-0.41016 1.2695-0.85156l3.8906-5.8281c0.94922-1.4297 2.5391-2.2812 4.25-2.2812h24.391c1.7109 0 3.3008 0.85156 4.25 2.2812l3.8906 5.8281c0.30078 0.44141 0.75 0.75 1.2695 0.85156 0.51953 0.10938 1.0586 0 1.5-0.30078 0.44141-0.30078 0.75-0.75 0.85156-1.2695s0-1.0586-0.30078-1.5l-3.8906-5.8281c-1.6914-2.5391-4.5312-4.0586-7.5781-4.0586h-10.191v-13h13c6.6211 0 12-5.3789 12-12v-10c0-6.6211-5.3789-12-12-12h-30c-6.6211 0-12 5.3789-12 12v10c0 6.6211 5.3789 12 12 12zm-8-22c0-4.4102 3.5898-8 8-8h30c4.4102 0 8 3.5898 8 8v10c0 4.4102-3.5898 8-8 8h-30c-4.4102 0-8-3.5898-8-8z"></path>
 </svg>

<!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...restProps}>
	<rect width="256" height="256" fill="none" />
	<line
		x1="208"
		y1="128"
		x2="128"
		y2="208"
		fill="none"
		stroke="#EB4F27"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="16"
	/>
	<line
		x1="192"
		y1="40"
		x2="40"
		y2="192"
		fill="none"
		stroke="#EB4F27"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="16"
	/>
</svg> -->
