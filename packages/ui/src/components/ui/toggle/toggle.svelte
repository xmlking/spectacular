<script lang="ts">
import type { Toggle as TogglePrimitive } from 'bits-ui';
import { cn } from '#utils.js';
import { type Size, type Variant, toggleVariants } from './index.js';

type $$Props = TogglePrimitive.Props & {
  variant?: Variant;
  size?: Size;
};
type $$Events = TogglePrimitive.Events;

let className: $$Props['class'] = undefined;
export let variant: $$Props['variant'] = 'default';
export let size: $$Props['size'] = 'default';
export let pressed: $$Props['pressed'] = undefined;
export { className as class };
</script>

<TogglePrimitive.Root
	bind:pressed
	class={cn(toggleVariants({ variant, size, className }))}
	{...$$restProps}
	on:click
>
	<slot />
</TogglePrimitive.Root>
