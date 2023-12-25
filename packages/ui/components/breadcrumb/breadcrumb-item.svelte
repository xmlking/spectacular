<script lang="ts">
	import { BreadcrumbSeparator } from '.';
	import { cn } from '$ui/utils';
	import type { HTMLLiAttributes } from 'svelte/elements';

	type $$Props = HTMLLiAttributes & { href?: string; isCurrent?: boolean; isLastChild?: boolean };

	let ref: HTMLLIElement;
	let className: $$Props['class'] = undefined;
	export let href: $$Props['href'] = undefined;
	export let isCurrent: $$Props['isCurrent'] = false;
	export let isLastChild: $$Props['isLastChild'] = false;
	export { className as class };

	$: if (ref?.parentElement) {
		const children = Array.from(ref.parentElement.querySelectorAll('li'));
		isLastChild = children.at(-1) === ref;
	}
</script>

<li
	bind:this={ref}
	class={cn('group inline-flex items-center', className)}
	aria-current={isCurrent ? 'page' : undefined}
	{...$$restProps}
>
	<svelte:element
		this={href ? 'a' : 'span'}
		class={href ? 'group-hover:underline' : undefined}
		{href}
	>
		<slot />
	</svelte:element>
</li>

{#if !isLastChild}
	<BreadcrumbSeparator />
{/if}
