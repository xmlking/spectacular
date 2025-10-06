<script lang="ts">
	import { Separator } from "@repo/ui/components/ui/separator/index.js";
	import { cn } from "@repo/ui/utils.js";
	import type { ComponentProps } from "svelte";

	let { class: className, ...restProps }: ComponentProps<typeof Separator> = $props();
</script>

<Separator
	data-slot="item-separator"
	orientation="horizontal"
	class={cn("my-0", className)}
	{...restProps}
/>
