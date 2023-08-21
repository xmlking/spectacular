<script lang="ts">
	import {
		Area,
		AxisRadial,
		AxisX,
		AxisY,
		Bar,
		Beeswarm,
		BeeswarmForce,
		Brush,
		Line
	} from '$lib/blocks/charts';
	import { afterUpdate } from 'svelte';

	let container: HTMLElement;
	let positions = [];
	let lastId = 'axis';
	let activeSection = 'axis';
	let anchors: NodeListOf<HTMLElement>;
	afterUpdate(() => {
		if (typeof window !== 'undefined') {
			anchors = container.querySelectorAll('[id]');
			lastId = window.location.hash.slice(1);
			activeSection = lastId || 'axis';
			onresize();
			onscroll();
			window.addEventListener('scroll', onscroll, true);
			window.addEventListener('resize', onresize, true);
			// wait for fonts to load...
			const timeouts = [setTimeout(onresize, 1000), setTimeout(onresize, 5000)];
		}
	});
	function onresize() {
		if (container) {
			const { top } = container.getBoundingClientRect();
			positions = [].map.call(anchors, (anchor) => {
				return anchor.getBoundingClientRect().top - top;
			});
		}
	}
	function onscroll() {
		const top = -window.scrollY;
		let i = anchors.length;
		while (i--) {
			if (positions[i] + top < 100) {
				const anchor = anchors[i];
				const { id } = anchor;
				if (id !== lastId) {
					activeSection = id;
					// this.fire('scroll', id);
					lastId = id;
				}
				return;
			}
		}
	}
</script>

<!-- https://github.com/rbb-data/svelte-starter/tree/main/src/routes/examples -->
<div bind:this={container}>
	<h2 class="m-5">Metrics</h2>

	<div class="component-blocks">
		<div class="subgroup-blocks">
			<div class="component-block">
				<div class="block-container">
					<AxisX />
				</div>
			</div>

			<div class="component-block">
				<div class="block-container">
					<AxisY />
				</div>
			</div>

			<div class="component-block">
				<div class="block-container">
					<Area />
				</div>
			</div>

			<div class="component-block">
				<div class="block-container">
					<AxisRadial />
				</div>
			</div>

			<div class="component-block">
				<div class="block-container">
					<Brush />
				</div>
			</div>

			<div class="component-block">
				<div class="block-container">
					<Line />
				</div>
			</div>

			<div class="component-block">
				<div class="block-container">
					<Bar />
				</div>
			</div>

			<div class="component-block">
				<div class="block-container">
					<Beeswarm />
				</div>
			</div>

			<div class="component-block">
				<div class="block-container">
					<BeeswarmForce />
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.component-block {
		width: 28%;
		margin-bottom: 21px;
		margin-right: 21px;
		height: 200px;
		background-color: #fff;
		box-shadow: 0 0 12px #ccc;
		border: 1px solid #ccc;
		padding: 14px;
		display: inline-block;
		vertical-align: top;
	}
	.component-block:nth-child(3),
	.component-block:nth-child(6),
	.component-block:nth-child(9),
	.component-block:nth-child(12),
	.component-block:nth-child(15),
	.component-block:nth-child(18),
	.component-block:nth-child(21) {
		margin-right: 0;
	}
	@media (max-width: 1150px) {
		.component-block {
			width: 43%;
		}
		.component-block:nth-child(3),
		.component-block:nth-child(6),
		.component-block:nth-child(9),
		.component-block:nth-child(12),
		.component-block:nth-child(15),
		.component-block:nth-child(18),
		.component-block:nth-child(21) {
			margin-right: 21px;
		}
		.component-block:nth-child(even) {
			margin-right: 0 !important;
		}
	}
	@media (max-width: 860px) {
		.component-block {
			width: 40%;
		}
	}
	@media (max-width: 800px) {
		.component-block {
			width: 85%;
		}
	}

	.component-blocks :global(.label) {
		padding: 0 4px;
		display: inline-block;
		border-radius: 2px;
		font-size: 0.9em;
		margin-left: 3px;
	}
	.component-blocks :global(.label.svg) {
		background-color: #f0c;
		color: #fff;
	}
	.component-blocks :global(.label.html) {
		background-color: #fc0;
		color: #000;
	}
	.component-blocks :global(.label.webgl) {
		background-color: #0cf;
		color: #fff;
	}

	.component-blocks :global(.label.percent-range) {
		background-color: #c0f;
		color: #fff;
	}
	.component-blocks :global(.label.canvas) {
		background-color: #cf0;
		color: #000;
	}
	.block-container {
		position: relative;
		width: 100%;
		height: calc(100% - 24px);
	}
</style>
