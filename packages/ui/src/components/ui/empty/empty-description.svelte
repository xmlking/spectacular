<script lang="ts">
	import { cn } from "@repo/ui/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let { class: className, children, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
	data-slot="empty-description"
	class={cn(
		"text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
