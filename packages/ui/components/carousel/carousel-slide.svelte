<script lang="ts">
	import { cn } from '$ui/utils';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { SwiperSlide } from 'swiper/element';

	type $$Props = HTMLAttributes<SwiperSlide> & { lazy?: boolean };

	let className: $$Props['class'] = undefined;
	export let lazy: $$Props['lazy'] = false;
	export { className as class };
</script>

<swiper-slide class={cn('pointer-events-auto', className)} {...$$restProps} {lazy}>
	<div class="swiper-slide-wrapper">
		<slot />
	</div>
</swiper-slide>

<style lang="postcss">
	div.swiper-slide-wrapper {
		@apply h-full w-full;
	}
</style>
