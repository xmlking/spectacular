<script lang="ts">
	import type { ComponentProps } from "svelte";
	import CaretSort from "svelte-radix/CaretSort.svelte";
	import { Button } from "@spectacular/ui/components/button";

	let { variant = "ghost", ...restProps }: ComponentProps<typeof Button> = $props();
</script>

<Button {variant} {...restProps}>
	Email
	<CaretSort class="ml-2 size-4" />
</Button>
