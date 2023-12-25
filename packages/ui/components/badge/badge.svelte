<script lang="ts">
	import { cn } from '$ui/utils';
	import { badgeVariants, type BadgeVariant } from '.';

	let className: string | undefined | null = undefined;
	export let href: string | undefined = undefined;
	export let variant: BadgeVariant = 'default';
	export { className as class };
</script>

<svelte:element
	this={href ? 'a' : 'span'}
	{href}
	class={cn(badgeVariants({ variant, className }))}
	{...$$restProps}
>
	<slot />
</svelte:element>
