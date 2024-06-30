<script lang="ts">
import { Button as ButtonPrimitive } from 'bits-ui';
import { cn } from '#utils';
import { type Events, type Props, buttonVariants } from './index.js';

type $$Props = Props;
type $$Events = Events;

let className: $$Props['class'] = undefined;
export let variant: $$Props['variant'] = 'filled';
export let color: $$Props['color'] = 'surface';
export let size: $$Props['size'] = 'md';
export let builders: $$Props['builders'] = [];
export { className as class };
</script>

<ButtonPrimitive.Root
	{builders}
	class={cn(buttonVariants({ variant, color, size, className }))}
	type="button"
	{...$$restProps}
	on:click
	on:keydown
>
	<slot />
</ButtonPrimitive.Root>
