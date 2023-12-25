<script lang="ts">
	import { cn } from '$ui/utils';
	import { ChevronRight } from 'lucide-svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type $$Props = HTMLAttributes<HTMLSpanElement>;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<span role="presentation" class={cn('mx-2 opacity-50', className)}>
	<ChevronRight class="h-4 w-4" />
</span>
