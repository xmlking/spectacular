<script lang="ts">
import  { Button } from '@repo/ui/components/ui/button/index.js';
import type { ComponentProps } from 'svelte';
import CaretSort from 'svelte-radix/CaretSort.svelte';

let { variant = 'ghost', ...restProps }: ComponentProps<typeof Button> = $props();
</script>

<Button {variant} {...restProps}>
	Email
	<CaretSort class="ml-2 size-4" />
</Button>
