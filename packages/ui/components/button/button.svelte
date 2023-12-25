<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';
	import { cn } from '$ui/utils';
	import { buttonVariants, type ButtonProps, type ButtonEvents } from '.';

	type $$Props = ButtonProps;
	type $$Events = ButtonEvents;

	let className: $$Props['class'] = undefined;
	export let variant: $$Props['variant'] = 'default';
	export let size: $$Props['size'] = 'default';
	export let builders: $$Props['builders'] = [];
	export { className as class };
</script>

<ButtonPrimitive.Root
	{builders}
	class={cn(buttonVariants({ variant, size, className }))}
	{...$$restProps}
	on:click
	on:keydown
>
	<slot />
</ButtonPrimitive.Root>
