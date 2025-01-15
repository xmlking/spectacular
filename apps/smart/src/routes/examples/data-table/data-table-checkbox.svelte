<script lang="ts">
import type { Checkbox } from '@spectacular/ui/components/checkbox';
import type { ComponentProps } from 'svelte';

let { checked = false, controlledChecked = true, ...restProps }: ComponentProps<typeof Checkbox> = $props();
</script>

<Checkbox {checked} {controlledChecked} {...restProps} />
