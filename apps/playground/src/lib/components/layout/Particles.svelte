 <script lang="ts">
	import { onMount } from 'svelte';
    //import { loadFull } from 'tsparticles'; // if you are going to use `loadFull`, install the "tsparticles" package too.
    import { loadSlim } from 'tsparticles-slim'; // if you are going to use `loadSlim`, install the "tsparticles-slim" package too.
	import type { ComponentType } from 'svelte';

	export let count = 200;
	export let size = 2;

	let ParticlesComponent: ComponentType;
	let loaded = false;

	onMount(async () => {
		const module = await import('svelte-particles');
		ParticlesComponent = module.default;
	});

    const particlesConfig = {
        particles: {
            color: {
                value: "#000",
            },
            links: {
                enable: true,
                color: "#000",
            },
            move: {
                enable: true,
            },
            number: {
                value: count,
            },
			size: {
				value: size
			}
        },
    };

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

	const onParticlesLoaded = (event) => {
        const particlesContainer = event.detail.particles;
        // you can use particlesContainer to call all the Container class
        // (from the core library) methods like play, pause, refresh, start, stop
		loaded = true;
	};
	const particlesInit = async (engine) => {
        // you can use main to customize the tsParticles instance adding presets or custom shapes
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        //await loadFull(engine);
        await loadSlim(engine);
	};
</script>

<div>
	<svelte:component
		this={ParticlesComponent}
		id="particles"
		class={loaded ? 'particles particles-loaded' : 'particles'}
		options={particlesConfig}
		on:particlesLoaded={onParticlesLoaded}
		{particlesInit}
	/>
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
