<script lang="ts">
	// if you are going to use `loadFull`, install the "tsparticles" package.
	//import { loadFull } from 'tsparticles';
	// if you are going to use `loadSlim`, install the "tsparticles-slim" package.
	import { loadSlim } from '@tsparticles/slim';
	import { particlesInit } from '@tsparticles/svelte';
	import type { Container, Engine } from '@tsparticles/engine';
	import { browser } from '$app/environment';

	export let count = 200;
	export let size = 2;

	let loaded = false;

	void particlesInit(async (engine: Engine) => {
		await loadSlim(engine);
	});

	const ParticlesConstructor = browser
		? import('@tsparticles/svelte').then((module) => module.default)
		: new Promise(() => {});

	const particlesConfig = {
		particles: {
			color: {
				value: '#000'
			},
			links: {
				enable: true,
				color: '#000'
			},
			move: {
				enable: true
			},
			number: {
				value: count
			},
			size: {
				value: size
			}
		}
	};

	// eslint-disable-next-line  no-unused-vars, @typescript-eslint/no-unused-vars
	const particlesConfig2 = {
		detectRetina: true,
		particles: {
			color: {
				value: ['#fff', '#bf95f9', '#ef9fbc']
			},
			lineLinked: {
				blink: false,
				color: 'random',
				consent: false,
				distance: 40,
				enable: true,
				opacity: 0.3,
				width: 1
			},
			move: {
				attract: {
					enable: false,
					rotate: {
						x: 600,
						y: 1200
					}
				},
				bounce: false,
				direction: 'none',
				enable: true,
				outMode: 'bounce',
				random: false,
				speed: 0.5,
				straight: false
			},
			number: {
				density: {
					enable: false,
					area: 2000
				},
				limit: 0,
				value: count
			},
			opacity: {
				animation: {
					enable: true,
					minimumValue: 0.1,
					speed: 2,
					sync: false
				},
				random: false,
				value: 0.1
			},
			shape: {
				type: 'circle'
			},
			size: {
				value: size
			}
		},
		polygon: {
			move: {
				radius: 5
			},
			inlineArrangement: 'equidistant',
			scale: 0.6,
			type: 'inline',
			position: {
				x: 15,
				y: 10
			}
		}
	};

	const onParticlesLoaded = (event: { detail: { particles: any } }) => {
		const particlesContainer = event.detail.particles;
		console.log('onParticlesLoaded...', particlesContainer);
		// you can use particlesContainer to call all the Container class
		// (from the core library) methods like play, pause, refresh, start, stop
		loaded = true;
	};
</script>

<div style="display: contents">
	{#await ParticlesConstructor}
		<p>Loading...</p>
	{:then component}
		<svelte:component
			this={component}
			id="tsparticles"
			options={particlesConfig}
			class={loaded ? 'particles particles-loaded' : 'particles'}
			on:particlesLoaded={onParticlesLoaded}
		/>
	{:catch error}
		<p>Something went wrong: {error.message}</p>
	{/await}
</div>

<style lang="postcss">
	/* Note that using global styles this way is bad practice in larger applications */
	/* You can scope this more narrowly if you have a wrapper element: i.e., <div> */
	* > :global(.particles) {
		visibility: hidden;
		opacity: 0;
		transition:
			visibility 0s,
			opacity 1s linear;
	}
	* > :global(.particles-loaded) {
		visibility: visible;
		opacity: 1;
	}
</style>
