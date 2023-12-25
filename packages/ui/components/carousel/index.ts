import type { SwiperEvents, SwiperOptions } from 'swiper/types';

import Root from './carousel.svelte';
import Slide from './carousel-slide.svelte';

type Options = SwiperOptions;
type Events = SwiperEvents;

export const Carousel = { Root, Slide };
export {
	Root as CarouselRoot,
	Slide as CarouselSlide,
	type Options as CarouselOptions,
	type Events as CarouselEvents
};
