<script lang="ts">
	import type { ComponentProps } from "svelte";
	import { Checkbox } from "@spectacular/ui/components/checkbox";

	let {
		checked = false,
		controlledChecked = true,
		...restProps
	}: ComponentProps<typeof Checkbox> = $props();
</script>

<Checkbox {checked} {controlledChecked} {...restProps} />
