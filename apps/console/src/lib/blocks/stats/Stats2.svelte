<script lang="ts">
</script>

<div
	class="order-2 flex flex-col justify-around bg-black py-32 py-4 md:h-auto
            md:w-1/2 md:py-1 md:pb-4"
>
	<div class="bg-cir-grad flex justify-center px-4">
		<img class="h-v50" src="./coverImage.png" alt="cover" />
	</div>
	<div class="flex flex-col justify-around md:flex-row">
		<div class="stats mt-12 md:mt-0"
			><h1>250+</h1><h3 class="mt-4 text-xl text-gray-500" style="letter-spacing:5px"
				>COMPONENTS</h3
			></div
		>
		<div class="stats mt-9 md:mt-0"
			><h1>170+</h1><h3 class="mt-4 text-xl text-gray-500" style="letter-spacing:5px"
				>ICONS</h3
			></div
		>
		<div class="stats mt-9 md:mt-0"
			><h1>200+</h1><h3 class="mt-4 text-xl text-gray-500" style="letter-spacing:5px"
				>SCREENS</h3
			></div
		>
	</div>
</div>

<style lang="postcss">
	.bg-cir-grad {
		background-image: radial-gradient(rgb(75, 85, 99), #000 60%, #000);
	}
	.stats {
		@apply flex flex-col text-center;
	}
	.stats > h1 {
		@apply bg-gradient-to-t from-black to-white bg-clip-text text-5xl font-black text-transparent md:text-6xl;
	}
</style>
